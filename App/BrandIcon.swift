import AppKit

@MainActor
enum BrandIcon {
    static func image(size: CGFloat, appIcon: Bool = false) -> NSImage {
        let image = NSImage(size: NSSize(width: size, height: size))
        image.lockFocus()
        let transform = NSAffineTransform()
        transform.translateX(by: 0, yBy: size)
        transform.scaleX(by: size / 64, yBy: -size / 64)
        transform.concat()
        if appIcon {
            let tile = NSBezierPath(roundedRect: NSRect(x: 4, y: 4, width: 56, height: 56),
                                    xRadius: 14, yRadius: 14)
            NSGradient(starting: .white, ending: NSColor(calibratedRed: 0.76, green: 0.81, blue: 0.89, alpha: 1))?
                .draw(in: tile, angle: 65)
            NSColor.white.withAlphaComponent(0.9).setStroke()
            tile.lineWidth = 0.7
            tile.stroke()
        }
        let ink = appIcon ? NSColor(calibratedRed: 0.22, green: 0.27, blue: 0.36, alpha: 1) : .black
        ink.setStroke()
        drawNote()
        drawHand()
        image.unlockFocus()
        image.isTemplate = !appIcon
        image.accessibilityDescription = "On Hand"
        return image
    }

    private static func drawNote() {
        let note = NSBezierPath()
        note.move(to: NSPoint(x: 23, y: 30))
        note.line(to: NSPoint(x: 23, y: 16))
        note.curve(to: NSPoint(x: 26, y: 13), controlPoint1: NSPoint(x: 23, y: 14),
                   controlPoint2: NSPoint(x: 24, y: 13))
        note.line(to: NSPoint(x: 36, y: 13))
        note.line(to: NSPoint(x: 43, y: 20))
        note.line(to: NSPoint(x: 43, y: 32))
        note.move(to: NSPoint(x: 36, y: 13))
        note.line(to: NSPoint(x: 36, y: 20))
        note.line(to: NSPoint(x: 43, y: 20))
        stroke(note)
    }

    private static func drawHand() {
        let hand = NSBezierPath()
        hand.move(to: NSPoint(x: 11, y: 34))
        hand.curve(to: NSPoint(x: 11, y: 39), controlPoint1: NSPoint(x: 9, y: 35),
                   controlPoint2: NSPoint(x: 9, y: 37))
        hand.line(to: NSPoint(x: 20, y: 48))
        hand.curve(to: NSPoint(x: 29, y: 52), controlPoint1: NSPoint(x: 23, y: 51),
                   controlPoint2: NSPoint(x: 25, y: 52))
        hand.line(to: NSPoint(x: 38, y: 52))
        hand.curve(to: NSPoint(x: 46, y: 47), controlPoint1: NSPoint(x: 42, y: 52),
                   controlPoint2: NSPoint(x: 44, y: 50))
        hand.line(to: NSPoint(x: 54, y: 35))
        hand.curve(to: NSPoint(x: 49, y: 31), controlPoint1: NSPoint(x: 57, y: 31),
                   controlPoint2: NSPoint(x: 52, y: 28))
        hand.line(to: NSPoint(x: 42, y: 40))
        hand.line(to: NSPoint(x: 36, y: 43))
        hand.line(to: NSPoint(x: 28, y: 43))
        hand.move(to: NSPoint(x: 14, y: 36))
        hand.line(to: NSPoint(x: 23, y: 40))
        hand.line(to: NSPoint(x: 34, y: 40))
        hand.curve(to: NSPoint(x: 34, y: 34), controlPoint1: NSPoint(x: 38, y: 40),
                   controlPoint2: NSPoint(x: 38, y: 34))
        hand.line(to: NSPoint(x: 27, y: 34))
        hand.line(to: NSPoint(x: 22, y: 31))
        hand.line(to: NSPoint(x: 15, y: 31))
        hand.curve(to: NSPoint(x: 11, y: 34), controlPoint1: NSPoint(x: 13, y: 31),
                   controlPoint2: NSPoint(x: 12, y: 32))
        stroke(hand)
    }

    private static func stroke(_ path: NSBezierPath) {
        path.lineWidth = 2.6
        path.lineCapStyle = .round
        path.lineJoinStyle = .round
        path.stroke()
    }
}
