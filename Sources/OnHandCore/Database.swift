import CSQLite
import Foundation

public struct StorageError: LocalizedError {
    public let message: String
    public var errorDescription: String? { message }
}

final class Database {
    private var handle: OpaquePointer?
    private let transient = unsafeBitCast(-1, to: sqlite3_destructor_type.self)

    init(path: String) throws {
        guard sqlite3_open(path, &handle) == SQLITE_OK else {
            let message = handle.map { String(cString: sqlite3_errmsg($0)) } ?? "Could not open history."
            sqlite3_close(handle)
            throw StorageError(message: message)
        }
        sqlite3_busy_timeout(handle, 3_000)
        try execute("PRAGMA journal_mode = DELETE")
        try execute("PRAGMA secure_delete = ON")
        try execute("""
        CREATE TABLE IF NOT EXISTS clips (
            id TEXT PRIMARY KEY, kind TEXT NOT NULL, text TEXT NOT NULL,
            payload BLOB NOT NULL, source TEXT NOT NULL, created REAL NOT NULL,
            pinned INTEGER NOT NULL DEFAULT 0
        )
        """)
        try execute("CREATE INDEX IF NOT EXISTS clips_created ON clips(created DESC)")
        if try !columns("clips").contains("ocr") { try execute("ALTER TABLE clips ADD COLUMN ocr TEXT") }
    }

    deinit { sqlite3_close(handle) }

    enum Value {
        case text(String), blob(Data), number(Double), integer(Int)
    }

    func execute(_ sql: String, _ values: [Value] = []) throws {
        let statement = try prepare(sql, values)
        defer { sqlite3_finalize(statement) }
        let result = sqlite3_step(statement)
        guard result == SQLITE_DONE || result == SQLITE_ROW else { throw error() }
    }

    func clips(_ sql: String, _ values: [Value] = []) throws -> [Clip] {
        let statement = try prepare(sql, values)
        defer { sqlite3_finalize(statement) }
        var result: [Clip] = []
        while true {
            let status = sqlite3_step(statement)
            if status == SQLITE_DONE { return result }
            guard status == SQLITE_ROW else { throw error() }
            let count = Int(sqlite3_column_bytes(statement, 3))
            let payload = sqlite3_column_blob(statement, 3).map { Data(bytes: $0, count: count) } ?? Data()
            result.append(Clip(
                id: string(statement, 0), kind: Clip.Kind(rawValue: string(statement, 1)) ?? .text,
                text: string(statement, 2), data: payload, source: string(statement, 4),
                createdAt: Date(timeIntervalSince1970: sqlite3_column_double(statement, 5)),
                isPinned: sqlite3_column_int(statement, 6) != 0,
                recognizedText: sqlite3_column_type(statement, 7) == SQLITE_NULL ? nil : string(statement, 7)
            ))
        }
    }

    private func columns(_ table: String) throws -> Set<String> {
        let statement = try prepare("PRAGMA table_info(\(table))", [])
        defer { sqlite3_finalize(statement) }
        var names: Set<String> = []
        while sqlite3_step(statement) == SQLITE_ROW { names.insert(string(statement, 1)) }
        return names
    }

    func transaction<T>(_ work: () throws -> T) throws -> T {
        try execute("BEGIN IMMEDIATE")
        do {
            let result = try work()
            try execute("COMMIT")
            return result
        } catch {
            try? execute("ROLLBACK")
            throw error
        }
    }

    private func prepare(_ sql: String, _ values: [Value]) throws -> OpaquePointer {
        var statement: OpaquePointer?
        guard sqlite3_prepare_v2(handle, sql, -1, &statement, nil) == SQLITE_OK,
              let statement else { throw error() }
        for (offset, value) in values.enumerated() {
            let index = Int32(offset + 1)
            let status: Int32
            switch value {
            case .text(let text):
                status = sqlite3_bind_text(statement, index, text, Int32(text.utf8.count), transient)
            case .blob(let data):
                if data.isEmpty {
                    status = sqlite3_bind_zeroblob(statement, index, 0)
                } else {
                    status = data.withUnsafeBytes {
                        sqlite3_bind_blob(statement, index, $0.baseAddress, Int32(data.count), transient)
                    }
                }
            case .number(let number): status = sqlite3_bind_double(statement, index, number)
            case .integer(let integer): status = sqlite3_bind_int64(statement, index, Int64(integer))
            }
            if status != SQLITE_OK {
                sqlite3_finalize(statement)
                throw error()
            }
        }
        return statement
    }

    private func string(_ statement: OpaquePointer, _ index: Int32) -> String {
        guard let bytes = sqlite3_column_text(statement, index) else { return "" }
        let count = Int(sqlite3_column_bytes(statement, index))
        return String(bytes: UnsafeBufferPointer(start: bytes, count: count), encoding: .utf8) ?? ""
    }

    private func error() -> StorageError {
        StorageError(message: String(cString: sqlite3_errmsg(handle)))
    }
}
