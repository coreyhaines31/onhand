import AppKit
import Foundation
import OnHandCore

@MainActor
@Observable
final class AppModel {
    let preferences: Preferences
    private(set) var clips: [Clip] = []
    private(set) var boards: [String] = []
    var board: String?
    var isPaused: Bool {
        get { preferences.isPaused }
        set { preferences.isPaused = newValue }
    }
    var errorMessage: String?
    var query = ""
    var filter = "All"
    var selectedID: String?
    var previewID: String?
    var searchFocusRequest = 0
    var copiedID: String?
    var copySequence = 0
    var onSkippedSensitive: ((SensitiveContent) -> Void)?
    private var store: HistoryStore?
    private var timer: Timer?
    private var lastChange = NSPasteboard.general.changeCount
    private var lastPrune = Date.distantPast
    private var lastCapture: (id: String, change: Int)?
    private var isRecognizing = false
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
            removeSensitiveTextClips()
            recognizePendingImages()
        } catch { errorMessage = "Could not open clipboard history. \(error.localizedDescription)" }
        if !isDemo {
            timer = Timer.scheduledTimer(withTimeInterval: 0.6, repeats: true) { [weak self] _ in
                Task { @MainActor in self?.poll() }
            }
        }
    }

    var visibleClips: [Clip] {
        HistoryStore.filtered(clips, query: query, pinnedOnly: filter == "Pinned",
                              kind: filter == "Images" ? .image : (filter == "Links" ? .link : nil),
                              board: filter == "Pinned" ? board : nil)
    }

    var selectedClip: Clip? {
        if let previewID { return clips.first { $0.id == previewID } }
        return visibleClips.first { $0.id == selectedID } ?? visibleClips.first
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
            boards = try store?.boards() ?? []
            if let board, !boards.contains(board) { self.board = nil }
            if !visibleClips.contains(where: { $0.id == selectedID }) { selectedID = visibleClips.first?.id }
            if !clips.contains(where: { $0.id == previewID }) { previewID = nil }
        }
    }

    func pin(_ clip: Clip) { perform { try store?.togglePin(clip.id); reload() } }
    func pin(_ clip: Clip, to board: String?) { perform { try store?.pin(clip.id, to: board); reload() } }

    func createBoard(_ name: String, pinning clip: Clip? = nil) {
        perform {
            guard let store else { return }
            let created = try store.createBoard(name)
            if let clip { try store.pin(clip.id, to: created) }
            reload()
        }
    }

    func renameBoard(_ name: String, to newName: String) {
        perform {
            guard let renamed = try store?.renameBoard(name, to: newName) else { return }
            if board == name { board = renamed }
            reload()
        }
    }

    func deleteBoard(_ name: String) { perform { try store?.deleteBoard(name); reload() } }
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
        if success {
            copiedID = clip.id
            copySequence += 1
        } else { errorMessage = "Could not write to the clipboard. Please try again." }
        return success
    }

    func preview(_ clip: Clip) -> NSImage? {
        if let cached = previews.object(forKey: clip.id as NSString) { return cached }
        guard let image = NSImage(data: clip.data) else { return nil }
        previews.setObject(image, forKey: clip.id as NSString, cost: clip.data.count)
        previews.totalCostLimit = 30_000_000
        return image
    }

    private func recognizePendingImages() {
        guard !isRecognizing, let clip = try? store?.nextImageNeedingRecognition() else { return }
        isRecognizing = true
        let data = clip.data
        Task {
            let text = await Task.detached(priority: .utility) { TextRecognizer.text(in: data) }.value
            isRecognizing = false
            let sensitive = preferences.skipSensitive ? SensitiveContent.detect(in: text) : nil
            do {
                let isPinned = clips.first { $0.id == clip.id }?.isPinned ?? clip.isPinned
                if let sensitive, !isPinned {
                    try store?.remove(clip.id)
                    previews.removeAllObjects()
                    onSkippedSensitive?(sensitive)
                } else {
                    try store?.setRecognizedText(sensitive == nil ? text : "", for: clip.id)
                }
            } catch { return }
            reload()
            recognizePendingImages()
        }
    }

    /// Clears the system clipboard and deletes the clip On Hand saved from it, unless that clip is pinned.
    func forgetLastCopy() {
        let board = NSPasteboard.general
        perform {
            if let lastCapture, lastCapture.change == board.changeCount,
               clips.first(where: { $0.id == lastCapture.id })?.isPinned == false {
                try store?.remove(lastCapture.id)
                previews.removeAllObjects()
            }
            lastCapture = nil
            board.clearContents()
            lastChange = board.changeCount
            reload()
        }
    }

    func removeSensitiveTextClips() {
        guard preferences.skipSensitive else { return }
        perform {
            let sensitive = clips.filter {
                !$0.isPinned && $0.kind != .image && SensitiveContent.detect(in: $0.text) != nil
            }
            guard !sensitive.isEmpty else { return }
            for clip in sensitive { try store?.remove(clip.id) }
            reload()
        }
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
        if preferences.skipSensitive, let sensitive = SensitiveContent.detect(in: text) {
            onSkippedSensitive?(sensitive)
            return
        }
        perform {
            let id = try store?.insert(text: text, image: image, source: source?.localizedName ?? "Unknown app")
            if let id {
                lastCapture = (id, expectedChange)
                reload()
            }
            if image != nil { recognizePendingImages() }
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
            if index == 4, let id, let board = try store?.createBoard("Snippets") { try store?.pin(id, to: board) }
        }
        try store?.createBoard("Addresses")
        if let image = Self.demoImage(text: "Order #4021 · Ships Thursday") {
            try store?.insert(image: image, source: "Screenshot", date: Date().addingTimeInterval(-60))
        }
    }

    private static func demoImage(text: String) -> Data? {
        guard let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: 720, pixelsHigh: 240,
                                         bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false,
                                         colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)
        else { return nil }
        NSGraphicsContext.saveGraphicsState()
        NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
        NSColor(white: 0.97, alpha: 1).setFill()
        NSRect(x: 0, y: 0, width: 720, height: 240).fill()
        (text as NSString).draw(at: NSPoint(x: 48, y: 100),
                                withAttributes: [.font: NSFont.systemFont(ofSize: 40, weight: .semibold)])
        NSGraphicsContext.restoreGraphicsState()
        return rep.representation(using: .png, properties: [:])
    }
}
