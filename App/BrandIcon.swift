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
        NSColor(calibratedRed: 0.22, green: 0.27, blue: 0.36, alpha: 1).setFill()
        slip().fill()
        pocket().fill()
    }

    private static func slip() -> NSBezierPath {
        let slip = NSBezierPath()
        slip.move(to: NSPoint(x: 23, y: 20))
        slip.line(to: NSPoint(x: 40, y: 12))
        slip.curve(to: NSPoint(x: 45, y: 15), controlPoint1: NSPoint(x: 42, y: 11),
                   controlPoint2: NSPoint(x: 44, y: 12))
        slip.line(to: NSPoint(x: 48, y: 25))
        slip.curve(to: NSPoint(x: 44, y: 29), controlPoint1: NSPoint(x: 49, y: 28),
                   controlPoint2: NSPoint(x: 47, y: 30))
        slip.line(to: NSPoint(x: 24, y: 27))
        slip.curve(to: NSPoint(x: 23, y: 20), controlPoint1: NSPoint(x: 20, y: 27),
                   controlPoint2: NSPoint(x: 19, y: 22))
        slip.close()
        return slip
    }

    private static func pocket() -> NSBezierPath {
        let pocket = NSBezierPath()
        pocket.move(to: NSPoint(x: 18, y: 23))
        pocket.curve(to: NSPoint(x: 13, y: 29), controlPoint1: NSPoint(x: 15, y: 23),
                     controlPoint2: NSPoint(x: 13, y: 25))
        pocket.line(to: NSPoint(x: 13, y: 38))
        pocket.curve(to: NSPoint(x: 31, y: 54), controlPoint1: NSPoint(x: 13, y: 49),
                     controlPoint2: NSPoint(x: 20, y: 54))
        pocket.line(to: NSPoint(x: 33, y: 54))
        pocket.curve(to: NSPoint(x: 51, y: 38), controlPoint1: NSPoint(x: 44, y: 54),
                     controlPoint2: NSPoint(x: 51, y: 49))
        pocket.line(to: NSPoint(x: 51, y: 29))
        pocket.curve(to: NSPoint(x: 50, y: 26), controlPoint1: NSPoint(x: 51, y: 28),
                     controlPoint2: NSPoint(x: 51, y: 27))
        pocket.curve(to: NSPoint(x: 44, y: 32), controlPoint1: NSPoint(x: 52, y: 31),
                     controlPoint2: NSPoint(x: 48, y: 33))
        pocket.line(to: NSPoint(x: 23, y: 30))
        pocket.curve(to: NSPoint(x: 18, y: 23), controlPoint1: NSPoint(x: 19, y: 30),
                     controlPoint2: NSPoint(x: 16, y: 27))
        pocket.close()
        return pocket
    }
}
