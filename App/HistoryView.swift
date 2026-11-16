import OnHandCore
import PanelKit
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
    @Environment(\.handTheme) private var theme

    var body: some View {
        VStack(spacing: 0) {
            fascia
            if !model.preferences.hasStarted {
                WelcomeView(ready: model.ready) { model.start() }
            } else if let clip = model.clips.first(where: { $0.id == model.previewID }) {
                ClipDetailView(clip: clip, copied: model.copiedID == clip.id,
                               image: clip.kind == .image ? model.preview(clip) : nil,
                               onCopy: { onCopy(clip) }, onPin: { model.pin(clip) })
            } else {
                searchBar
                if model.isPaused { PausedBanner { model.togglePause() } }
                filters
                history
                footer
            }
        }
        .frame(width: HandLayout.width)
        .frame(minHeight: HandLayout.height, maxHeight: .infinity)
        .background(theme.background)
        .foregroundStyle(theme.ink)
        .panelAccent(PanelAccent.onHand)
        .ignoresSafeArea()
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

    private var fascia: some View {
        HandFascia(nameplate: "Clips", slip: slipContent,
                   detail: model.isPaused ? "Capture paused" : "Passwords skipped") {
            if model.previewID != nil {
                Button { model.previewID = nil } label: { KeyCap(symbol: "chevron.left") }
                    .buttonStyle(.plain).help("Back to history").accessibilityLabel("Back to history")
                    .keyboardShortcut("[", modifiers: .command)
            }
            Nameplate(model.previewID == nil ? "Clips" : "Clip preview")
            Spacer(minLength: 0)
            if model.preferences.hasStarted {
                Button { model.togglePause() } label: { KeyCap(symbol: model.recording ? "pause.fill" : "play.fill") }
                    .buttonStyle(.plain)
                    .help(model.recording ? "Pause capture" : "Resume capture")
                    .accessibilityLabel(model.recording ? "Pause capture" : "Resume capture")
            }
            moreMenu
        }
    }

    private var moreMenu: some View {
        Menu {
            if model.preferences.hasStarted {
                Toggle("Keep Window Open While Switching Apps", isOn: Binding(
                    get: { model.preferences.keepOpen }, set: { model.preferences.keepOpen = $0 }
                ))
            }
            Button("Keyboard Shortcuts") { DispatchQueue.main.async { showingShortcuts = true } }
            Divider()
            Button("Settings…", action: onSettings)
        } label: {
            KeyCap(symbol: "ellipsis")
        }
        .menuStyle(.button).buttonStyle(.plain).menuIndicator(.hidden).fixedSize()
        .help("More").accessibilityLabel("More")
        .popover(isPresented: $showingShortcuts) { ShortcutHelp() }
    }

    private var slipContent: ClipSlip.Content {
        let current = model.clips.first { $0.id == model.clipboardClipID }
        let newest = model.clips.filter { !$0.isSent }.max { $0.createdAt < $1.createdAt }
        guard let clip = current ?? newest else {
            return .empty(model.preferences.hasStarted ? "Nothing copied yet" : "Nothing kept yet")
        }
        return .clip(clip, image: clip.kind == .image ? model.preview(clip) : nil, onClipboard: current != nil)
    }

    private var searchBar: some View {
        HStack(spacing: 6) {
            Image(systemName: "magnifyingglass").font(.system(size: 11.5, weight: .medium))
                .foregroundStyle(theme.sub).frame(width: 13, height: 13).accessibilityHidden(true)
            HistorySearchField(text: $model.query, focusRequest: model.searchFocusRequest,
                               onSubmit: copySelected, onMove: move)
                .frame(height: 22)
            Text("⌘F").font(.system(size: 11)).foregroundStyle(theme.sub).accessibilityHidden(true)
        }
        .padding(.horizontal, 10).padding(.vertical, 3)
        .background(
            RoundedRectangle(cornerRadius: 6).fill(theme.field)
                .overlay(RoundedRectangle(cornerRadius: 6).strokeBorder(theme.line, lineWidth: 1))
                .overlay(RoundedRectangle(cornerRadius: 6).strokeBorder(
                    LinearGradient(colors: [.black.opacity(0.08), .clear], startPoint: .top, endPoint: .center),
                    lineWidth: 1))
        )
        .padding(.horizontal, 14).padding(.top, 12)
    }

    private var filters: some View {
        let names = model.preferences.saveSent
            ? ["All", "Pinned", "Links", "Images", "Sent"] : ["All", "Pinned", "Links", "Images"]
        return VStack(spacing: 2) {
            Tabs(names.map { PanelChoice($0, $0) }, selection: $model.filter)
            if model.filter == "Pinned" {
                BoardBar(boards: model.boards, selection: model.board,
                         onSelect: { model.board = $0 },
                         onRename: { boardName = $0; renamingBoard = $0 },
                         onDelete: { model.deleteBoard($0) },
                         onNew: { newBoard(pinning: nil) })
            }
        }.padding(.top, 2)
    }

    private func newBoard(pinning clip: Clip?) {
        boardName = ""
        boardClip = clip
        creatingBoard = true
    }

    private var history: some View {
        Group {
            if model.visibleClips.isEmpty {
                EmptyHistory(query: model.query, filter: model.filter, board: model.board)
            } else {
                ScrollViewReader { proxy in
                    ScrollView {
                        LazyVStack(spacing: 1) {
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
                            if model.query.isEmpty, model.filter == "All", model.visibleClips.count < 4 {
                                HistoryHint()
                            }
                        }.padding(.horizontal, 6).padding(.top, 2).padding(.bottom, 8)
                    }.onChange(of: model.selectedID) { _, id in
                        if let id { proxy.scrollTo(id, anchor: .center) }
                    }
                }
            }
        }.frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    private var footer: some View {
        let count = model.visibleClips.count
        let state = model.recording ? "Capturing · On this Mac only" : "Capture paused"
        return HStack(spacing: 6) {
            HandLED(status: model.recording ? .go : .caution)
            Text("\(state) · \(count == 1 ? "1 item" : "\(count) items")")
                .foregroundStyle(theme.sub).monospacedDigit().lineLimit(1).minimumScaleFactor(0.8)
            Spacer(minLength: 4)
            Text(model.copiedID == nil ? "↑↓ select  ↵ copy" : "Copied · ⌘V to paste")
                .fontWeight(model.copiedID == nil ? .regular : .semibold)
                .foregroundStyle(model.copiedID == nil ? theme.sub : theme.go).fixedSize()
        }
        .font(.system(size: 11))
        .padding(.horizontal, 14).padding(.vertical, 9)
        .overlay(alignment: .top) { Rectangle().fill(theme.line).frame(height: 1) }
        .accessibilityElement(children: .combine)
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
