import AppKit
import Foundation
import OnHandCore

let usage = """
onhand: search and reuse your On Hand clipboard history from Terminal.

Usage:
  onhand search [WORDS...] [--kind text|link|image] [--pinned] [--board NAME] [--limit N] [--json]
  onhand get ID [--image FILE] [--json]
  onhand copy ID
  onhand pin ID [--board NAME]
  onhand unpin ID
  onhand boards [--json]
  onhand delete ID
  onhand forget-last
  onhand pause
  onhand resume
  onhand status [--json]

Commands:
  search       List clips containing all the words, newest first, with one-line previews.
               Leave out the words to list recent clips. Shows 10 by default, at most 50.
  get          Print a clip's full text. For an image, print the text On Hand found in it;
               --image saves the image itself as a PNG.
  copy         Put a clip back on the clipboard.
  pin          Pin a clip so it never expires, optionally to a board (made if it's new).
  unpin        Unpin a clip.
  boards       List boards and how many clips each holds.
  delete       Delete a clip from history.
  forget-last  Clear the clipboard and delete what On Hand saved from it.
  pause        Stop saving copies until you resume.
  resume       Save copies again.
  status       Show whether On Hand is saving copies.

ID is the short ID from search; any unique start of it works. --json prints JSON for scripts.

Examples:
  onhand search invoice --kind link
  onhand get 3f2a91c0
  onhand pin 3f2a91c0 --board Snippets
"""

struct Arguments {
    var words: [String] = []
    var options: [String: String] = [:]
    var flags: Set<String> = []
    var json: Bool { flags.contains("--json") }

    var id: String {
        guard words.count == 1 else { usageError("Give one clip ID, like `onhand get 3f2a91c0`.") }
        return words[0]
    }
}

let valueOptions: Set = ["--kind", "--board", "--limit", "--image"]
let commandOptions: [String: Set<String>] = [
    "search": ["--kind", "--pinned", "--board", "--limit", "--json"], "get": ["--image", "--json"],
    "copy": [], "pin": ["--board"], "unpin": [], "boards": ["--json"], "delete": [], "forget-last": [],
    "pause": [], "resume": [], "status": ["--json"]
]

func fail(_ message: String) -> Never {
    FileHandle.standardError.write(Data("onhand: \(message)\n".utf8))
    exit(1)
}

func usageError(_ message: String) -> Never {
    FileHandle.standardError.write(Data("onhand: \(message)\nRun `onhand help` for usage.\n".utf8))
    exit(2)
}

func parse(_ raw: [String], allowed: Set<String>) -> Arguments {
    var arguments = Arguments()
    var index = 0
    while index < raw.count {
        let item = raw[index]
        index += 1
        guard item.hasPrefix("--") else { arguments.words.append(item); continue }
        guard allowed.contains(item) else { usageError("\(item) doesn’t work with this command.") }
        if valueOptions.contains(item) {
            guard index < raw.count else { usageError("\(item) needs a value.") }
            arguments.options[item] = raw[index]
            index += 1
        } else { arguments.flags.insert(item) }
    }
    return arguments
}

// MARK: - Shared state

/// On Hand's own preferences, read and written for the app's bundle ID whether or not it's running.
func preference(_ key: String) -> Any? {
    CFPreferencesCopyAppValue(key as CFString, HistoryLocation.bundleID as CFString)
}

func appIsRunning() -> Bool {
    !NSRunningApplication.runningApplications(withBundleIdentifier: HistoryLocation.bundleID).isEmpty
}

func openStore() -> HistoryStore {
    guard let file = try? HistoryLocation.file(), FileManager.default.fileExists(atPath: file.path) else {
        fail("There’s no history yet. Open On Hand and choose “Start keeping my clipboard.”")
    }
    do {
        let store = try HistoryStore(path: file.path)
        // Expired clips are gone as far as the app is concerned, even if it hasn't run since.
        let days = preference("retentionDays") as? Int ?? 7
        try store.prune(olderThan: Date().addingTimeInterval(-Double(days) * 86_400))
        return store
    } catch { fail("Couldn’t open your history: \(error.localizedDescription)") }
}

