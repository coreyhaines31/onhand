import AppKit

@MainActor
enum BrandIcon {
    /// The clipboard-stack template glyph (an 18 pt drawing) for the menu bar and in-app marks.
    static func image(size: CGFloat = 18) -> NSImage {
        guard let glyph = NSImage(named: "MenuBarGlyph")?.copy() as? NSImage else {
            return NSImage(size: NSSize(width: size, height: size))
        }
        glyph.size = NSSize(width: size, height: size)
        glyph.isTemplate = true
        glyph.accessibilityDescription = "On Hand"
        return glyph
    }
}
