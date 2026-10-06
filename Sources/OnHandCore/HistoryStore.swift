import CryptoKit
import Foundation

public final class HistoryStore {
    private let db: Database
    public let maximumCount: Int
    public let maximumBytes: Int

    public init(path: String, maximumCount: Int = 500, maximumBytes: Int = 50_000_000) throws {
        db = try Database(path: path)
        self.maximumCount = maximumCount
        self.maximumBytes = maximumBytes
    }

    public func all() throws -> [Clip] {
        try db.clips("SELECT * FROM clips ORDER BY pinned DESC, created DESC, id")
    }

    @discardableResult
    public func insert(text: String = "", image: Data? = nil, source: String,
                       date: Date = Date()) throws -> String? {
        let payload = image ?? Data()
        guard image != nil || !text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return nil }
        guard payload.count <= 10_000_000, text.utf8.count <= 1_000_000 else { return nil }
        let kind: Clip.Kind = image != nil ? .image : Self.kind(for: text)
        let signature = Data(kind.rawValue.utf8) + (image ?? Data(text.utf8))
        let id = SHA256.hash(data: signature).map { String(format: "%02x", $0) }.joined()
        return try db.transaction {
            try db.execute("""
            INSERT INTO clips(id, kind, text, payload, source, created) VALUES(?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET source=excluded.source, created=excluded.created
            """, [.text(id), .text(kind.rawValue), .text(text), .blob(payload),
                  .text(source), .number(date.timeIntervalSince1970)])
            try enforceLimits(protecting: id)
            return id
        }
    }

    public func imagesNeedingRecognition() throws -> [Clip] {
        try db.clips("SELECT * FROM clips WHERE kind = 'image' AND ocr IS NULL ORDER BY created DESC")
    }

    public func setRecognizedText(_ text: String, for id: String) throws {
        try db.execute("UPDATE clips SET ocr = ? WHERE id = ?", [.text(text), .text(id)])
    }

    public func togglePin(_ id: String) throws {
        try db.execute("UPDATE clips SET pinned = 1 - pinned WHERE id = ?", [.text(id)])
    }

    public func remove(_ id: String) throws {
        try db.execute("DELETE FROM clips WHERE id = ?", [.text(id)])
    }

    public func clear(keepPinned: Bool = true) throws {
        try db.execute(keepPinned ? "DELETE FROM clips WHERE pinned = 0" : "DELETE FROM clips")
    }

    public func prune(olderThan date: Date) throws {
        try db.execute("DELETE FROM clips WHERE pinned = 0 AND created < ?", [.number(date.timeIntervalSince1970)])
    }

    public static func filtered(_ clips: [Clip], query: String, pinnedOnly: Bool = false,
                                kind: Clip.Kind? = nil) -> [Clip] {
        let words = query.split(whereSeparator: \.isWhitespace).map(String.init)
        return clips.filter { clip in
            (!pinnedOnly || clip.isPinned) && (kind == nil || clip.kind == kind) && words.allSatisfy {
                [clip.text, clip.source, clip.title, clip.recognizedText ?? ""].joined(separator: " ")
                    .localizedStandardContains($0)
            }
        }
    }

    private func enforceLimits(protecting id: String) throws {
        var clips = try all()
        var bytes = clips.reduce(0) { $0 + $1.data.count + $1.text.utf8.count }
        let candidates = clips.filter { !$0.isPinned && $0.id != id }.sorted { $0.createdAt < $1.createdAt }
        for clip in candidates where clips.count > maximumCount || bytes > maximumBytes {
            try remove(clip.id)
            clips.removeAll { $0.id == clip.id }
            bytes -= clip.data.count + clip.text.utf8.count
        }
        guard clips.count <= maximumCount, bytes <= maximumBytes else {
            throw StorageError(message: "History is full of pinned clips. Unpin or delete a clip to make room.")
        }
    }

    private static func kind(for text: String) -> Clip.Kind {
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.contains(where: \.isWhitespace), let url = URL(string: trimmed),
              ["http", "https"].contains(url.scheme?.lowercased() ?? ""), url.host != nil else { return .text }
        return .link
    }
}