func attempt<T>(_ work: () throws -> T) -> T {
    do { return try work() } catch { fail(error.localizedDescription) }
}

func announceHistoryChange() {
    DistributedNotificationCenter.default().postNotificationName(AppSignal.historyChanged, object: nil,
                                                                 userInfo: nil, deliverImmediately: true)
}

func printJSON(_ value: some Encodable) {
    let encoder = JSONEncoder()
    encoder.outputFormatting = [.prettyPrinted, .sortedKeys, .withoutEscapingSlashes]
    encoder.dateEncodingStrategy = .iso8601
    guard let data = try? encoder.encode(value) else { fail("Couldn’t write JSON.") }
    FileHandle.standardOutput.write(data + Data("\n".utf8))
}

func shortID(_ clip: Clip) -> String { String(clip.id.prefix(8)) }

func describe(_ clip: Clip) -> String {
    let preview = clip.preview(length: 60)
    return preview.isEmpty ? "the \(clip.kind.rawValue)" : "“\(preview)”"
}

func padded(_ text: String, _ width: Int) -> String {
    let fitted = text.count > width ? String(text.prefix(width - 1)) + "…" : text
    return fitted.padding(toLength: width, withPad: " ", startingAt: 0)
}

struct ClipSummary: Encodable {
    let id: String
    let kind: String
    let preview: String
    let source: String
    let copiedAt: Date
    let pinned: Bool
    let board: String?

    init(_ clip: Clip) {
        id = clip.id
        kind = clip.kind.rawValue
        preview = clip.preview(length: 120)
        source = clip.source
        copiedAt = clip.createdAt
        pinned = clip.isPinned
        board = clip.board
    }
}

struct ClipDetail: Encodable {
    let id: String
    let kind: String
    let text: String
    let recognizedText: String?
    let source: String
    let copiedAt: Date
    let pinned: Bool
    let board: String?
}

// MARK: - Commands

func search(_ arguments: Arguments) {
    let kind = arguments.options["--kind"].map { name in
        guard let kind = Clip.Kind(rawValue: name) else { usageError("--kind is text, link, or image.") }
        return kind
    }
    let limit = arguments.options["--limit"].map { value in
        guard let limit = Int(value), (1...50).contains(limit) else { usageError("--limit is 1 to 50.") }
        return limit
    } ?? 10
    let board = arguments.options["--board"]
    let store = openStore()
    let clips = attempt { try store.all() }.sorted { $0.createdAt > $1.createdAt }
    let boards = attempt { try store.boards() }
    if let board, !boards.contains(where: { $0.caseInsensitiveCompare(board) == .orderedSame }) {
        fail("There’s no board named “\(board)”. See `onhand boards`.")
    }
    let matches = HistoryStore.filtered(clips, query: arguments.words.joined(separator: " "),
                                        pinnedOnly: arguments.flags.contains("--pinned") || board != nil,
                                        kind: kind)
        .filter { clip in board.map { clip.board?.caseInsensitiveCompare($0) == .orderedSame } ?? true }
    let shown = Array(matches.prefix(limit))
    if arguments.json { return printJSON(shown.map(ClipSummary.init)) }
    guard !shown.isEmpty else { return FileHandle.standardError.write(Data("No clips match.\n".utf8)) }
    print(padded("ID", 8), padded("TYPE", 6), padded("COPIED", 9), padded("FROM", 13), padded("PINNED", 11), "PREVIEW")
    for clip in shown {
        let pin = clip.isPinned ? (clip.board ?? "Pinned") : ""
        let preview = clip.preview(length: 70)
        print(shortID(clip), padded(clip.kind.rawValue, 6), padded(ClipAge.label(for: clip.createdAt), 9),
              padded(clip.source, 13), padded(pin, 11), preview.isEmpty ? "(no text found)" : preview)
    }
    if matches.count > shown.count {
        let note = "Showing \(shown.count) of \(matches.count). Use --limit for more.\n"
        FileHandle.standardError.write(Data(note.utf8))
    }
}

