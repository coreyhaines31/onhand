import CSQLite
import Foundation
@testable import OnHandCore
import Testing

@Test func deduplicationPreservesPinAndUpdatesSource() throws {
    let store = try HistoryStore(path: ":memory:")
    let id = try #require(try store.insert(text: "Hello", source: "Safari"))
    try store.togglePin(id)
    try store.insert(text: "Hello", source: "Notes", date: Date().addingTimeInterval(5))
    let clips = try store.all()
    #expect(clips.count == 1)
    #expect(clips[0].isPinned)
    #expect(clips[0].source == "Notes")
}

@Test func evictionPreservesPins() throws {
    let store = try HistoryStore(path: ":memory:", maximumCount: 2)
    let id = try #require(try store.insert(text: "Pinned", source: "Test", date: .distantPast))
    try store.togglePin(id)
    try store.insert(text: "Old", source: "Test", date: Date(timeIntervalSince1970: 1))
    try store.insert(text: "New", source: "Test")
    #expect(try store.all().map(\.text) == ["Pinned", "New"])
}

@Test func fullPinnedHistoryRollsBackCapture() throws {
    let store = try HistoryStore(path: ":memory:", maximumCount: 1)
    let id = try #require(try store.insert(text: "Pinned", source: "Test"))
    try store.togglePin(id)
    #expect(throws: StorageError.self) { try store.insert(text: "New", source: "Test") }
    #expect(try store.all().map(\.text) == ["Pinned"])
}

@Test func byteBudgetEvictsOldClips() throws {
    let store = try HistoryStore(path: ":memory:", maximumBytes: 10)
    try store.insert(image: Data(repeating: 1, count: 8), source: "Test", date: .distantPast)
    try store.insert(image: Data(repeating: 2, count: 8), source: "Test")
    #expect(try store.all().count == 1)
    #expect(try store.all()[0].data == Data(repeating: 2, count: 8))
}

@Test func expirationAndClearPreservePins() throws {
    let store = try HistoryStore(path: ":memory:")
    let id = try #require(try store.insert(text: "Keep", source: "Test", date: .distantPast))
    try store.togglePin(id)
    try store.insert(text: "Expire", source: "Test", date: .distantPast)
    try store.prune(olderThan: Date())
    #expect(try store.all().count == 1)
    try store.insert(text: "Temporary", source: "Test")
    try store.clear()
    #expect(try store.all().map(\.text) == ["Keep"])
    try store.clear(keepPinned: false)
    #expect(try store.all().isEmpty)
}

@Test func searchMatchesWordsAndSourceWithoutSQLWildcards() throws {
    let store = try HistoryStore(path: ":memory:")
    try store.insert(text: "Café design 100%", source: "Safari")
    try store.insert(text: "Other text", source: "Notes")
    let clips = try store.all()
    #expect(HistoryStore.filtered(clips, query: "cafe SAFARI").count == 1)
    #expect(HistoryStore.filtered(clips, query: "%").count == 1)
    #expect(HistoryStore.filtered(clips, query: "_ OR 1=1").isEmpty)
}

@Test func persistenceAndImageRoundTrip() throws {
    let directory = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString)
    try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
    defer { try? FileManager.default.removeItem(at: directory) }
    let path = directory.appendingPathComponent("history.sqlite").path
    let payload = Data([0, 1, 2, 0, 255])
    do {
        let store = try HistoryStore(path: path)
        try store.insert(image: payload, source: "Preview")
        try store.insert(text: "https://example.com", source: "Safari")
    }
    let restored = try HistoryStore(path: path).all()
    #expect(restored.count == 2)
    #expect(restored.first { $0.kind == .image }?.data == payload)
    #expect(restored.first { $0.kind == .link }?.text == "https://example.com")
}

@Test func rejectsEmptyAndOversizedClips() throws {
    let store = try HistoryStore(path: ":memory:")
    #expect(try store.insert(text: " \n ", source: "Test") == nil)
    #expect(try store.insert(text: String(repeating: "a", count: 1_000_001), source: "Test") == nil)
    #expect(try store.insert(image: Data(repeating: 0, count: 10_000_001), source: "Test") == nil)
    #expect(try store.all().isEmpty)
}

