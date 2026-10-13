import AppKit
import SwiftUI
import UniformTypeIdentifiers

struct AppListView: View {
    let title: String
    let emptyText: String
    @Binding var identifiers: String
    @State private var choosingApps = false
    @State private var errorMessage: String?

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(title).font(.headline)
            ScrollView {
                VStack(spacing: 0) {
                    ForEach(list.sorted(), id: \.self) { identifier in
                        HStack(spacing: 8) {
                            appIcon(identifier).resizable().frame(width: 18, height: 18)
                                .accessibilityHidden(true)
                            Text(appName(identifier)).lineLimit(1).help(identifier)
                            Spacer()
                            Button { remove(identifier) } label: { Image(systemName: "minus.circle") }
                                .buttonStyle(.borderless).foregroundStyle(.secondary)
                                .accessibilityLabel("Remove \(appName(identifier))")
                        }.padding(.vertical, 6)
                    }
                    if list.isEmpty {
                        Text(emptyText).foregroundStyle(.secondary).padding(.vertical, 8)
                    }
                }
            }.frame(height: 135)
            Button("Add app…", systemImage: "plus") { choosingApps = true }
            DisclosureGroup("Edit bundle identifiers") {
                TextEditor(text: $identifiers)
                    .font(.system(size: 11, design: .monospaced)).frame(height: 70)
                    .border(.quaternary).accessibilityLabel("\(title): bundle identifiers")
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
                self.identifiers = list.union(identifiers).sorted().joined(separator: "\n")
            } catch { errorMessage = error.localizedDescription }
        }
        .alert("Could not add app", isPresented: Binding(
            get: { errorMessage != nil }, set: { if !$0 { errorMessage = nil } }
        )) { Button("OK") { errorMessage = nil } } message: { Text(errorMessage ?? "") }
    }

    private var list: Set<String> { Preferences.identifiers(identifiers) }

    /// The app's own icon, so the list doesn't read as a column of checkboxes.
    private func appIcon(_ identifier: String) -> Image {
        guard let url = NSWorkspace.shared.urlForApplication(withBundleIdentifier: identifier) else {
            return Image(systemName: "questionmark.app.dashed")
        }
        return Image(nsImage: NSWorkspace.shared.icon(forFile: url.path))
    }

    private func appName(_ identifier: String) -> String {
        guard let url = NSWorkspace.shared.urlForApplication(withBundleIdentifier: identifier) else {
            return identifier
        }
        return FileManager.default.displayName(atPath: url.path)
    }

    private func remove(_ identifier: String) {
        identifiers = list.subtracting([identifier]).sorted().joined(separator: "\n")
    }
}
