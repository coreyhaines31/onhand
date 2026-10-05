import AppKit
import KeyboardShortcuts
import SwiftUI

@MainActor
final class AppDelegate: NSObject, NSApplicationDelegate, NSWindowDelegate {
    private let model = AppModel()
    private let updater = AppUpdater()
    private var statusItem: NSStatusItem?
    private var panel: HistoryPanel?
    private var settingsWindow: NSWindow?
    private var previousApp: NSRunningApplication?

    func applicationDidFinishLaunching(_ notification: Notification) {
        NSApp.setActivationPolicy(.accessory)
        installMenu()
        let item = NSStatusBar.system.statusItem(withLength: NSStatusItem.squareLength)
        item.button?.image = NSImage(systemSymbolName: "square.on.square", accessibilityDescription: "On Hand")
        item.button?.toolTip = "On Hand — clipboard history"
        item.button?.target = self
        item.button?.action = #selector(togglePanel)
        statusItem = item
        KeyboardShortcuts.onKeyUp(for: .showHistory) { [weak self] in self?.togglePanel() }
        if !model.preferences.hasStarted || ProcessInfo.processInfo.arguments.contains("--demo") {
            showPanel()
        }
    }

    func applicationShouldHandleReopen(_ sender: NSApplication, hasVisibleWindows flag: Bool) -> Bool {
        showPanel()
        return true
    }

    @objc private func togglePanel() {
        if panel?.isVisible == true { panel?.orderOut(nil) } else { showPanel() }
    }

    private func showPanel() {
        if NSWorkspace.shared.frontmostApplication?.bundleIdentifier != Bundle.main.bundleIdentifier {
            previousApp = NSWorkspace.shared.frontmostApplication
        }
        model.query = ""
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
            window.contentView = NSHostingView(rootView: HistoryView(model: model, onCopy: { [weak self] clip in
                guard let self, self.model.copy(clip) else { return }
                self.panel?.orderOut(nil)
                self.previousApp?.activate()
            }, onSettings: { [weak self] in self?.showSettings() }))
            panel = window
        }
        panel?.center()
        NSApp.activate(ignoringOtherApps: true)
        panel?.makeKeyAndOrderFront(nil)
    }

    func windowDidResignKey(_ notification: Notification) {
        if (notification.object as? NSWindow) === panel { panel?.orderOut(nil) }
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
    override var canBecomeKey: Bool { true }
    override var canBecomeMain: Bool { true }
    override func cancelOperation(_ sender: Any?) { orderOut(nil) }
}
