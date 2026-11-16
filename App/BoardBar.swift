import PanelKit
import SwiftUI

/// Board chips on the Pinned tab: "All pinned", each board (right-click to rename or delete), and a + key.
struct BoardBar: View {
    let boards: [String]
    let selection: String?
    let onSelect: (String?) -> Void
    let onRename: (String) -> Void
    let onDelete: (String) -> Void
    let onNew: () -> Void

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 5) {
                BoardChip(title: "All pinned", selected: selection == nil) { onSelect(nil) }
                ForEach(boards, id: \.self) { name in
                    BoardChip(title: name, selected: selection == name) { onSelect(name) }
                        .contextMenu {
                            Button("Rename…") { onRename(name) }
                            Button("Delete Board", role: .destructive) { onDelete(name) }
                        }
                }
                Button(action: onNew) { KeyCap(symbol: "plus") }
                    .buttonStyle(.plain).help("New board").accessibilityLabel("New board")
            }
            .padding(.horizontal, 14).padding(.vertical, 1)
        }
        .padding(.bottom, 6)
    }
}

private struct BoardChip: View {
    let title: String
    let selected: Bool
    let action: () -> Void
    @Environment(\.handTheme) private var theme

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.system(size: 11.5, weight: selected ? .semibold : .regular))
                .foregroundStyle(theme.ink)
                .lineLimit(1)
                .padding(.horizontal, 9).padding(.vertical, 3)
                .background {
                    let shape = RoundedRectangle(cornerRadius: 4)
                    if selected {
                        shape.fill(theme.field).overlay(shape.strokeBorder(theme.ink, lineWidth: 1.2))
                    } else {
                        shape.fill(LinearGradient(colors: theme.button2, startPoint: .top, endPoint: .bottom))
                            .overlay(shape.strokeBorder(theme.button2Edge.opacity(0.6), lineWidth: 1))
                    }
                }
                .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .accessibilityAddTraits(selected ? .isSelected : [])
    }
}
