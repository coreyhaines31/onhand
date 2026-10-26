import Foundation
import KeyboardShortcuts
import OnHandCore

extension KeyboardShortcuts.Name {
    static let showHistory = Self("showHistory", default: .init(.space, modifiers: [.command, .shift]))
    static let forgetLastCopy = Self("forgetLastCopy",
                                     default: .init(.delete, modifiers: [.control, .option, .command]))
    static let recallOlder = Self("recallOlder", default: .init(.upArrow, modifiers: [.control, .option]))
    static let recallNewer = Self("recallNewer", default: .init(.downArrow, modifiers: [.control, .option]))
}

@MainActor
@Observable
final class Preferences {
    private let defaults: UserDefaults
    var keepOpen: Bool { didSet { defaults.set(keepOpen, forKey: "keepOpen") } }
    var isPaused: Bool { didSet { defaults.set(isPaused, forKey: "isPaused") } }
    var hasStarted: Bool { didSet { defaults.set(hasStarted, forKey: "hasStarted") } }
    var retentionDays: Int { didSet { defaults.set(retentionDays, forKey: "retentionDays") } }
    var excludedApps: String { didSet { defaults.set(excludedApps, forKey: "excludedApps") } }
    var skipSensitive: Bool { didSet { defaults.set(skipSensitive, forKey: "skipSensitive") } }
    var clearSensitive: Bool { didSet { defaults.set(clearSensitive, forKey: "clearSensitive") } }
    var saveSent: Bool { didSet { defaults.set(saveSent, forKey: "saveSent") } }
    var sentApps: String { didSet { defaults.set(sentApps, forKey: "sentApps") } }

    init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
        keepOpen = defaults.bool(forKey: "keepOpen")
        isPaused = defaults.bool(forKey: "isPaused")
        hasStarted = defaults.bool(forKey: "hasStarted")
        retentionDays = defaults.object(forKey: "retentionDays") as? Int ?? 7
        skipSensitive = defaults.object(forKey: "skipSensitive") as? Bool ?? true
        clearSensitive = defaults.object(forKey: "clearSensitive") as? Bool ?? true
        saveSent = defaults.bool(forKey: "saveSent")
        sentApps = defaults.string(forKey: "sentApps") ?? ""
        excludedApps = defaults.string(forKey: "excludedApps")
            ?? CapturePolicy.defaultExcludedApps.sorted().joined(separator: "\n")
    }

    var exclusions: Set<String> { Self.identifiers(excludedApps) }
    var sentAppIDs: Set<String> { Self.identifiers(sentApps) }

    static func identifiers(_ list: String) -> Set<String> {
        Set(list.split(whereSeparator: \.isNewline).map {
            $0.trimmingCharacters(in: .whitespacesAndNewlines)
        }.filter { !$0.isEmpty })
    }
}
