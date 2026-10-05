import AppKit
import OnHandCore
import SwiftUI

struct ClipRow: View {
    let clip: Clip
    let selected: Bool
    let image: NSImage?
    let onCopy: () -> Void
    let onPin: () -> Void
    let onDelete: () -> Void
    let onPreview: () -> Void
    @State private var hovering = false

    var body: some View {
        HStack(spacing: 8) {
            Button(action: onCopy) {
                HStack(alignment: .top, spacing: 12) {
                    thumbnail
                    VStack(alignment: .leading, spacing: 3) {
                        Text(clip.kind == .image ? "Copied image" : String(clip.text.prefix(400)))
                            .font(.body).lineLimit(2).multilineTextAlignment(.leading)
                            .foregroundStyle(.primary)
                        HStack(spacing: 6) {
                            Text(clip.source)
                            Text("·")
                            Text(clip.createdAt, style: .relative)
                            if clip.isPinned { Image(systemName: "pin.fill").foregroundStyle(Color.handGreen) }
                        }.font(.caption).foregroundStyle(.secondary).lineLimit(1)
                    }.frame(maxWidth: .infinity, alignment: .leading)
                }.frame(maxWidth: .infinity, alignment: .leading).contentShape(Rectangle())
            }.buttonStyle(.plain).help("Copy to clipboard")
            Button(action: onPreview) { Image(systemName: "chevron.right").font(.caption) }
                .buttonStyle(.borderless).foregroundStyle(.secondary)
                .help("Preview clip").accessibilityLabel("Preview clip")
            Button(action: onPin) {
                Image(systemName: clip.isPinned ? "pin.fill" : "pin")
                    .foregroundStyle(clip.isPinned ? Color.handGreen : .secondary)
            }
            .buttonStyle(.plain).opacity(hovering || clip.isPinned || selected ? 1 : 0.3)
            .accessibilityLabel(clip.isPinned ? "Unpin clip" : "Pin clip")
        }
        .padding(.horizontal, 8).padding(.vertical, 9)
        .background(selected ? Color.handGreen.opacity(0.1) : (hovering ? Color.primary.opacity(0.035) : .clear),
                    in: RoundedRectangle(cornerRadius: 6))
        .overlay(RoundedRectangle(cornerRadius: 6).strokeBorder(selected ? Color.handGreen.opacity(0.25) : .clear))
        .onHover { hovering = $0 }
        .contextMenu {
            Button("Copy", action: onCopy)
            Button("Preview", action: onPreview)
            Button(clip.isPinned ? "Unpin" : "Pin", action: onPin)
            Divider()
            Button("Delete", role: .destructive, action: onDelete)
        }
    }

    private var thumbnail: some View {
        Group {
            if let image {
                Image(nsImage: image).resizable().scaledToFill()
            } else {
                Image(systemName: clip.kind == .link ? "link" : "text.alignleft")
                    .font(.system(size: 15)).foregroundStyle(Color.handGreen)
            }
        }
        .frame(width: 30, height: 30)
        .background(Color.handGreen.opacity(0.07), in: RoundedRectangle(cornerRadius: 5))
        .clipShape(RoundedRectangle(cornerRadius: 5))
    }
}
