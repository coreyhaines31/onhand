import OnHandCore
import SwiftUI

struct HistoryView: View {
    @Bindable var model: AppModel
    let onCopy: (Clip) -> Void
    let onSettings: () -> Void
    @State private var showingShortcuts = false
    @State private var creatingBoard = false
    @State private var renamingBoard: String?
    @State private var boardName = ""
    @State private var boardClip: Clip?

    var body: some View {
        VStack(spacing: 0) {
            header
            Divider()
            if !model.preferences.hasStarted {
                welcome
            } else if let clip = model.clips.first(where: { $0.id == model.previewID }) {
                ClipDetailView(clip: clip, copied: model.copiedID == clip.id,
                               image: clip.kind == .image ? model.preview(clip) : nil,
                               onCopy: { onCopy(clip) }, onPin: { model.pin(clip) })
            } else {
                searchBar
                filters
                history
                Divider()
                footer
            }
        }
        .frame(width: HandLayout.width, height: HandLayout.height)
        .background(Color(nsColor: .windowBackgroundColor))
        .task(id: model.copySequence) {
            guard model.copiedID != nil else { return }
            try? await Task.sleep(for: .seconds(3))
            if !Task.isCancelled { model.copiedID = nil }
        }
        .onChange(of: model.query) { model.selectedID = model.visibleClips.first?.id }
        .onChange(of: model.filter) { model.selectedID = model.visibleClips.first?.id }
        .onChange(of: model.board) { model.selectedID = model.visibleClips.first?.id }
        .alert("New board", isPresented: $creatingBoard) {
            TextField("Name", text: $boardName)
            Button("Create") { model.createBoard(boardName, pinning: boardClip) }
            Button("Cancel", role: .cancel) {}
        } message: {
            Text(boardClip == nil ? "Group pinned clips, like snippets or addresses."
                                  : "The clip will be pinned to it.")
        }
        .alert("Rename board", isPresented: Binding(
            get: { renamingBoard != nil }, set: { if !$0 { renamingBoard = nil } }
        )) {
            TextField("Name", text: $boardName)
            Button("Rename") { if let renamingBoard { model.renameBoard(renamingBoard, to: boardName) } }
            Button("Cancel", role: .cancel) {}
        }
        .onMoveCommand { direction in move(direction) }
        .alert("On Hand needs attention", isPresented: Binding(
            get: { model.errorMessage != nil }, set: { if !$0 { model.errorMessage = nil } }
        )) { Button("OK") { model.errorMessage = nil } } message: { Text(model.errorMessage ?? "") }
    }

    private var header: some View {
        HStack(spacing: 10) {
            if model.previewID != nil {
                Button { model.previewID = nil } label: { Image(systemName: "chevron.left") }
                    .buttonStyle(.borderless).help("Back to history").accessibilityLabel("Back to history")
                    .keyboardShortcut("[", modifiers: .command)
            } else {
                Image(nsImage: BrandIcon.image(size: 17)).foregroundStyle(.secondary)
            }
            Text(model.previewID == nil ? "On Hand" : "Clip preview").font(.headline)
            Spacer()
            if model.preferences.hasStarted {
                Button { model.preferences.keepOpen.toggle() } label: {
                    Image(systemName: "rectangle.on.rectangle")
                        .foregroundStyle(model.preferences.keepOpen ? Color.accentColor : .secondary)
                }
                .buttonStyle(.borderless).help("Keep window open while switching apps")
                .accessibilityLabel("Keep window open")
                .accessibilityValue(model.preferences.keepOpen ? "On" : "Off")
                Button { model.togglePause() } label: {
                    Image(systemName: model.recording ? "pause" : "play")
                }
                .buttonStyle(.borderless)
                .help(model.recording ? "Pause capture" : "Resume capture")
                .accessibilityLabel(model.recording ? "Pause capture" : "Resume capture")
            }
            Button { showingShortcuts.toggle() } label: { Image(systemName: "keyboard") }
                .buttonStyle(.borderless).help("Keyboard shortcuts").accessibilityLabel("Keyboard shortcuts")
                .popover(isPresented: $showingShortcuts) { ShortcutHelp() }
            Button(action: onSettings) { Image(systemName: "gearshape") }
                .buttonStyle(.borderless).help("Settings").accessibilityLabel("Settings")
        }.padding(.horizontal, 16).padding(.vertical, 12)
    }

    private var searchBar: some View {
        HistorySearchField(text: $model.query, focusRequest: model.searchFocusRequest,
                           onSubmit: copySelected, onMove: move)
            .frame(height: 24).padding(.horizontal, 16).padding(.top, 14)
    }

    private var filters: some View {
        VStack(spacing: 12) {
            Picker("Show", selection: $model.filter) {
                ForEach(["All", "Pinned", "Links", "Images"], id: \.self) { Text($0).tag($0) }
            }.pickerStyle(.segmented).labelsHidden()
            if model.filter == "Pinned" { boardBar }
            HStack {
                Text(model.query.isEmpty ? "Clipboard history" : "Search results")
                    .font(.subheadline.weight(.medium))
                Spacer()
                Text(model.visibleClips.count == 1 ? "1 item" : "\(model.visibleClips.count) items")
                    .font(.caption).monospacedDigit()
            }.foregroundStyle(.secondary)
        }.padding(.horizontal, 16).padding(.top, 10).padding(.bottom, 6)
    }

