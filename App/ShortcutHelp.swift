import KeyboardShortcuts
import PanelKit
import SwiftUI

struct ShortcutHelp: View {
    @Environment(\.handTheme) private var theme

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Keyboard shortcuts")
                .font(PanelFont.condensed(12, .semibold)).tracking(12 * 0.2).textCase(.uppercase)
                .foregroundStyle(theme.sub).accessibilityAddTraits(.isHeader)
            shortcut("Open or close On Hand",
                     KeyboardShortcuts.getShortcut(for: .showHistory)?.description ?? "Not set")
            shortcut("Forget last copy",
                     KeyboardShortcuts.getShortcut(for: .forgetLastCopy)?.description ?? "Not set")
            rule
            shortcut("Select a clip", "↑ ↓")
            shortcut("Copy selected clip", "Return")
            shortcut("Copy result 1–9", "⌘1–9")
            shortcut("Preview selected clip", "⌘O")
            shortcut("Pin or unpin selected clip", "⌘P")
            shortcut("Search history", "⌘F")
            shortcut("Back from preview", "Esc / ⌘[")
            shortcut("Close history", "Esc")
            rule
            Text("""
                 After copying, use ⌘V in your destination app to paste. \
                 Number shortcuts follow the current search and filter.
                 """)
                .font(.system(size: 11)).foregroundStyle(theme.sub).fixedSize(horizontal: false, vertical: true)
        }
        .padding(16).frame(width: 300)
        .background(theme.background)
        .presentationBackground(theme.background)
    }

    private var rule: some View {
        Rectangle().fill(theme.line).frame(height: 1)
    }

    private func shortcut(_ title: String, _ keys: String) -> some View {
        HStack {
            Text(title).foregroundStyle(theme.ink)
            Spacer()
            Text(keys).foregroundStyle(theme.sub).monospaced()
        }.font(.system(size: 12))
    }
}
