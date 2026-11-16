import SwiftUI

/// What the list shows when nothing matches the search, tab or board.
struct EmptyHistory: View {
    let query: String
    let filter: String
    let board: String?

    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: query.isEmpty ? "square.on.square.dashed" : "magnifyingglass")
                .font(.system(size: 28, weight: .light)).foregroundStyle(.tertiary)
            Text(title).font(.headline)
            Text(detail).font(.system(size: 12)).foregroundStyle(.secondary)
                .multilineTextAlignment(.center).frame(maxWidth: 290)
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
