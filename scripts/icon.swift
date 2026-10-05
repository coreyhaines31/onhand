import AppKit

let folder = CommandLine.arguments[1]
try FileManager.default.createDirectory(atPath: folder, withIntermediateDirectories: true)
for size in [16, 32, 128, 256, 512] {
    for scale in [1, 2] {
        let pixels = size * scale
        let image = NSImage(size: NSSize(width: pixels, height: pixels))
        image.lockFocus()
        let unit = CGFloat(pixels) / 1024
        let transform = NSAffineTransform()
        transform.scale(by: unit)
        transform.concat()
        NSColor(calibratedRed: 0.19, green: 0.365, blue: 0.294, alpha: 1).setFill()
        NSBezierPath(roundedRect: NSRect(x: 62, y: 62, width: 900, height: 900),
                     xRadius: 208, yRadius: 208).fill()
        NSColor(calibratedRed: 0.97, green: 0.96, blue: 0.91, alpha: 1).setStroke()
        let back = NSBezierPath(roundedRect: NSRect(x: 264, y: 350, width: 370, height: 424),
                                xRadius: 57, yRadius: 57)
        back.lineWidth = 35
        back.stroke()
        let front = NSBezierPath(roundedRect: NSRect(x: 389, y: 232, width: 370, height: 424),
                                 xRadius: 57, yRadius: 57)
        front.fill()
        front.lineWidth = 35
        front.stroke()
        image.unlockFocus()
        if let tiff = image.tiffRepresentation,
           let png = NSBitmapImageRep(data: tiff)?.representation(using: .png, properties: [:]) {
            let suffix = scale == 2 ? "@2x" : ""
            try png.write(to: URL(fileURLWithPath: "\(folder)/icon_\(size)x\(size)\(suffix).png"))
        }
    }
}
