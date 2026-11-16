import AppKit

@MainActor
enum BrandIcon {
    /// The paperclip template glyph for the menu bar and in-app headers.
    static func image(size: CGFloat) -> NSImage {
        let configuration = NSImage.SymbolConfiguration(pointSize: size * 15 / 19, weight: .regular)
        let image = NSImage(systemSymbolName: "paperclip", accessibilityDescription: "On Hand")?
            .withSymbolConfiguration(configuration) ?? NSImage(size: NSSize(width: size, height: size))
        image.isTemplate = true
        return image
    }
}
