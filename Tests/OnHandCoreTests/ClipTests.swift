import Foundation
@testable import OnHandCore
import Testing

@Test func titleUsesFirstLine() {
    let clip = Clip(id: "1", kind: .text, text: "First\nSecond", data: Data(),
                    source: "Test", createdAt: Date(), isPinned: false)
    #expect(clip.title == "First")
}
