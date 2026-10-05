import OnHandCore
import SwiftUI

struct HistoryView: View {
    @Bindable var model: AppModel
    let onCopy: (Clip) -> Void
    let onSettings: () -> Void
    @FocusState private var searchFocused: Bool

    var body: some View {
        VStack(spacing: 0) {
            header
            if !model.preferences.hasStarted {
                welcome
            } else {
                searchBar
                filters
                history
                footer
            }
        }
        .frame(width: 520, height: 640)
        .background(.background)
        .tint(.handGreen)
        .onAppear { searchFocused = true }
        .onChange(of: model.query) { model.selectedID = model.visibleClips.first?.id }
        .onChange(of: model.filter) { model.selectedID = model.visibleClips.first?.id }
        .onMoveCommand { direction in move(direction) }
        .alert("On Hand needs attention", isPresented: Binding(
            get: { model.errorMessage != nil }, set: { if !$0 { model.errorMessage = nil } }
        )) { Button("OK") { model.errorMessage = nil } } message: { Text(model.errorMessage ?? "") }
    }

    private var header: some View {
        HStack(spacing: 12) {
            HandMark()
            VStack(alignment: .leading, spacing: 3) {
                Text("On Hand").font(.system(size: 21, weight: .semibold, design: .serif))
                Text("A little less lost. A lot more handy.").font(.system(size: 11)).foregroundStyle(.secondary)
            }
            Spacer()
            Button(action: onSettings) { Image(systemName: "gearshape").font(.system(size: 16)) }
                .buttonStyle(.plain).help("Settings").accessibilityLabel("Settings")
        }.padding(.horizontal, 24).padding(.top, 24).padding(.bottom, 20)
    }

    private var searchBar: some View {
        HStack(spacing: 10) {
            Image(systemName: "magnifyingglass").foregroundStyle(.secondary)
            TextField("Find something you copied…", text: $model.query)
                .textFieldStyle(.plain).focused($searchFocused)
                .accessibilityLabel("Search clipboard history")
                .onSubmit { copySelected() }
                .onKeyPress(.downArrow) { move(.down); return .handled }
                .onKeyPress(.upArrow) { move(.up); return .handled }
            if !model.query.isEmpty {
                Button { model.query = "" } label: { Image(systemName: "xmark.circle.fill") }
                    .buttonStyle(.plain).accessibilityLabel("Clear search")
            }
        }
        .padding(13).background(.quaternary.opacity(0.4), in: RoundedRectangle(cornerRadius: 10))
        .padding(.horizontal, 24)
    }

    private var filters: some View {
        HStack(spacing: 6) {
            ForEach(["All", "Pinned", "Links", "Images"], id: \.self) { filter in
                Button { model.filter = filter } label: {
                    Text(filter).font(.system(size: 12, weight: .medium))
                        .padding(.horizontal, 13).padding(.vertical, 7)
                        .background(model.filter == filter ? Color.handGreen.opacity(0.12) : .clear,
                                    in: Capsule())
                        .foregroundStyle(model.filter == filter ? Color.handGreen : .secondary)
                }.buttonStyle(.plain).accessibilityAddTraits(model.filter == filter ? [.isSelected] : [])
            }
            Spacer()
            Text("\(model.visibleClips.count)").font(.system(size: 11, design: .monospaced)).foregroundStyle(.tertiary)
        }.padding(.horizontal, 24).padding(.vertical, 14)
    }

