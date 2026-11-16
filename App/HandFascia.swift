import AppKit
import OnHandCore
import PanelKit
import SwiftUI

/// The metal fascia at the top of the panel: nameplate and header keys, the current clip on a slip, label strips.
struct HandFascia<Controls: View>: View {
    let nameplate: String
    let slip: ClipSlip.Content
    let detail: String
    @ViewBuilder let controls: Controls
    @Environment(\.panelTheme) private var theme

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack(spacing: 6) {
                controls
            }
            ClipSlip(content: slip)
                .padding(.top, 8)
            LabelStrips("Clipboard", detail: detail)
        }
        .padding(.top, 11)
        .padding(.horizontal, 14)
        .padding(.bottom, 13)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(BrushedMetal(anodised: theme.isDark))
        .overlay(alignment: .top) { Rectangle().fill(theme.fasciaHighlight).frame(height: 1) }
        .overlay(alignment: .bottom) { Rectangle().fill(theme.fasciaEdge).frame(height: 1) }
    }
}

/// A paper slip held by a chrome clip, showing what is on the clipboard.
struct ClipSlip: View {
    enum Content {
        case clip(Clip, image: NSImage?, onClipboard: Bool)
        case empty(String)
    }

    let content: Content
    @Environment(\.panelTheme) private var theme

    private var ink: Color { theme.isDark ? Color(red: 0.16, green: 0.13, blue: 0.09) : Color(white: 0.11) }
    private var paper: [Color] {
        theme.isDark
            ? [Color(red: 0.89, green: 0.72, blue: 0.41), Color(red: 0.96, green: 0.87, blue: 0.67)]
            : [Color(red: 0.96, green: 0.95, blue: 0.92), Color(red: 0.96, green: 0.95, blue: 0.92)]
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            switch content {
            case let .clip(clip, image, onClipboard):
                HStack(alignment: .top, spacing: 8) {
                    if let image {
                        Image(nsImage: image).resizable().scaledToFill()
                            .frame(width: 34, height: 34)
                            .clipShape(RoundedRectangle(cornerRadius: 2))
                    }
                    Text(text(for: clip))
                        .font(.system(size: 12, design: .monospaced))
                        .lineLimit(2)
                        .frame(maxWidth: .infinity, alignment: .leading)
                }
                Text(caption(for: clip, onClipboard: onClipboard))
                    .font(.system(size: 11))
                    .foregroundStyle(ink.opacity(0.62))
                    .lineLimit(1)
            case let .empty(message):
                Text(message)
                    .font(.system(size: 12, design: .monospaced))
                    .foregroundStyle(ink.opacity(0.55))
                Text("Copy anything and it lands here.")
                    .font(.system(size: 11))
                    .foregroundStyle(ink.opacity(0.62))
            }
        }
        .foregroundStyle(ink)
        .padding(.top, 18)
        .padding(.horizontal, 12)
        .padding(.bottom, 10)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(
            RoundedRectangle(cornerRadius: 3)
                .fill(LinearGradient(colors: paper, startPoint: .top, endPoint: .bottom))
                .overlay(RoundedRectangle(cornerRadius: 3).strokeBorder(.black.opacity(0.12), lineWidth: 1))
                .shadow(color: .black.opacity(0.25), radius: 1, y: 1)
        )
        .overlay(alignment: .top) { chromeClip.offset(y: -9) }
        .accessibilityElement(children: .combine)
    }

    private var chromeClip: some View {
        RoundedRectangle(cornerRadius: 3)
            .fill(LinearGradient(stops: [
                .init(color: Color(white: 0.98), location: 0),
                .init(color: Color(white: 0.55), location: 0.45),
                .init(color: Color(white: 0.93), location: 0.62),
                .init(color: Color(white: 0.61), location: 1)
            ], startPoint: .top, endPoint: .bottom))
            .frame(width: 92, height: 16)
            .shadow(color: .black.opacity(0.4), radius: 1, y: 1)
            .accessibilityHidden(true)
    }

    private func text(for clip: Clip) -> String {
        if clip.kind == .image {
            guard let text = clip.recognizedText, !text.isEmpty else { return "Copied image" }
            return String(text.prefix(400))
        }
        return String(clip.text.prefix(400))
    }

    private func caption(for clip: Clip, onClipboard: Bool) -> String {
        let lead = onClipboard ? "On the clipboard now" : "Last copied"
        return "\(lead) · \(clip.source) · \(ClipAge.label(for: clip.createdAt))"
    }
}
