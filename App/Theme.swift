import AppKit
import PanelKit
import SwiftUI

enum HandLayout {
    static let width: CGFloat = 340
    static let height: CGFloat = 600
}

/// The app icon, shown on the welcome screen.
struct HandMark: View {
    var body: some View {
        Image(nsImage: NSApp.applicationIconImage)
            .resizable()
            .frame(width: 56, height: 56)
            .accessibilityHidden(true)
    }
}