func get(_ arguments: Arguments) {
    let clip = attempt { try openStore().clip(matching: arguments.id) }
    if let path = arguments.options["--image"] {
        guard clip.kind == .image else { fail("That clip is \(clip.kind.rawValue), not an image.") }
        guard let png = NSBitmapImageRep(data: clip.data)?.representation(using: .png, properties: [:]) else {
            fail("Couldn’t read that image.")
        }
        attempt { try png.write(to: URL(fileURLWithPath: path)) }
        return print("Saved the image to \(path)")
    }
    if arguments.json {
        return printJSON(ClipDetail(id: clip.id, kind: clip.kind.rawValue, text: clip.text,
                                    recognizedText: clip.recognizedText, source: clip.source,
                                    copiedAt: clip.createdAt, pinned: clip.isPinned, board: clip.board))
    }
    guard clip.kind == .image else { return print(clip.text) }
    switch clip.recognizedText {
    case nil: fail("On Hand hasn’t read the text in this image yet. Try again in a moment.")
    case ""?: fail("On Hand didn’t find any text in this image. Use --image FILE to save it.")
    case let text?: print(text)
    }
}

func copy(_ arguments: Arguments) {
    let clip = attempt { try openStore().clip(matching: arguments.id) }
    let item = NSPasteboardItem()
    if clip.kind == .image {
        guard let tiff = NSImage(data: clip.data)?.tiffRepresentation else { fail("Couldn’t read that image.") }
        item.setData(tiff, forType: .tiff)
    } else { item.setString(clip.text, forType: .string) }
    // Marks the copy as On Hand's own, so the app doesn't save it again.
    item.setString(HistoryLocation.bundleID, forType: NSPasteboard.PasteboardType("org.nspasteboard.source"))
    NSPasteboard.general.clearContents()
    guard NSPasteboard.general.writeObjects([item]) else { fail("Couldn’t write to the clipboard.") }
    print("Copied \(describe(clip)) to the clipboard.")
}

func pin(_ arguments: Arguments) {
    let store = openStore()
    let clip = attempt { try store.clip(matching: arguments.id) }
    let board = arguments.options["--board"].map { name in attempt { try store.createBoard(name) } }
    attempt { try store.pin(clip.id, to: board) }
    announceHistoryChange()
    print("Pinned \(describe(clip))\(board.map { " to \($0)" } ?? "").")
}

func unpin(_ arguments: Arguments) {
    let store = openStore()
    let clip = attempt { try store.clip(matching: arguments.id) }
    attempt { try store.unpin(clip.id) }
    announceHistoryChange()
    print("Unpinned \(describe(clip)).")
}

func boards(_ arguments: Arguments) {
    let store = openStore()
    let clips = attempt { try store.all() }
    let counts = attempt { try store.boards() }.map { name in (name, clips.filter { $0.board == name }.count) }
    struct Board: Encodable { let name: String; let clips: Int }
    if arguments.json { return printJSON(counts.map { Board(name: $0.0, clips: $0.1) }) }
    guard !counts.isEmpty else { return print("No boards yet. Make one with `onhand pin ID --board NAME`.") }
    for (name, count) in counts { print(padded(name, 24), count == 1 ? "1 clip" : "\(count) clips") }
}

func delete(_ arguments: Arguments) {
    let store = openStore()
    let clip = attempt { try store.clip(matching: arguments.id) }
    attempt { try store.remove(clip.id) }
    announceHistoryChange()
    print("Deleted \(describe(clip)).")
}