    private var boardBar: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 6) {
                boardChip("All pinned", selected: model.board == nil) { model.board = nil }
                ForEach(model.boards, id: \.self) { name in
                    boardChip(name, selected: model.board == name) { model.board = name }
                        .contextMenu {
                            Button("Rename…") { boardName = name; renamingBoard = name }
                            Button("Delete Board", role: .destructive) { model.deleteBoard(name) }
                        }
                }
                Button { newBoard(pinning: nil) } label: { Image(systemName: "plus").font(.caption) }
                    .buttonStyle(.borderless).help("New board").accessibilityLabel("New board")
            }
        }
    }

    private func boardChip(_ title: String, selected: Bool, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Text(title).font(.caption).padding(.horizontal, 10).padding(.vertical, 4)
                .foregroundStyle(selected ? Color.accentColor : .primary)
                .background(selected ? Color.accentColor.opacity(0.14) : Color.primary.opacity(0.06), in: Capsule())
        }
        .buttonStyle(.plain).accessibilityAddTraits(selected ? .isSelected : [])
    }

    private func newBoard(pinning clip: Clip?) {
        boardName = ""
        boardClip = clip
        creatingBoard = true
    }

    private var history: some View {
        Group {
            if model.visibleClips.isEmpty {
                VStack(spacing: 12) {
                    Image(systemName: model.query.isEmpty ? "square.on.square.dashed" : "magnifyingglass")
                        .font(.system(size: 28, weight: .light)).foregroundStyle(.tertiary)
                    Text(emptyTitle).font(.headline)
                    Text(emptyDetail).font(.system(size: 12)).foregroundStyle(.secondary)
                        .multilineTextAlignment(.center).frame(maxWidth: 290)
                }.frame(maxWidth: .infinity, maxHeight: .infinity)
            } else {
                ScrollViewReader { proxy in
                    ScrollView {
                        LazyVStack(spacing: 2) {
                            ForEach(Array(model.visibleClips.enumerated()), id: \.element.id) { index, clip in
                                ClipRow(clip: clip, shortcut: index < 9 ? index + 1 : nil,
                                        selected: model.selectedID == clip.id, copied: model.copiedID == clip.id,
                                        image: clip.kind == .image ? model.preview(clip) : nil,
                                        onCopy: { onCopy(clip) }, onPin: { model.pin(clip) },
                                        boards: model.boards, onPinToBoard: { model.pin(clip, to: $0) },
                                        onNewBoard: { newBoard(pinning: clip) },
                                        onDelete: { model.delete(clip) },
                                        onPreview: { model.selectedID = clip.id; model.previewID = clip.id })
                                    .id(clip.id)
                            }
                        }.padding(.horizontal, 8).padding(.bottom, 8)
                    }.onChange(of: model.selectedID) { _, id in
                        if let id { proxy.scrollTo(id, anchor: .center) }
                    }
                }
            }
        }.frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    private var footer: some View {
        HStack(spacing: 6) {
            Circle().fill(model.recording ? Color.green : .orange).frame(width: 5, height: 5)
            Text(model.recording ? "Capturing · On this Mac only" : "Capture paused")
                .foregroundStyle(.secondary)
            Spacer()
            Text(model.copiedID == nil ? "↑↓ select  ↵ copy" : "Copied · ⌘V to paste")
                .foregroundStyle(model.copiedID == nil ? Color.secondary : Color.accentColor)
        }
        .font(.caption).padding(.horizontal, 16).padding(.vertical, 10)
    }

    private var welcome: some View {
        VStack(spacing: 20) {
            Spacer()
            HandMark()
            Text("Your next copy has a home.").font(.title2.weight(.semibold))
            Text("On Hand remembers the text, links, and images you copy, so you can find them again.")
                .font(.system(size: 14)).foregroundStyle(.secondary)
                .multilineTextAlignment(.center).frame(maxWidth: 340)
            VStack(alignment: .leading, spacing: 12) {
                Label("History stays on this Mac", systemImage: "lock.shield")
                Label("Password-marked clips are skipped", systemImage: "key")
                Label("Unpinned clips expire after 7 days", systemImage: "clock")
            }.font(.system(size: 12)).foregroundStyle(.secondary).padding(.vertical, 8)
            Button("Start keeping my clipboard") { model.start() }
                .buttonStyle(.borderedProminent).controlSize(.large).disabled(!model.ready)
            Text("Pause or clear your history anytime.").font(.system(size: 11)).foregroundStyle(.tertiary)
            Spacer()
            Text("⌘⇧Space to open · Esc to dismiss").font(.system(size: 11)).foregroundStyle(.secondary)
                .padding(.bottom, 24)
        }.frame(maxWidth: .infinity)
    }

    private var emptyTitle: String {
        if !model.query.isEmpty { return "Nothing here by that name." }
        if model.filter == "Pinned", model.board != nil { return "Nothing on this board yet." }
        return model.filter == "Pinned" ? "Keep your favorites close." : "Ready when you copy."
    }
    private var emptyDetail: String {
        if !model.query.isEmpty { return "Try a different word or the name of the app you copied from." }
        if model.filter == "Pinned", model.board != nil {
            return "Right-click any clip and choose Pin to Board."
        }
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