    private var history: some View {
        Group {
            if model.visibleClips.isEmpty {
                VStack(spacing: 12) {
                    Image(systemName: model.query.isEmpty ? "square.on.square.dashed" : "magnifyingglass")
                        .font(.system(size: 36, weight: .light)).foregroundStyle(Color.handGreen.opacity(0.7))
                    Text(emptyTitle).font(.system(size: 20, weight: .medium, design: .serif))
                    Text(emptyDetail).font(.system(size: 12)).foregroundStyle(.secondary)
                        .multilineTextAlignment(.center).frame(maxWidth: 290)
                }.frame(maxWidth: .infinity, maxHeight: .infinity)
            } else {
                ScrollViewReader { proxy in
                    ScrollView {
                        LazyVStack(spacing: 6) {
                            ForEach(model.visibleClips) { clip in
                                ClipRow(clip: clip, selected: model.selectedID == clip.id,
                                        image: clip.kind == .image ? model.preview(clip) : nil,
                                        onCopy: { onCopy(clip) }, onPin: { model.pin(clip) },
                                        onDelete: { model.delete(clip) })
                                    .id(clip.id)
                            }
                        }.padding(.horizontal, 16).padding(.bottom, 12)
                    }.onChange(of: model.selectedID) { _, id in
                        if let id { proxy.scrollTo(id, anchor: .center) }
                    }
                }
            }
        }.frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    private var footer: some View {
        HStack(spacing: 7) {
            Circle().fill(model.recording ? Color.handGreen : .orange).frame(width: 6, height: 6)
            Button(model.recording ? "Capturing" : "Paused") { model.togglePause() }
                .buttonStyle(.plain).help("Pause or resume clipboard capture")
            Spacer()
            Text("↑↓ browse").foregroundStyle(.tertiary)
            Text("↵ copy · ⌘V paste").foregroundStyle(.secondary)
        }
        .font(.system(size: 11)).padding(.horizontal, 24).padding(.vertical, 16)
        .background(.quaternary.opacity(0.25))
    }

    private var welcome: some View {
        VStack(spacing: 20) {
            Spacer()
            Image(systemName: "tray.and.arrow.down").font(.system(size: 48, weight: .ultraLight))
                .foregroundStyle(Color.handGreen)
            Text("Your next copy has a home.").font(.system(size: 27, weight: .medium, design: .serif))
            Text("On Hand remembers the text, links, and images you copy, so you can find them again.")
                .font(.system(size: 14)).foregroundStyle(.secondary)
                .multilineTextAlignment(.center).frame(maxWidth: 340)
            VStack(alignment: .leading, spacing: 12) {
                Label("History stays on this Mac", systemImage: "lock.shield")
                Label("Password-marked clips are skipped", systemImage: "key")
                Label("Unpinned clips expire after 7 days", systemImage: "clock")
            }.font(.system(size: 12)).foregroundStyle(.secondary).padding(.vertical, 8)
            Button("Start keeping my clipboard") { model.start(); searchFocused = true }
                .buttonStyle(.borderedProminent).controlSize(.large).disabled(!model.ready)
            Text("Pause or clear your history anytime.").font(.system(size: 11)).foregroundStyle(.tertiary)
            Spacer()
            Text("⌘⇧Space to open · Esc to dismiss").font(.system(size: 11)).foregroundStyle(.secondary)
                .padding(.bottom, 24)
        }.frame(maxWidth: .infinity)
    }

    private var emptyTitle: String {
        if !model.query.isEmpty { return "Nothing here by that name." }
        return model.filter == "Pinned" ? "Keep your favorites close." : "Ready when you copy."
    }
    private var emptyDetail: String {
        if !model.query.isEmpty { return "Try a different word or the name of the app you copied from." }
        if model.filter == "Pinned" { return "Pin any clip to keep it beyond your history limit." }
        return "Copy some text, a link, or an image. It will be waiting right here."
    }
    private func copySelected() {
        if let clip = model.visibleClips.first(where: { $0.id == model.selectedID }) ?? model.visibleClips.first {
            onCopy(clip)
        }
    }
    private func move(_ direction: MoveCommandDirection) {
        let clips = model.visibleClips
        guard !clips.isEmpty, direction == .down || direction == .up else { return }
        let current = clips.firstIndex { $0.id == model.selectedID } ?? -1
        let next = direction == .down ? min(current + 1, clips.count - 1) : max(current - 1, 0)
        model.selectedID = clips[next].id
    }
}
