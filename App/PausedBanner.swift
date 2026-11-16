import PanelKit
import SwiftUI

/// Shown under the search field while capture is paused.
struct PausedBanner: View {
    let onResume: () -> Void
    @Environment(\.panelTheme) private var theme

    var body: some View {
        HStack(spacing: 9) {
            StatusLED(.caution)
            Text("Capture is paused. New copies aren’t saved.")
                .font(.system(size: 12)).foregroundStyle(theme.ink2)
                .fixedSize(horizontal: false, vertical: true)
            Spacer(minLength: 4)
            Button("Resume", action: onResume).buttonStyle(PanelButtonStyle(.secondary))
        }
        .padding(.leading, 10).padding(.trailing, 6).padding(.vertical, 6)
        .background(
            RoundedRectangle(cornerRadius: 6).fill(theme.field)
                .overlay(RoundedRectangle(cornerRadius: 6).strokeBorder(theme.line, lineWidth: 1))
        )
        .accessibilityElement(children: .contain)
        .padding(.horizontal, 14).padding(.top, 8)
    }
}
