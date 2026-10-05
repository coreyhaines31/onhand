import AppKit
import SwiftUI
import UniformTypeIdentifiers

struct ExcludedAppsView: View {
    @Bindable var preferences: Preferences
    @State private var choosingApps = false
    @State private var errorMessage: String?

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Do not keep clips from these apps").font(.headline)
            ScrollView {
                VStack(spacing: 0) {
                    ForEach(preferences.exclusions.sorted(), id: \.self) { identifier in
                        HStack(spacing: 8) {
                            Image(systemName: "app").foregroundStyle(.secondary)
                            Text(appName(identifier)).lineLimit(1).help(identifier)
                            Spacer()
                            Button { remove(identifier) } label: { Image(systemName: "minus.circle") }
                                .buttonStyle(.borderless).foregroundStyle(.secondary)
                                .accessibilityLabel("Stop excluding \(appName(identifier))")
                        }.padding(.vertical, 6)
                    }
                    if preferences.exclusions.isEmpty {
                        Text("No excluded apps").foregroundStyle(.secondary).padding(.vertical, 8)
                    }
                }
            }.frame(height: 135)
            Button("Add app…", systemImage: "plus") { choosingApps = true }
            DisclosureGroup("Edit bundle identifiers") {
                TextEditor(text: $preferences.excludedApps)
                    .font(.system(size: 11, design: .monospaced)).frame(height: 70)
                    .border(.quaternary).accessibilityLabel("Excluded app bundle identifiers")
            }.font(.caption)
        }
        .fileImporter(isPresented: $choosingApps, allowedContentTypes: [.applicationBundle],
                      allowsMultipleSelection: true) { result in
            do {
                let urls = try result.get()
                let identifiers = urls.compactMap { Bundle(url: $0)?.bundleIdentifier }
                guard identifiers.count == urls.count else {
                    errorMessage = "One of these apps has no bundle identifier. Choose a macOS application."
                    return
                }
                preferences.excludedApps = preferences.exclusions.union(identifiers).sorted().joined(separator: "\n")
            } catch { errorMessage = error.localizedDescription }
        }
        .alert("Could not add app", isPresented: Binding(
            get: { errorMessage != nil }, set: { if !$0 { errorMessage = nil } }
        )) { Button("OK") { errorMessage = nil } } message: { Text(errorMessage ?? "") }
    }

    private func appName(_ identifier: String) -> String {
        guard let url = NSWorkspace.shared.urlForApplication(withBundleIdentifier: identifier) else {
            return identifier
        }
        return FileManager.default.displayName(atPath: url.path)
    }

    private func remove(_ identifier: String) {
        preferences.excludedApps = preferences.exclusions.subtracting([identifier]).sorted().joined(separator: "\n")
    }
}
