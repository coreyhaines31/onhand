import SwiftUI

/// Full-width segmented tabs styled after the native control.
struct FilterTabs: View {
    @Binding var selection: String
    let options: [String]

    var body: some View {
        HStack(spacing: 2) {
            ForEach(options, id: \.self) { option in
                let selected = selection == option
                Button { selection = option } label: {
                    Text(option).font(.callout.weight(selected ? .semibold : .regular))
                        .frame(maxWidth: .infinity).padding(.vertical, 4)
                        .foregroundStyle(selected ? Color.primary : .secondary)
                        .background {
                            if selected {
                                RoundedRectangle(cornerRadius: 6).fill(Color(nsColor: .controlBackgroundColor))
                                    .shadow(color: .black.opacity(0.12), radius: 1, y: 0.5)
                            }
                        }
                        .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
                .accessibilityAddTraits(selected ? .isSelected : [])
            }
        }
        .padding(2)
        .background(Color.primary.opacity(0.06), in: RoundedRectangle(cornerRadius: 8))
    }
}