func forgetLast(_ arguments: Arguments) {
    let board = NSPasteboard.general
    let image = board.data(forType: .png) ?? board.data(forType: .tiff)
    let text = image == nil ? board.string(forType: .string) ?? "" : ""
    var forgot = false
    if let file = try? HistoryLocation.file(), FileManager.default.fileExists(atPath: file.path) {
        let store = openStore()
        let id = HistoryStore.id(text: text, image: image)
        if let clip = try? store.clip(matching: id) {
            guard !clip.isPinned else { fail("Your last copy is pinned. Unpin it first, or use `onhand delete`.") }
            attempt { try store.remove(id) }
            forgot = true
        }
    }
    board.clearContents()
    if forgot { announceHistoryChange() }
    print(forgot ? "Cleared the clipboard and deleted it from history."
                 : "Cleared the clipboard. It wasn’t in history.")
}

func setPaused(_ paused: Bool) {
    CFPreferencesSetAppValue("isPaused" as CFString, paused as CFBoolean, HistoryLocation.bundleID as CFString)
    CFPreferencesAppSynchronize(HistoryLocation.bundleID as CFString)
    DistributedNotificationCenter.default().postNotificationName(AppSignal.pauseChanged, object: nil,
                                                                 userInfo: ["paused": paused],
                                                                 deliverImmediately: true)
    if preference("hasStarted") as? Bool != true {
        print("On Hand isn’t saving copies yet. Open it and choose “Start keeping my clipboard.”")
    } else if paused {
        print("Paused. On Hand won’t save copies until you run `onhand resume`.")
    } else {
        print(appIsRunning() ? "Resumed. On Hand is saving copies again."
                           : "Resumed, but On Hand isn’t running. Open it with `open -a \"On Hand\"`.")
    }
}

func status(_ arguments: Arguments) {
    let running = appIsRunning()
    let started = preference("hasStarted") as? Bool == true
    let paused = preference("isPaused") as? Bool == true
    let file = try? HistoryLocation.file()
    let clips = file.flatMap {
        FileManager.default.fileExists(atPath: $0.path) ? attempt({ try openStore().all() }) : nil
    }
    struct Status: Encodable {
        let running, started, paused, saving: Bool
        let clips, pinned: Int
    }
    let state = Status(running: running, started: started, paused: paused, saving: running && started && !paused,
                       clips: clips?.count ?? 0, pinned: clips?.filter(\.isPinned).count ?? 0)
    if arguments.json { return printJSON(state) }
    if !running {
        print("On Hand isn’t running, so it isn’t saving copies. Open it with `open -a \"On Hand\"`.")
    } else if !started {
        print("On Hand is running but isn’t saving copies yet. Choose “Start keeping my clipboard” in its window.")
    } else {
        print(paused ? "Paused. Run `onhand resume` to save copies again." : "Saving copies.")
    }
    print("\(state.clips == 1 ? "1 clip" : "\(state.clips) clips") in history, \(state.pinned) pinned.")
}

// MARK: - Main

let commands: [String: (Arguments) -> Void] = [
    "search": search, "get": get, "copy": copy, "pin": pin, "unpin": unpin, "boards": boards,
    "delete": delete, "forget-last": forgetLast, "pause": { _ in setPaused(true) },
    "resume": { _ in setPaused(false) }, "status": status
]

let raw = Array(CommandLine.arguments.dropFirst())
guard let name = raw.first, !["help", "--help", "-h"].contains(name) else {
    print(usage)
    exit(0)
}
if name == "--version" {
    print(Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "unknown")
    exit(0)
}
guard let command = commands[name], let allowed = commandOptions[name] else {
    usageError("“\(name)” isn’t a command.")
}
let arguments = parse(Array(raw.dropFirst()), allowed: allowed)
if !["search", "get", "pin", "unpin", "copy", "delete"].contains(name), !arguments.words.isEmpty {
    usageError("`onhand \(name)` doesn’t take \(arguments.words.count == 1 ? "a value" : "values").")
}
command(arguments)
