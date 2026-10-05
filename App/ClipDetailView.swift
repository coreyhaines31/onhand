import AppKit
import OnHandCore
import SwiftUI

struct ClipDetailView: View {
    let clip: Clip
    let copied: Bool
    let image: NSImage?
    let onCopy: () -> Void
    let onPin: () -> Void
    private let previewLimit = 40_000

    var body: some View {
        VStack(spacing: 0) {
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Label(clip.kind.rawValue.capitalized, systemImage: symbol).font(.headline)
                    Spacer()
                    Text(ByteCountFormatter.string(fromByteCount: byteCount, countStyle: .file))
                        .font(.caption).foregroundStyle(.secondary)
                }
                Text("From \(clip.source) · \(clip.createdAt.formatted(date: .abbreviated, time: .shortened))")
                    .font(.caption).foregroundStyle(.secondary)
            }.padding(16).frame(maxWidth: .infinity, alignment: .leading)
            Divider()
            ScrollView {
                Group {
                    if let image {
                        Image(nsImage: image).resizable().scaledToFit().accessibilityLabel("Copied image preview")
                    } else {
                        Text(String(clip.text.prefix(previewLimit)))
                            .font(.body).textSelection(.enabled)
                            .frame(maxWidth: .infinity, alignment: .leading)
                    }
                }.padding(16)
            }.frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(Color(nsColor: .textBackgroundColor))
            if clip.text.count > previewLimit {
                Text("Showing the first 40,000 characters. Copy includes the full clip.")
                    .font(.caption).foregroundStyle(.secondary).padding(12)
            }
            Divider()
            HStack {
                Button(action: onPin) {
                    Label(clip.isPinned ? "Unpin" : "Pin", systemImage: clip.isPinned ? "pin.slash" : "pin")
                }.keyboardShortcut("p", modifiers: .command)
                Spacer()
                Button(copied ? "Copied" : "Copy", action: onCopy)
                    .keyboardShortcut(.defaultAction).buttonStyle(.borderedProminent)
            }.padding(16)
        }
    }

    private var byteCount: Int64 { Int64(clip.data.count + clip.text.utf8.count) }

    private var symbol: String {
        switch clip.kind {
        case .text: "text.alignleft"
        case .link: "link"
        case .image: "photo"
        }
    }
}
