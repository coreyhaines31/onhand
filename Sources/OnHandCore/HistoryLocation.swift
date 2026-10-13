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
}

/// Distributed notifications the `onhand` command posts so a running app picks up its changes.
public enum AppSignal {
    public static let historyChanged = Notification.Name("com.onhandformac.OnHand.historyChanged")
    /// userInfo carries `paused` as a Bool.
    public static let pauseChanged = Notification.Name("com.onhandformac.OnHand.pauseChanged")
    public static let forgetLastCopy = Notification.Name("com.onhandformac.OnHand.forgetLastCopy")
}
