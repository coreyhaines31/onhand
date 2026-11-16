import PanelKit
import SwiftUI

/// Onboarding, shown in the panel until capture is started.
struct WelcomeView: View {
    let ready: Bool
    let onStart: () -> Void
    @Environment(\.panelTheme) private var theme

    var body: some View {
        VStack(spacing: 0) {
            Spacer(minLength: 8)
            HandMark()
            Text("Your next copy has a home.")
                .font(PanelFont.condensed(23, .semibold)).foregroundStyle(theme.ink)
                .accessibilityAddTraits(.isHeader)
                .padding(.top, 12)
            Text("On Hand remembers the text, links, and images you copy, so you can find them again.")
                .font(.system(size: 12.5)).foregroundStyle(theme.sub)
                .multilineTextAlignment(.center).fixedSize(horizontal: false, vertical: true)
                .padding(.top, 6).padding(.horizontal, 28)
            VStack(alignment: .leading, spacing: 9) {
                point("History stays on this Mac", "lock.shield")
                point("Password-marked clips are skipped", "key")
                point("Unpinned clips expire after 7 days", "clock")
            }
            .padding(.top, 16)
            Button("Start keeping my clipboard", action: onStart)
                .buttonStyle(PanelButtonStyle(.primary, wide: true))
                .disabled(!ready)
                .padding(.horizontal, 28).padding(.top, 18)
            Text("Pause or clear your history anytime.")
                .font(.system(size: 11)).foregroundStyle(theme.sub).padding(.top, 8)
            Spacer(minLength: 8)
            Text("⌘⇧Space to open · Esc to dismiss")
                .font(.system(size: 11)).foregroundStyle(theme.sub)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 9)
                .overlay(alignment: .top) { Rectangle().fill(theme.line).frame(height: 1) }
        }
        .frame(maxWidth: .infinity)
    }

    private func point(_ title: String, _ symbol: String) -> some View {
        Label {
            Text(title).foregroundStyle(theme.ink2)
        } icon: {
            Image(systemName: symbol).foregroundStyle(theme.sub).frame(width: 16)
        }
        .font(.system(size: 12))
    }
}
