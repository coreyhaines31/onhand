import AppKit

@MainActor
enum BrandIcon {
    /// The filled mark on a tile for the app icon, or the paperclip template glyph for the menu bar and in-app headers.
    static func image(size: CGFloat, appIcon: Bool = false) -> NSImage {
        guard appIcon else { return glyph(size: size) }
        let image = NSImage(size: NSSize(width: size, height: size), flipped: false) { rect in
            drawAppIcon(in: rect)
            return true
        }
        image.accessibilityDescription = "On Hand"
        return image
    }

    /// SF Symbols in the menu bar use a 15pt glyph in a 19pt slot; scale from that for other sizes.
    private static func glyph(size: CGFloat) -> NSImage {
        let configuration = NSImage.SymbolConfiguration(pointSize: size * 15 / 19, weight: .regular)
        let image = NSImage(systemSymbolName: "paperclip", accessibilityDescription: "On Hand")?
            .withSymbolConfiguration(configuration) ?? NSImage(size: NSSize(width: size, height: size))
        image.isTemplate = true
        return image
    }

    private static func drawAppIcon(in rect: NSRect) {
        let transform = NSAffineTransform()
        transform.translateX(by: 0, yBy: rect.height)
        transform.scaleX(by: rect.width / 64, yBy: -rect.height / 64)
        transform.concat()
        let tile = NSBezierPath(roundedRect: NSRect(x: 4, y: 4, width: 56, height: 56), xRadius: 14, yRadius: 14)
        NSGradient(starting: .white, ending: NSColor(calibratedRed: 0.76, green: 0.81, blue: 0.89, alpha: 1))?
            .draw(in: tile, angle: 65)
        NSColor.white.withAlphaComponent(0.9).setStroke()
        tile.lineWidth = 0.7
        tile.stroke()
        NSColor(calibratedRed: 0.22, green: 0.27, blue: 0.36, alpha: 1).setStroke()
        let clip = paperclip()
        clip.lineWidth = 3.6
        clip.lineCapStyle = .round
        clip.lineJoinStyle = .round
        clip.stroke()
    }

    /// A gem clip drawn in the 64-point icon grid (y grows downward), tilted like the menu bar symbol.
    /// SF Symbols can't be used in app icons, so this is drawn here instead.
    private static func paperclip() -> NSBezierPath {
        let clip = NSBezierPath()
        clip.move(to: NSPoint(x: 23, y: 47))
        clip.line(to: NSPoint(x: 23, y: 20))
        clip.appendArc(withCenter: NSPoint(x: 32, y: 20), radius: 9, startAngle: 180, endAngle: 0, clockwise: false)
        clip.line(to: NSPoint(x: 41, y: 45))
        clip.appendArc(withCenter: NSPoint(x: 34.5, y: 45), radius: 6.5, startAngle: 0, endAngle: 180, clockwise: false)
        clip.line(to: NSPoint(x: 28, y: 24))
        clip.appendArc(withCenter: NSPoint(x: 32, y: 24), radius: 4, startAngle: 180, endAngle: 0, clockwise: false)
        clip.line(to: NSPoint(x: 36, y: 39))
        let tilt = NSAffineTransform()
        tilt.translateX(by: 32, yBy: 32)
        tilt.rotate(byDegrees: 40)
        tilt.translateX(by: -32, yBy: -32)
        clip.transform(using: tilt as AffineTransform)
        return clip
    }
}
