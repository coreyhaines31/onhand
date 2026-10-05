import Foundation
import KeyboardShortcuts
import OnHandCore

extension KeyboardShortcuts.Name {
    static let showHistory = Self("showHistory", default: .init(.space, modifiers: [.command, .shift]))
}

@MainActor
@Observable
final class Preferences {
    private let defaults: UserDefaults
    var isPaused: Bool { didSet { defaults.set(isPaused, forKey: "isPaused") } }
    var hasStarted: Bool { didSet { defaults.set(hasStarted, forKey: "hasStarted") } }
    var retentionDays: Int { didSet { defaults.set(retentionDays, forKey: "retentionDays") } }
    var excludedApps: String { didSet { defaults.set(excludedApps, forKey: "excludedApps") } }

    init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
        isPaused = defaults.bool(forKey: "isPaused")
        hasStarted = defaults.bool(forKey: "hasStarted")
        retentionDays = defaults.object(forKey: "retentionDays") as? Int ?? 7
        excludedApps = defaults.string(forKey: "excludedApps")
            ?? CapturePolicy.defaultExcludedApps.sorted().joined(separator: "\n")
    }

    var exclusions: Set<String> {
        Set(excludedApps.split(whereSeparator: \.isNewline).map {
            $0.trimmingCharacters(in: .whitespacesAndNewlines)
        }.filter { !$0.isEmpty })
    }
}
