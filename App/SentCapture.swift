import AppKit
import ApplicationServices

/// Watches the text field you type in, in apps you've chosen, and reports text when the field empties in one
/// step, which is what happens when you send a message. It never records keystrokes.
@MainActor
@Observable
final class SentCapture {
    private(set) var isTrusted = AXIsProcessTrusted()
    var isEnabled = false { didSet { refresh() } }
    var allowedApps: Set<String> = [] { didSet { refresh() } }
    var onSent: ((_ text: String, _ app: String) -> Void)?

    private var observer: AXObserver?
    private var appElement: AXUIElement?
    private var appName = ""
    private var field: AXUIElement?
    private var focused: AXUIElement?
    private var lastValue = ""
    private var ignoreChangesUntil = Date.distantPast
    private var recallIndex: Int?
    private var timer: Timer?
    private var trustTimer: Timer?

    // Chromium browsers only build their accessibility tree when asked this way.
    private static let chromiumBrowsers: Set<String> = [
        "com.google.Chrome", "company.thebrowser.Browser", "com.brave.Browser", "com.microsoft.edgemac"
    ]
    private static let largestField = 20_000

    init() {
        NSWorkspace.shared.notificationCenter.addObserver(
            forName: NSWorkspace.didActivateApplicationNotification, object: nil, queue: .main
        ) { [weak self] _ in
            Task { @MainActor in self?.refresh() }
        }
        trustTimer = Timer.scheduledTimer(withTimeInterval: 2, repeats: true) { [weak self] _ in
            Task { @MainActor in self?.checkTrust() }
        }
    }

    /// Asks macOS for Accessibility access, showing its prompt if access isn't granted yet.
    func requestAccess() {
        // The value of kAXTrustedCheckOptionPrompt, which Swift 6 won't read from a global var.
        let options = ["AXTrustedCheckOptionPrompt": true] as CFDictionary
        isTrusted = AXIsProcessTrustedWithOptions(options)
        refresh()
    }

    private func checkTrust() {
        let trusted = AXIsProcessTrusted()
        guard trusted != isTrusted else { return }
        isTrusted = trusted
        refresh()
    }

    private func refresh() {
        stop()
        guard isEnabled, isTrusted, let app = NSWorkspace.shared.frontmostApplication,
              let identifier = app.bundleIdentifier, allowedApps.contains(identifier) else { return }
        watch(app, identifier: identifier)
    }

    private func watch(_ app: NSRunningApplication, identifier: String) {
        let element = AXUIElementCreateApplication(app.processIdentifier)
        AXUIElementSetAttributeValue(element, "AXManualAccessibility" as CFString, kCFBooleanTrue)
        if Self.chromiumBrowsers.contains(identifier) {
            AXUIElementSetAttributeValue(element, "AXEnhancedUserInterface" as CFString, kCFBooleanTrue)
        }
        appElement = element
        appName = app.localizedName ?? identifier
        var created: AXObserver?
        if AXObserverCreate(app.processIdentifier, sentCaptureCallback, &created) == .success, let created {
            observer = created
            CFRunLoopAddSource(CFRunLoopGetMain(), AXObserverGetRunLoopSource(created), .defaultMode)
        }
        // Some apps don't announce focus or text changes, so check a few times a second as well.
        timer = Timer.scheduledTimer(withTimeInterval: 0.25, repeats: true) { [weak self] _ in
            Task { @MainActor in self?.tick() }
        }
        tick()
    }

    private func stop() {
        timer?.invalidate()
        timer = nil
        if let observer {
            CFRunLoopRemoveSource(CFRunLoopGetMain(), AXObserverGetRunLoopSource(observer), .defaultMode)
        }
        observer = nil
        appElement = nil
        field = nil
        focused = nil
        lastValue = ""
        recallIndex = nil
    }

    fileprivate func valueChangedNotification() { checkValue() }

    private func tick() {
        updateFocus()
        checkValue()
    }

    private func updateFocus() {
        guard let appElement, let element = Self.element(appElement, kAXFocusedUIElementAttribute) else { return }
        if let focused, CFEqual(focused, element) { return }
        focused = element
        field = nil
        recallIndex = nil
        var settable = DarwinBoolean(false)
        AXUIElementIsAttributeSettable(element, kAXValueAttribute as CFString, &settable)
        let subrole = Self.attribute(element, kAXSubroleAttribute) as? String
        // Read-only text, like a terminal's scrollback, and password fields are never watched.
        guard settable.boolValue, subrole != kAXSecureTextFieldSubrole as String,
              let value = Self.text(of: element), value.utf16.count <= Self.largestField else { return }
        field = element
        lastValue = value
        if let observer {
            AXObserverAddNotification(observer, element, kAXValueChangedNotification as CFString,
                                      Unmanaged.passUnretained(self).toOpaque())
        }
    }

    private func checkValue() {
        guard let field, let value = Self.text(of: field), value != lastValue else { return }
        let previous = lastValue.trimmingCharacters(in: .whitespacesAndNewlines)
        lastValue = value
        guard Date() >= ignoreChangesUntil else { return }
        // Emptying in one step is a send; shrinking a character at a time to empty is deleting.
        guard value.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty, previous.count > 1 else {
            if !value.isEmpty { recallIndex = nil }
            return
        }
        recallIndex = nil
        onSent?(previous, appName)
    }

    /// Steps through `history` (oldest first) in the focused field, like ↑ and ↓ in Terminal.
    /// Returns false when there's no field to put text in, or the app won't accept it.
    func recall(older: Bool, history: [String]) -> Bool {
        guard let field, !history.isEmpty else { return false }
        let current = recallIndex ?? history.count
        let next = older ? max(0, current - 1) : current + 1
        recallIndex = next < history.count ? next : nil
        let text = next < history.count ? history[next] : ""
        ignoreChangesUntil = Date().addingTimeInterval(0.6)
        guard AXUIElementSetAttributeValue(field, kAXValueAttribute as CFString, text as CFString) == .success
        else { return false }
        var end = CFRange(location: (text as NSString).length, length: 0)
        if let range = AXValueCreate(.cfRange, &end) {
            AXUIElementSetAttributeValue(field, kAXSelectedTextRangeAttribute as CFString, range)
        }
        lastValue = Self.text(of: field) ?? text
        return true
    }

    var watchedApp: String? { field == nil ? nil : appName }

    private static func attribute(_ element: AXUIElement, _ name: String) -> CFTypeRef? {
        var value: CFTypeRef?
        return AXUIElementCopyAttributeValue(element, name as CFString, &value) == .success ? value : nil
    }

    private static func element(_ element: AXUIElement, _ name: String) -> AXUIElement? {
        guard let value = attribute(element, name), CFGetTypeID(value) == AXUIElementGetTypeID() else { return nil }
        return unsafeDowncast(value, to: AXUIElement.self)
    }

    private static func text(of element: AXUIElement) -> String? { attribute(element, kAXValueAttribute) as? String }
}

private func sentCaptureCallback(_ observer: AXObserver, _ element: AXUIElement, _ name: CFString,
                                 _ refcon: UnsafeMutableRawPointer?) {
    guard let refcon else { return }
    let capture = Unmanaged<SentCapture>.fromOpaque(refcon).takeUnretainedValue()
    MainActor.assumeIsolated { capture.valueChangedNotification() }
}
