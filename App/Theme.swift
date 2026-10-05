import SwiftUI

enum HandLayout {
    static let width: CGFloat = 440
    static let height: CGFloat = 600
}

struct HandMark: View {
    var body: some View {
        Image(systemName: "square.on.square")
            .font(.system(size: 32, weight: .light))
            .foregroundStyle(.secondary)
            .frame(width: 56, height: 56)
    }
}
