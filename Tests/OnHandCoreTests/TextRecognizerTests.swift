import AppKit
@testable import OnHandCore
import Testing

@Test func recognizesTextInRenderedImage() throws {
    let rep = try #require(NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: 600, pixelsHigh: 120,
                                            bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true,
                                            isPlanar: false, colorSpaceName: .deviceRGB,
                                            bytesPerRow: 0, bitsPerPixel: 0))
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
    NSColor.white.setFill()
    NSRect(x: 0, y: 0, width: 600, height: 120).fill()
    ("Invoice 4021" as NSString).draw(at: NSPoint(x: 30, y: 35),
                                      withAttributes: [.font: NSFont.systemFont(ofSize: 48)])
    NSGraphicsContext.restoreGraphicsState()
    let png = try #require(rep.representation(using: .png, properties: [:]))
    #expect(TextRecognizer.text(in: png).contains("4021"))
}

@Test func unreadableDataYieldsNoText() {
    #expect(TextRecognizer.text(in: Data([1, 2, 3])).isEmpty)
}
