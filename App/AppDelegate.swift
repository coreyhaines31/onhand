import AppKit
import KeyboardShortcuts
import OnHandCore
import ServiceManagement
import SwiftUI

@MainActor
final class AppDelegate: NSObject, NSApplicationDelegate, NSWindowDelegate {
    private let model = AppModel()
    private let updater = AppUpdater()
    private var statusItem: NSStatusItem?
    private var panel: HistoryPanel?
    private var settingsWindow: NSWindow?
    private var previousApp: NSRunningApplication?
    private var skipNoticeID = 0

    func applicationDidFinishLaunching(_ notification: Notification) {
        NSApp.setActivationPolicy(.accessory)
        installMenu()
        NSWorkspace.shared.notificationCenter.addObserver(
            self, selector: #selector(applicationActivated(_:)),
            name: NSWorkspace.didActivateApplicationNotification, object: nil
        )
        let item = NSStatusBar.system.statusItem(withLength: NSStatusItem.squareLength)
        item.button?.image = BrandIcon.image(size: 19)
        item.button?.toolTip = "On Hand — clipboard history"
        item.button?.target = self
        item.button?.action = #selector(togglePanel(_:))
        statusItem = item
        model.onSkippedSensitive = { [weak self] kind in self?.showNotice("Didn’t save a \(kind.rawValue)") }
        KeyboardShortcuts.onKeyUp(for: .forgetLastCopy) { [weak self] in
            self?.model.forgetLastCopy()
            self?.showNotice("Forgot your last copy")
        }
        KeyboardShortcuts.onKeyUp(for: .showHistory) { [weak self] in self?.togglePanel(nil) }
        for (name, older) in [(KeyboardShortcuts.Name.recallOlder, true), (.recallNewer, false)] {
            KeyboardShortcuts.onKeyDown(for: name) { [weak self] in
                guard let self, !self.model.recallSent(older: older) else { return }
                self.showNotice("No sent messages to bring back here")
            }
        }
        model.syncSentCapture()
        applyLaunchAtLoginDefault()
        if !ProcessInfo.processInfo.arguments.contains("--demo") { observeCommandLine() }
        if !model.preferences.hasStarted || ProcessInfo.processInfo.arguments.contains("--demo") {
            showPanel()
        }
        if ProcessInfo.processInfo.arguments.contains("--demo"), let path = Self.argument("--snapshot") {
            stageSnapshot()
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) { [weak self] in
                self?.writeSnapshot(to: path)
                NSApp.terminate(nil)
            }
        }
    }

    /// Launch at login starts on, once, so turning it off in Settings sticks.
    private func applyLaunchAtLoginDefault() {
        #if !DEBUG
        let defaults = UserDefaults.standard
        guard !defaults.bool(forKey: "appliedLaunchAtLoginDefault") else { return }
        defaults.set(true, forKey: "appliedLaunchAtLoginDefault")
        try? SMAppService.mainApp.register()
        #endif
    }

    /// The `onhand` command edits history directly, then tells the app to catch up.
    private func observeCommandLine() {
        let center = DistributedNotificationCenter.default()
        for name in [AppSignal.historyChanged, AppSignal.pauseChanged] {
            center.addObserver(self, selector: #selector(commandLineSignal(_:)), name: name, object: nil,
                               suspensionBehavior: .deliverImmediately)
        }
    }

    @objc private func commandLineSignal(_ notification: Notification) {
        if notification.name == AppSignal.pauseChanged {
            guard let paused = notification.userInfo?["paused"] as? Bool else { return }
            model.setPaused(paused)
        } else { model.reloadAfterOutsideChange() }
    }

    /// Demo-only: `--snapshot PATH` with optional `--filter NAME`, `--board NAME`, `--query TEXT`, `--preview`
    /// saves the panel as a PNG, for screenshots and design review.
    private func stageSnapshot() {
        if let filter = Self.argument("--filter") { model.filter = filter }
        if let board = Self.argument("--board") { model.board = board }
        if let query = Self.argument("--query") { model.query = query }
        guard ProcessInfo.processInfo.arguments.contains("--preview") else { return }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) { [weak self] in
            guard let self else { return }
            model.previewID = model.visibleClips.first?.id
        }
    }

    private func writeSnapshot(to path: String) {
        guard let view = panel?.contentView,
              let bitmap = view.bitmapImageRepForCachingDisplay(in: view.bounds) else { return }
        view.cacheDisplay(in: view.bounds, to: bitmap)
        try? bitmap.representation(using: .png, properties: [:])?.write(to: URL(fileURLWithPath: path))
    }

    private static func argument(_ name: String) -> String? {
        let arguments = ProcessInfo.processInfo.arguments
        guard let index = arguments.firstIndex(of: name), arguments.indices.contains(index + 1) else { return nil }
        return arguments[index + 1]
    }

    func applicationShouldHandleReopen(_ sender: NSApplication, hasVisibleWindows flag: Bool) -> Bool {
        showPanel()
        return true
    }

    private func showNotice(_ message: String) {
        guard let button = statusItem?.button else { return }
        skipNoticeID += 1
        let id = skipNoticeID
        let image = NSImage(systemSymbolName: "hand.raised.fill", accessibilityDescription: message)
        image?.isTemplate = true
        button.image = image
        button.toolTip = message
        button.setAccessibilityLabel("On Hand: \(message)")
        DispatchQueue.main.asyncAfter(deadline: .now() + 3) { [weak self] in
            guard let self, id == self.skipNoticeID, let button = self.statusItem?.button else { return }
            button.image = BrandIcon.image(size: 19)
            button.toolTip = "On Hand — clipboard history"
            button.setAccessibilityLabel(nil)
        }
    }

    @objc private func togglePanel(_ sender: Any?) {
        if let panel, panel.isVisible {
            if panel.isKeyWindow {
                panel.orderOut(nil)
            } else {
                NSApp.activate(ignoringOtherApps: true)
                panel.makeKeyAndOrderFront(nil)
                model.searchFocusRequest += 1
            }
        } else { showPanel(atStatusItem: sender != nil) }
    }

    private func showPanel(atStatusItem: Bool = false) {
        if NSWorkspace.shared.frontmostApplication?.bundleIdentifier != Bundle.main.bundleIdentifier {
            previousApp = NSWorkspace.shared.frontmostApplication
        }
        model.query = ""
        model.previewID = nil
        model.reload()
        if panel == nil {
            let size = NSSize(width: HandLayout.width, height: HandLayout.height)
            let window = HistoryPanel(contentRect: NSRect(origin: .zero, size: size),
                                      styleMask: [.titled, .fullSizeContentView], backing: .buffered, defer: false)
            window.title = "On Hand"
            window.titleVisibility = .hidden
            window.titlebarAppearsTransparent = true
            window.isMovableByWindowBackground = true
            window.isReleasedWhenClosed = false
            window.level = .floating
            window.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary]
            window.delegate = self
            window.onBack = { [weak self] in
                guard let self, self.model.previewID != nil else { return false }
                self.model.previewID = nil
                return true
            }
            window.onCommand = { [weak self] in self?.handleCommand($0) ?? false }
            window.contentView = NSHostingView(rootView: HistoryView(model: model, onCopy: { [weak self] clip in
                self?.copyClip(clip)
            }, onSettings: { [weak self] in self?.showSettings() }))
            panel = window
        }
        if atStatusItem { positionAtStatusItem() } else { panel?.center() }
        NSApp.activate(ignoringOtherApps: true)
        panel?.makeKeyAndOrderFront(nil)
    }

    private func copyClip(_ clip: Clip) {
        guard model.copy(clip) else { return }
        model.selectedID = clip.id
        if !model.preferences.keepOpen { panel?.orderOut(nil) }
        previousApp?.activate()
    }

    @objc private func applicationActivated(_ notification: Notification) {
        guard let app = notification.userInfo?[NSWorkspace.applicationUserInfoKey] as? NSRunningApplication,
              app.processIdentifier != ProcessInfo.processInfo.processIdentifier else { return }
        previousApp = app
    }

    private func handleCommand(_ key: String) -> Bool {
        guard model.preferences.hasStarted else { return false }
        switch key {
        case "f":
            model.previewID = nil
            model.searchFocusRequest += 1
        case "o":
            if let clip = model.selectedClip { model.previewID = clip.id }
        case "p":
            if let clip = model.selectedClip { model.pin(clip) }
        default:
            guard model.previewID == nil, let number = Int(key), (1...9).contains(number) else { return false }
            let clips = model.visibleClips
            if number <= clips.count { copyClip(clips[number - 1]) }
        }
        return true
    }

    private func positionAtStatusItem() {
        guard let panel, let button = statusItem?.button, let window = button.window,
              let screen = window.screen else { panel?.center(); return }
        let anchor = window.convertToScreen(button.convert(button.bounds, to: nil))
        let visible = screen.visibleFrame.insetBy(dx: 8, dy: 8)
        let origin = NSPoint(x: max(visible.minX, min(anchor.midX - panel.frame.width / 2,
                                                    visible.maxX - panel.frame.width)),
                             y: max(visible.minY, anchor.minY - panel.frame.height - 6))
        panel.setFrameOrigin(origin)
    }

    func windowDidResignKey(_ notification: Notification) {
        if (notification.object as? NSWindow) === panel, !model.preferences.keepOpen { panel?.orderOut(nil) }
    }

    @objc private func showSettings() {
        panel?.orderOut(nil)
        if settingsWindow == nil {
            let window = NSWindow(contentRect: NSRect(x: 0, y: 0, width: 520, height: 620),
                                  styleMask: [.titled, .closable], backing: .buffered, defer: false)
            window.title = "On Hand Settings"
            window.isReleasedWhenClosed = false
            window.contentView = NSHostingView(rootView: SettingsView(model: model, updater: updater))
            settingsWindow = window
        }
        settingsWindow?.center()
        NSApp.activate(ignoringOtherApps: true)
        settingsWindow?.makeKeyAndOrderFront(nil)
    }

    private func installMenu() {
        let main = NSMenu()
        let appMenu = NSMenu()
        appMenu.addItem(withTitle: "Settings…", action: #selector(showSettings), keyEquivalent: ",").target = self
        appMenu.addItem(withTitle: "Quit On Hand", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")
        let appItem = NSMenuItem()
        appItem.submenu = appMenu
        main.addItem(appItem)
        let edit = NSMenu(title: "Edit")
        for (title, action, key) in [("Cut", "cut:", "x"), ("Copy", "copy:", "c"),
                                     ("Paste", "paste:", "v"), ("Select All", "selectAll:", "a")] {
            edit.addItem(withTitle: title, action: Selector(action), keyEquivalent: key)
        }
        let editItem = NSMenuItem(title: "Edit", action: nil, keyEquivalent: "")
        editItem.submenu = edit
        main.addItem(editItem)
        NSApp.mainMenu = main
    }
}

final class HistoryPanel: NSPanel {
    var onBack: (() -> Bool)?
    var onCommand: ((String) -> Bool)?
    override var canBecomeKey: Bool { true }
    override var canBecomeMain: Bool { true }
    override func performKeyEquivalent(with event: NSEvent) -> Bool {
        let modifiers = event.modifierFlags.intersection([.command, .shift, .option, .control])
        if isKeyWindow, modifiers == .command, let key = event.charactersIgnoringModifiers,
           onCommand?(key) == true { return true }
        return super.performKeyEquivalent(with: event)
    }

    override func cancelOperation(_ sender: Any?) {
        if onBack?() != true { orderOut(nil) }
    }
}
