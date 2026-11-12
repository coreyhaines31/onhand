import Foundation
@testable import OnHandCore
import Testing

@Test func titleUsesFirstLine() {
    let clip = Clip(id: "1", kind: .text, text: "First\nSecond", data: Data(),
                    source: "Test", createdAt: Date(), isPinned: false)
    #expect(clip.title == "First")
}

@Test func previewCollapsesWhitespaceAndTruncates() {
    let clip = Clip(id: "1", kind: .text, text: "One\n  two\tthree four", data: Data(),
                    source: "Test", createdAt: Date(), isPinned: false)
    #expect(clip.preview() == "One two three four")
    #expect(clip.preview(length: 8) == "One two…")
}

@Test func imagePreviewUsesRecognizedText() {
    var clip = Clip(id: "1", kind: .image, text: "", data: Data(), source: "Test", createdAt: Date(), isPinned: false)
    #expect(clip.preview().isEmpty)
    clip.recognizedText = "Order #4021\nShips Thursday"
    #expect(clip.preview() == "Order #4021 Ships Thursday")
}

@Test func flagsLikelySecretsSoPinningCanWarn() {
    let card = Clip(id: "1", kind: .text, text: "4242 4242 4242 4242", data: Data(),
                    source: "Test", createdAt: Date(), isPinned: false)
    #expect(card.sensitiveContent == .cardNumber)
    var image = Clip(id: "2", kind: .image, text: "", data: Data(), source: "Test", createdAt: Date(), isPinned: false)
    #expect(image.sensitiveContent == nil)
    image.recognizedText = "Card 5555-5555-5555-4444"
    #expect(image.sensitiveContent == .cardNumber)
    let note = Clip(id: "3", kind: .text, text: "Meet at 10:30", data: Data(),
                    source: "Test", createdAt: Date(), isPinned: false)
    #expect(note.sensitiveContent == nil)
}
