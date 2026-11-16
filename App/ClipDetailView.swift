import AppKit
import OnHandCore
import PanelKit
import SwiftUI

struct ClipDetailView: View {
    let clip: Clip
    let copied: Bool
    let image: NSImage?
    let onCopy: () -> Void
    let onPin: () -> Void
    private let previewLimit = 40_000
    @Environment(\.handTheme) private var theme

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            VStack(alignment: .leading, spacing: 4) {
                HStack(spacing: 6) {
                    Image(systemName: symbol).font(.system(size: 11, weight: .semibold))
                    Text(clip.kind.rawValue.capitalized)
                        .font(PanelFont.condensed(12, .semibold)).tracking(12 * 0.2).textCase(.uppercase)
                    Spacer()
                    Text(ByteCountFormatter.string(fromByteCount: byteCount, countStyle: .file))
                        .font(.system(size: 11)).monospacedDigit()
                }.foregroundStyle(theme.ink2)
                Text("From \(clip.source) · \(clip.createdAt.formatted(date: .abbreviated, time: .shortened))")
                    .font(.system(size: 11.5)).foregroundStyle(theme.sub)
            }
            .padding(.horizontal, 14).padding(.top, 12).padding(.bottom, 8)
            ScrollView {
                Group {
                    if let image {
                        VStack(alignment: .leading, spacing: 10) {
                            Image(nsImage: image).resizable().scaledToFit().accessibilityLabel("Copied image preview")
                            if let text = clip.recognizedText, !text.isEmpty {
                                Text("Text in image")
                                    .font(PanelFont.condensed(10, .semibold)).tracking(2).textCase(.uppercase)
                                    .foregroundStyle(theme.sub)
                                Text(text).font(.system(size: 12.5)).textSelection(.enabled)
                                    .frame(maxWidth: .infinity, alignment: .leading)
                            }
                        }
                    } else {
                        Text(String(clip.text.prefix(previewLimit)))
                            .font(.system(size: 12.5)).textSelection(.enabled)
                            .frame(maxWidth: .infinity, alignment: .leading)
                    }
                }.padding(12).foregroundStyle(theme.ink)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(
                RoundedRectangle(cornerRadius: 6).fill(theme.field)
                    .overlay(RoundedRectangle(cornerRadius: 6).strokeBorder(theme.line, lineWidth: 1))
            )
            .clipShape(RoundedRectangle(cornerRadius: 6))
            .padding(.horizontal, 14)
            if clip.text.count > previewLimit {
                Text("Showing the first 40,000 characters. Copy includes the full clip.")
                    .font(.system(size: 11)).foregroundStyle(theme.sub)
                    .padding(.horizontal, 14).padding(.top, 8)
            }
            HStack(spacing: 8) {
                Button(action: onPin) {
                    Label(clip.isPinned ? "Unpin" : "Pin", systemImage: clip.isPinned ? "pin.slash" : "pin")
                }
                .buttonStyle(PanelButtonStyle(.secondary))
                .keyboardShortcut("p", modifiers: .command)
                Button(copied ? "Copied" : "Copy", action: onCopy)
                    .buttonStyle(PanelButtonStyle(.primary, wide: true))
                    .keyboardShortcut(.defaultAction)
            }
            .padding(.horizontal, 14).padding(.top, 12).padding(.bottom, 14)
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
