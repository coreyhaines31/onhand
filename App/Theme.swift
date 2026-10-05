import SwiftUI

enum HandLayout {
    static let width: CGFloat = 440
    static let height: CGFloat = 600
}

struct HandMark: View {
    var body: some View {
        Image(nsImage: BrandIcon.image(size: 48))
            .foregroundStyle(.secondary)
            .frame(width: 56, height: 56)
    }
}
