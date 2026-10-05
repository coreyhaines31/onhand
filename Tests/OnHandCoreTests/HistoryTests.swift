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
