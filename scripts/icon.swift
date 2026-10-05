import AppKit

@main
@MainActor
struct RenderIcon {
    static func main() throws {
        let folder = CommandLine.arguments[1]
        try FileManager.default.createDirectory(atPath: folder, withIntermediateDirectories: true)
        for size in [16, 32, 128, 256, 512] {
            for scale in [1, 2] {
                let pixels = size * scale
                let image = BrandIcon.image(size: CGFloat(pixels), appIcon: true)
                guard let bitmap = NSBitmapImageRep(
                    bitmapDataPlanes: nil, pixelsWide: pixels, pixelsHigh: pixels,
                    bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false,
                    colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0
                ) else { fatalError("Could not allocate icon bitmap") }
                NSGraphicsContext.saveGraphicsState()
                NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: bitmap)
                image.draw(in: NSRect(x: 0, y: 0, width: pixels, height: pixels))
                NSGraphicsContext.restoreGraphicsState()
                if let png = bitmap.representation(using: .png, properties: [:]) {
                    let suffix = scale == 2 ? "@2x" : ""
                    try png.write(to: URL(fileURLWithPath: "\(folder)/icon_\(size)x\(size)\(suffix).png"))
                }
            }
        }
    }
}
