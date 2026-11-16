import AppKit
import OnHandCore
import SwiftUI

struct ClipRow: View {
    let clip: Clip
    let shortcut: Int?
    let selected: Bool
    let copied: Bool
    let image: NSImage?
    let onCopy: () -> Void
    let onPin: () -> Void
    let boards: [String]
    let onPinToBoard: (String?) -> Void
    let onNewBoard: () -> Void
    let onDelete: () -> Void
    let onPreview: () -> Void
    @State private var hovering = false
    @Environment(\.handTheme) private var theme

    var body: some View {
        HStack(spacing: 8) {
            Button(action: onCopy) {
                HStack(alignment: .center, spacing: 10) {
                    thumbnail
                    VStack(alignment: .leading, spacing: 3) {
                        Text(clip.kind == .image ? imageTitle : String(clip.text.prefix(400)))
                            .font(.system(size: 13, weight: .semibold)).lineLimit(2)
                            .multilineTextAlignment(.leading).foregroundStyle(theme.ink)
                        Text(meta).font(.system(size: 11.5)).foregroundStyle(theme.sub).lineLimit(1)
                    }.frame(maxWidth: .infinity, alignment: .leading)
                }.frame(maxWidth: .infinity, alignment: .leading).contentShape(Rectangle())
            }.buttonStyle(.plain).help("Copy to clipboard")
            if let shortcut, hovering || selected {
                Text("⌘\(shortcut)").font(.system(size: 11)).monospacedDigit().foregroundStyle(theme.sub)
                    .accessibilityHidden(true)
            }
            Button(action: onPreview) {
                Image(systemName: "chevron.right").font(.system(size: 10, weight: .semibold))
                    .frame(width: 14, height: 22).contentShape(Rectangle())
            }
            .buttonStyle(.plain).foregroundStyle(theme.sub)
            .help("Preview clip").accessibilityLabel("Preview clip")
            Button(action: onPin) {
                Image(systemName: clip.isPinned ? "pin.fill" : "pin").font(.system(size: 11))
                    .foregroundStyle(clip.isPinned ? theme.ink : theme.sub)
                    .frame(width: 16, height: 22).contentShape(Rectangle())
            }
            .buttonStyle(.plain).opacity(hovering || clip.isPinned || selected ? 1 : 0)
            .accessibilityLabel(clip.isPinned ? "Unpin clip" : "Pin clip")
        }
        .padding(.horizontal, 8).padding(.vertical, 7)
        .background {
            let shape = RoundedRectangle(cornerRadius: 6)
            if selected {
                shape.fill(theme.field).overlay(shape.strokeBorder(theme.line, lineWidth: 1))
            } else if hovering {
                shape.fill(theme.line.opacity(0.5))
            }
        }
        .onHover { hovering = $0 }
        .contextMenu {
            Button("Copy", action: onCopy)
            Button("Preview", action: onPreview)
            Button(clip.isPinned ? "Unpin" : "Pin", action: onPin)
            Menu("Pin to Board") {
                ForEach(boards, id: \.self) { board in
                    Button { onPinToBoard(board) } label: {
                        if clip.board == board { Label(board, systemImage: "checkmark") } else { Text(board) }
                    }
                }
                if !boards.isEmpty { Divider() }
                Button("New Board…", action: onNewBoard)
            }
            Divider()
            Button("Delete", role: .destructive, action: onDelete)
        }
    }

    /// Source app · Sent · age · board.
    private var meta: String {
        var parts = [clip.source]
        if clip.isSent { parts.append("Sent") }
        parts.append(ClipAge.label(for: clip.createdAt))
        if let board = clip.board { parts.append(board) }
        return parts.joined(separator: " · ")
    }

    private var imageTitle: String {
        guard let text = clip.recognizedText, !text.isEmpty else { return "Copied image" }
        return String(text.prefix(400))
    }

    private var thumbnail: some View {
        Group {
            if copied {
                Image(systemName: "checkmark").font(.system(size: 11, weight: .bold)).foregroundStyle(theme.go)
                    .accessibilityLabel("Copied")
            } else if let image {
                Image(nsImage: image).resizable().scaledToFill()
            } else {
                Image(systemName: clip.kind == .link ? "link" : "text.alignleft")
                    .font(.system(size: 10.5, weight: .semibold)).foregroundStyle(theme.ink2)
            }
        }
        .frame(width: 22, height: 22)
        .background {
            let shape = RoundedRectangle(cornerRadius: 5)
            shape.fill(LinearGradient(colors: theme.button2, startPoint: .top, endPoint: .bottom))
                .overlay(shape.strokeBorder(theme.button2Edge.opacity(0.6), lineWidth: 1))
        }
        .clipShape(RoundedRectangle(cornerRadius: 5))
    }
}
