import KeyboardShortcuts
import SwiftUI

/// A quiet reminder under short histories, so a near-empty panel explains itself.
struct HistoryHint: View {
    var body: some View {
        VStack(spacing: 6) {
            Image(systemName: "paperclip").font(.system(size: 18, weight: .light)).foregroundStyle(.tertiary)
            Text("Copy anything and it shows up here.")
            if let shortcut = KeyboardShortcuts.getShortcut(for: .showHistory) {
                Text("Press \(shortcut.description) to open On Hand from any app.")
            }
        }
        .font(.callout).foregroundStyle(.secondary).multilineTextAlignment(.center)
        .frame(maxWidth: .infinity).padding(.top, 28).padding(.horizontal, 24)
    }
}
