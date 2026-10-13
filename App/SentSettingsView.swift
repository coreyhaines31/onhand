import KeyboardShortcuts
import SwiftUI

struct SentSettingsView: View {
    @Bindable var model: AppModel

    var body: some View {
        @Bindable var preferences = model.preferences
        Section("Sent messages") {
            Toggle("Save messages I send", isOn: $preferences.saveSent)
                .onChange(of: preferences.saveSent) { _, enabled in
                    if enabled { model.sentCapture.requestAccess() }
                    model.syncSentCapture()
                }
            Text("""
                 In the apps you choose, On Hand saves what was in a message box when it empties after you \
                 send. It reads only that box, never records keystrokes, and skips password fields. A message \
                 you delete all at once may also be saved.
                 """)
                .font(.caption).foregroundStyle(.secondary)
            if preferences.saveSent {
                if !model.sentCapture.isTrusted {
                    HStack {
                        Label("On Hand needs Accessibility access to see what you send.",
                              systemImage: "exclamationmark.triangle.fill")
                            .foregroundStyle(.orange)
                        Spacer()
                        Button("Open Settings") { openAccessibilitySettings() }
                    }.font(.callout)
                }
                AppListView(title: "Save messages sent from these apps", emptyText: "No apps yet",
                            identifiers: $preferences.sentApps)
                    .onChange(of: preferences.sentApps) { model.syncSentCapture() }
                KeyboardShortcuts.Recorder("Bring back an older message:", name: .recallOlder)
                KeyboardShortcuts.Recorder("Bring back a newer message:", name: .recallNewer)
                Text("Press these in a message box to step through what you sent from that app, like ↑ in Terminal.")
                    .font(.caption).foregroundStyle(.secondary)
            }
        }
    }

    private func openAccessibilitySettings() {
        model.sentCapture.requestAccess()
        if let url = URL(string: "x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility") {
            NSWorkspace.shared.open(url)
        }
    }
}
