import Foundation

/// Where the app keeps history, shared with the `onhand` command.
public enum HistoryLocation {
    public static let bundleID = "com.onhandformac.OnHand"

    public static func folder() throws -> URL {
        try FileManager.default.url(for: .applicationSupportDirectory, in: .userDomainMask,
                                    appropriateFor: nil, create: false)
            .appendingPathComponent("OnHand", isDirectory: true)
    }

    public static func file() throws -> URL {
        try folder().appendingPathComponent("history.sqlite")
    }

    /// Keeps history out of Time Machine and other backups, so deleting a clip really removes it.
    /// Marks the folder and the database with its SQLite side files, so it also covers installs made before this.
    public static func excludeFromBackup(folder: URL, file: URL) throws {
        var values = URLResourceValues()
        values.isExcludedFromBackup = true
        let sideFiles = ["-journal", "-wal", "-shm"].map { URL(fileURLWithPath: file.path + $0) }
        for var url in [folder, file] + sideFiles where FileManager.default.fileExists(atPath: url.path) {
            try url.setResourceValues(values)
        }
    }
}

/// Distributed notifications the `onhand` command posts so a running app picks up its changes.
public enum AppSignal {
    public static let historyChanged = Notification.Name("com.onhandformac.OnHand.historyChanged")
    /// userInfo carries `paused` as a Bool.
    public static let pauseChanged = Notification.Name("com.onhandformac.OnHand.pauseChanged")
}
