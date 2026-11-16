import PanelKit
import SwiftUI

/// What the list shows when nothing matches the search, tab or board.
struct EmptyHistory: View {
    let query: String
    let filter: String
    let board: String?

    @Environment(\.handTheme) private var theme

    var body: some View {
        VStack(spacing: 10) {
            Image(systemName: query.isEmpty ? "square.on.square.dashed" : "magnifyingglass")
                .font(.system(size: 26, weight: .light)).foregroundStyle(theme.sub.opacity(0.7))
                .accessibilityHidden(true)
            Text(title).font(PanelFont.condensed(20, .semibold)).foregroundStyle(theme.ink)
                .accessibilityAddTraits(.isHeader)
            Text(detail).font(.system(size: 12)).foregroundStyle(theme.sub)
                .multilineTextAlignment(.center).frame(maxWidth: 260)
        }.frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    private var title: String {
        if !query.isEmpty { return "Nothing here by that name." }
        if filter == "Pinned", board != nil { return "Nothing on this board yet." }
        if filter == "Sent" { return "Nothing sent yet." }
        return filter == "Pinned" ? "Keep your favorites close." : "Ready when you copy."
    }

    private var detail: String {
        if !query.isEmpty { return "Try a different word or the name of the app you copied from." }
        if filter == "Pinned", board != nil { return "Right-click any clip and choose Pin to Board." }
        if filter == "Pinned" { return "Pin any clip to keep it beyond your history limit." }
        if filter == "Sent" { return "Messages you send in the apps you chose in Settings show up here." }
        return "Copy some text, a link, or an image. It will be waiting right here."
    }
}