@Test func skipsEverySensitiveTypeAndExcludedApp() {
    for type in CapturePolicy.ignoredTypes {
        #expect(!CapturePolicy.allows(types: ["public.utf8-plain-text", type],
                                     sourceBundleID: nil, excludedApps: []))
    }
    #expect(!CapturePolicy.allows(types: [], sourceBundleID: "com.apple.Passwords",
                                 excludedApps: CapturePolicy.defaultExcludedApps))
    #expect(CapturePolicy.allows(types: ["public.png"], sourceBundleID: "com.apple.Preview", excludedApps: []))
}

@Test func preservesEmbeddedNullsAndUnicode() throws {
    let store = try HistoryStore(path: ":memory:")
    let value = "Before\0After · こんにちは 👋"
    try store.insert(text: value, source: "Test")
    #expect(try store.all().first?.text == value)
}

@Test func recognizedTextIsStoredAndSearchable() throws {
    let store = try HistoryStore(path: ":memory:")
    let id = try #require(try store.insert(image: Data([1, 2, 3]), source: "Preview"))
    #expect(try store.nextImageNeedingRecognition()?.id == id)
    try store.setRecognizedText("Invoice 4021", for: id)
    #expect(try store.nextImageNeedingRecognition() == nil)
    let clips = try store.all()
    #expect(clips[0].recognizedText == "Invoice 4021")
    #expect(HistoryStore.filtered(clips, query: "invoice 4021").count == 1)
    #expect(HistoryStore.filtered(clips, query: "receipt").isEmpty)
}

@Test func historyFromVersionOneGainsRecognition() throws {
    let path = FileManager.default.temporaryDirectory.appendingPathComponent("\(UUID()).sqlite").path
    defer { try? FileManager.default.removeItem(atPath: path) }
    var handle: OpaquePointer?
    sqlite3_open(path, &handle)
    sqlite3_exec(handle, """
    CREATE TABLE clips (id TEXT PRIMARY KEY, kind TEXT NOT NULL, text TEXT NOT NULL,
        payload BLOB NOT NULL, source TEXT NOT NULL, created REAL NOT NULL, pinned INTEGER NOT NULL DEFAULT 0);
    INSERT INTO clips VALUES ('a', 'image', '', x'0102', 'Preview', 1, 1);
    """, nil, nil, nil)
    sqlite3_close(handle)
    let store = try HistoryStore(path: path)
    #expect(try store.all().first?.isPinned == true)
    #expect(try store.nextImageNeedingRecognition()?.id == "a")
}

@Test func pinboardsGroupPinnedClips() throws {
    let store = try HistoryStore(path: ":memory:")
    let snippet = try #require(try store.insert(text: "Thanks for reaching out!", source: "Mail"))
    let address = try #require(try store.insert(text: "1 Infinite Loop", source: "Notes"))
    try store.createBoard("  Snippets ", date: Date(timeIntervalSince1970: 1))
    try store.createBoard("Addresses", date: Date(timeIntervalSince1970: 2))
    #expect(try store.createBoard("snippets") == "Snippets")
    #expect(try store.boards() == ["Snippets", "Addresses"])
    try store.pin(snippet, to: "Snippets")
    try store.pin(address, to: nil)
    let clips = try store.all()
    #expect(clips.filter { $0.isPinned }.count == 2)
    #expect(HistoryStore.filtered(clips, query: "", pinnedOnly: true, board: "Snippets").map(\.id) == [snippet])
    #expect(HistoryStore.filtered(clips, query: "", pinnedOnly: true).count == 2)
}

@Test func renamingAndDeletingBoardsKeepsClipsPinned() throws {
    let store = try HistoryStore(path: ":memory:")
    let id = try #require(try store.insert(text: "Reply", source: "Mail"))
    try store.createBoard("Replies")
    try store.createBoard("Other")
    try store.pin(id, to: "Replies")
    #expect(throws: StorageError.self) { try store.renameBoard("Replies", to: "other") }
    #expect(throws: StorageError.self) { try store.createBoard("   ") }
    try store.renameBoard("Replies", to: "Canned replies")
    #expect(try store.all()[0].board == "Canned replies")
    try store.deleteBoard("Canned replies")
    #expect(try store.boards() == ["Other"])
    #expect(try store.all()[0].isPinned)
    #expect(try store.all()[0].board == nil)
}

@Test func unpinningLeavesTheBoard() throws {
    let store = try HistoryStore(path: ":memory:")
    let id = try #require(try store.insert(text: "Reply", source: "Mail"))
    try store.createBoard("Replies")
    try store.pin(id, to: "Replies")
    try store.togglePin(id)
    #expect(try store.all()[0].isPinned == false)
    #expect(try store.all()[0].board == nil)
}
