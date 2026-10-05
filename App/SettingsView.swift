import KeyboardShortcuts
import ServiceManagement
import SwiftUI

struct SettingsView: View {
    @Bindable var model: AppModel
    @State private var launchAtLogin = SMAppService.mainApp.status == .enabled
    @State private var clearing = false
    @State private var includePinned = false
    let updater: AppUpdater

    var body: some View {
        @Bindable var preferences = model.preferences
        Form {
            Section("General") {
                KeyboardShortcuts.Recorder("Open On Hand:", name: .showHistory)
                Toggle("Launch at login", isOn: $launchAtLogin)
                    .onChange(of: launchAtLogin) { _, enabled in
                        do {
                            if enabled {
                                try SMAppService.mainApp.register()
                            } else {
                                try SMAppService.mainApp.unregister()
                            }
                        } catch {
                            model.errorMessage = "Could not change login settings. \(error.localizedDescription)"
                            launchAtLogin = SMAppService.mainApp.status == .enabled
                        }
                    }
                Picker("Keep unpinned clips for", selection: $preferences.retentionDays) {
                    Text("1 day").tag(1)
                    Text("7 days").tag(7)
                    Text("30 days").tag(30)
                    Text("90 days").tag(90)
                }.onChange(of: preferences.retentionDays) { model.reload() }
                Text("Up to 500 clips or 50 MB. Pinned clips stay until you remove them.")
                    .font(.caption).foregroundStyle(.secondary)
            }
            Section("Privacy") {
                Toggle("Pause capture", isOn: Binding(get: { model.isPaused }, set: { _ in model.togglePause() }))
                Text("""
                     History is stored locally on this Mac. Nothing is uploaded. Password-marked and temporary clips \
                     are skipped, but apps do not mark every secret. Pause before copying sensitive information.
                     """)
                    .font(.caption).foregroundStyle(.secondary)
                ExcludedAppsView(preferences: preferences)
                Toggle("Include pinned clips when clearing", isOn: $includePinned)
                Button("Clear history…", role: .destructive) { clearing = true }
            }
            Section {
                HStack {
                    Text("On Hand 0.1.0").foregroundStyle(.secondary)
                    Spacer()
                    if updater.available {
                        Button("Check for updates…") { updater.check() }
                    } else { Text("Local preview build").foregroundStyle(.secondary) }
                }.font(.caption)
                Button("Quit On Hand") { NSApp.terminate(nil) }
            }
        }
        .formStyle(.grouped).frame(width: 520, height: 620).tint(.handGreen)
        .confirmationDialog("Clear clipboard history?", isPresented: $clearing) {
            Button(includePinned ? "Delete all clips" : "Delete unpinned clips", role: .destructive) {
                model.clear(keepPinned: !includePinned)
            }
        } message: {
            Text(includePinned ? "This permanently removes every saved clip." : "Pinned clips will be kept.")
        }
        .alert("On Hand needs attention", isPresented: Binding(
            get: { model.errorMessage != nil }, set: { if !$0 { model.errorMessage = nil } }
        )) { Button("OK") { model.errorMessage = nil } } message: { Text(model.errorMessage ?? "") }
    }
}
