import AppKit
import PanelKit
import SwiftUI

enum HandLayout {
    static let width: CGFloat = 340
    static let height: CGFloat = 600
}

extension EnvironmentValues {
    /// PanelKit's Brushed colours for the current appearance.
    var handTheme: PanelTheme { PanelTheme.resolve(colorScheme) }
}

/// The app icon, shown on the welcome screen.
struct HandMark: View {
    var body: some View {
        Image(nsImage: NSApp.applicationIconImage)
            .resizable()
            .frame(width: 56, height: 56)
            .accessibilityHidden(true)
    }
}

/// A 20 pt metal key for the small buttons on the fascia.
struct KeyCap: View {
    let symbol: String
    @Environment(\.handTheme) private var theme

    var body: some View {
        Image(systemName: symbol)
            .font(.system(size: 9.5, weight: .bold))
            .foregroundStyle(theme.isDark ? theme.ink : Color(white: 0.17))
            .frame(width: 20, height: 20)
            .background {
                let shape = RoundedRectangle(cornerRadius: 4)
                if theme.isDark {
                    shape.fill(LinearGradient(colors: theme.button2, startPoint: .top, endPoint: .bottom))
                        .overlay(shape.strokeBorder(theme.button2Edge, lineWidth: 1))
                } else {
                    shape.fill(.white.opacity(0.45))
                        .overlay(shape.strokeBorder(.black.opacity(0.15), lineWidth: 1))
                }
            }
            .contentShape(Rectangle())
    }
}

/// A small LED like PanelKit's status lights, for inline status text.
struct HandLED: View {
    let status: PanelStatus
    @Environment(\.handTheme) private var theme

    var body: some View {
        let color = theme.color(for: status)
        Circle()
            .fill(color)
            .frame(width: 7, height: 7)
            .shadow(color: color, radius: 2.5)
            .accessibilityHidden(true)
    }
}
