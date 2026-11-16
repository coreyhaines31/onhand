import KeyboardShortcuts
import PanelKit
import SwiftUI

/// A quiet reminder under short histories, so a near-empty panel explains itself.
struct HistoryHint: View {
    @Environment(\.panelTheme) private var theme

    var body: some View {
        VStack(spacing: 6) {
            Image(nsImage: BrandIcon.image()).foregroundStyle(theme.sub.opacity(0.7)).accessibilityHidden(true)
            Text("Copy anything and it shows up here.")
            if let shortcut = KeyboardShortcuts.getShortcut(for: .showHistory) {
                Text("Press \(shortcut.description) to open On Hand from any app.")
            }
        }
        .font(.system(size: 12)).foregroundStyle(theme.sub).multilineTextAlignment(.center)
        .frame(maxWidth: .infinity).padding(.top, 28).padding(.horizontal, 24)
    }
}
