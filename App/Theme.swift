import SwiftUI

extension Color {
    static let handGreen = Color(red: 0.19, green: 0.39, blue: 0.31)
}

struct HandMark: View {
    var body: some View {
        Image(systemName: "square.on.square")
            .font(.system(size: 23, weight: .medium))
            .foregroundStyle(.white)
            .frame(width: 44, height: 44)
            .background(Color.handGreen, in: RoundedRectangle(cornerRadius: 13))
    }
}
