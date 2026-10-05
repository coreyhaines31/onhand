import Foundation
import Sparkle

@MainActor
final class AppUpdater {
    private var controller: SPUStandardUpdaterController?
    var available: Bool { controller != nil }

    init() {
        // Local builds have no update endpoint; signed releases supply both values.
        if let feed = Bundle.main.object(forInfoDictionaryKey: "SUFeedURL") as? String, !feed.isEmpty,
           let key = Bundle.main.object(forInfoDictionaryKey: "SUPublicEDKey") as? String, !key.isEmpty {
            controller = SPUStandardUpdaterController(startingUpdater: true,
                                                      updaterDelegate: nil, userDriverDelegate: nil)
        }
    }

    func check() { controller?.checkForUpdates(nil) }
}
