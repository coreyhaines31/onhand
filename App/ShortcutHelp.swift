import KeyboardShortcuts
import SwiftUI

struct ShortcutHelp: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("Keyboard shortcuts").font(.headline)
            shortcut("Open or close On Hand",
                     KeyboardShortcuts.getShortcut(for: .showHistory)?.description ?? "Not set")
            shortcut("Forget last copy",
                     KeyboardShortcuts.getShortcut(for: .forgetLastCopy)?.description ?? "Not set")
            Divider()
            shortcut("Select a clip", "↑ ↓")
            shortcut("Copy selected clip", "Return")
            shortcut("Copy result 1–9", "⌘1–9")
            shortcut("Preview selected clip", "⌘O")
            shortcut("Pin or unpin selected clip", "⌘P")
            shortcut("Search history", "⌘F")
            shortcut("Back from preview", "Esc / ⌘[")
            shortcut("Close history", "Esc")
            Divider()
            Text("""
                 After copying, use ⌘V in your destination app to paste. \
                 Number shortcuts follow the current search and filter.
                 """)
                .font(.caption).foregroundStyle(.secondary).fixedSize(horizontal: false, vertical: true)
        }.padding(18).frame(width: 310)
    }

    private func shortcut(_ title: String, _ keys: String) -> some View {
        HStack {
            Text(title)
            Spacer()
            Text(keys).foregroundStyle(.secondary).monospaced()
        }.font(.callout)
    }
}
