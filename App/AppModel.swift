import AppKit
import Foundation
import OnHandCore

@MainActor
@Observable
final class AppModel {
    let preferences: Preferences
    private(set) var clips: [Clip] = []
    var isPaused: Bool {
        get { preferences.isPaused }
        set { preferences.isPaused = newValue }
    }
    var errorMessage: String?
    var query = ""
    var filter = "All"
    var selectedID: String?
    private var store: HistoryStore?
    private var timer: Timer?
    private var lastChange = NSPasteboard.general.changeCount
    private var lastPrune = Date.distantPast
    private let previews = NSCache<NSString, NSImage>()

    init() {
        let isDemo = ProcessInfo.processInfo.arguments.contains("--demo")
        preferences = Preferences(defaults: isDemo ? UserDefaults(suiteName: "OnHandDemo")! : .standard)
        do {
            if isDemo {
                store = try HistoryStore(path: ":memory:")
                preferences.hasStarted = true
                isPaused = true
                try seedDemo()
            } else {
                let folder = try FileManager.default.url(for: .applicationSupportDirectory, in: .userDomainMask,
                                                        appropriateFor: nil, create: true)
                    .appendingPathComponent("OnHand", isDirectory: true)
                try FileManager.default.createDirectory(at: folder, withIntermediateDirectories: true,
                                                        attributes: [.posixPermissions: 0o700])
                let file = folder.appendingPathComponent("history.sqlite")
                store = try HistoryStore(path: file.path)
                try FileManager.default.setAttributes([.posixPermissions: 0o600], ofItemAtPath: file.path)
            }
            reload()
        } catch { errorMessage = "Could not open clipboard history. \(error.localizedDescription)" }
        if !isDemo {
            timer = Timer.scheduledTimer(withTimeInterval: 0.6, repeats: true) { [weak self] _ in
                Task { @MainActor in self?.poll() }
            }
        }
    }

    var visibleClips: [Clip] {
        HistoryStore.filtered(clips, query: query, pinnedOnly: filter == "Pinned",
                              kind: filter == "Images" ? .image : (filter == "Links" ? .link : nil))
    }

    var ready: Bool { store != nil }
    var recording: Bool { preferences.hasStarted && !isPaused && ready }

    func start() {
        lastChange = NSPasteboard.general.changeCount
        preferences.hasStarted = true
    }

    func togglePause() {
        lastChange = NSPasteboard.general.changeCount
        isPaused.toggle()
    }

    func reload() {
        perform {
            try store?.prune(olderThan: Date().addingTimeInterval(-Double(preferences.retentionDays) * 86_400))
            clips = try store?.all() ?? []
            if !clips.contains(where: { $0.id == selectedID }) { selectedID = nil }
        }
    }

    func pin(_ clip: Clip) { perform { try store?.togglePin(clip.id); reload() } }
    func delete(_ clip: Clip) { perform { try store?.remove(clip.id); previews.removeAllObjects(); reload() } }
    func clear(keepPinned: Bool) {
        perform { try store?.clear(keepPinned: keepPinned); previews.removeAllObjects(); reload() }
    }

    func copy(_ clip: Clip) -> Bool {
        let board = NSPasteboard.general
        let item = NSPasteboardItem()
        if clip.kind == .image {
            guard let image = NSImage(data: clip.data), let tiff = image.tiffRepresentation else {
                errorMessage = "This image could not be copied."
                return false
            }
            item.setData(tiff, forType: .tiff)
        } else { item.setString(clip.text, forType: .string) }
        item.setString("com.onhandformac.OnHand", forType: NSPasteboard.PasteboardType("org.nspasteboard.source"))
        board.clearContents()
        let success = board.writeObjects([item])
        lastChange = board.changeCount
        if !success { errorMessage = "Could not write to the clipboard. Please try again." }
        return success
    }

    func preview(_ clip: Clip) -> NSImage? {
        if let cached = previews.object(forKey: clip.id as NSString) { return cached }
        guard let image = NSImage(data: clip.data) else { return nil }
        previews.setObject(image, forKey: clip.id as NSString, cost: clip.data.count)
        previews.totalCostLimit = 30_000_000
        return image
    }

    private func perform(_ action: () throws -> Void) {
        do { try action() } catch { errorMessage = error.localizedDescription }
    }
}

extension AppModel {
    private func poll() {
        if Date().timeIntervalSince(lastPrune) > 60 {
            lastPrune = Date()
            reload()
        }
        let board = NSPasteboard.general
        guard board.changeCount != lastChange else { return }
        lastChange = board.changeCount
        guard recording else { return }
        let source = NSWorkspace.shared.frontmostApplication
        let types = Set((board.types ?? []).map(\.rawValue))
            .union((board.pasteboardItems ?? []).flatMap { $0.types.map(\.rawValue) })
        guard CapturePolicy.allows(types: types, sourceBundleID: source?.bundleIdentifier,
                                   excludedApps: preferences.exclusions),
              !types.contains(NSPasteboard.PasteboardType.fileURL.rawValue) else { return }
        let expectedChange = board.changeCount
        var image: Data?
        if let data = board.data(forType: .png) ?? board.data(forType: .tiff),
           data.count <= 10_000_000, NSImage(data: data) != nil { image = data }
        let text = image == nil ? (board.string(forType: .string) ?? "") : ""
        guard board.changeCount == expectedChange else { return }
        perform {
            let id = try store?.insert(text: text, image: image, source: source?.localizedName ?? "Unknown app")
            if id != nil { reload() }
        }
    }

    private func seedDemo() throws {
        let samples = [
            ("Everything you copy, close at hand.", "Notes"),
            ("https://developer.apple.com/design/", "Safari"),
            ("Good tools get out of your way. Great tools feel like they were always there.", "Notes"),
            ("Meet at the little coffee shop on the corner. Thursday, 10:30.", "Messages"),
            ("let smallThings = makeSomethingUseful()", "Xcode")
        ]
        for (index, sample) in samples.enumerated() {
            let id = try store?.insert(text: sample.0, source: sample.1,
                                      date: Date().addingTimeInterval(-Double(index * 120)))
            if index == 0, let id { try store?.togglePin(id) }
        }
    }
}
