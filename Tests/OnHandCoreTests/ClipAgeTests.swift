import Foundation
@testable import OnHandCore
import Testing

@Test func clipAgesAreCompact() {
    let now = Date(timeIntervalSince1970: 1_800_000_000)
    let ago = { (seconds: Double) in ClipAge.label(for: now.addingTimeInterval(-seconds), now: now) }
    #expect(ago(5) == "Just now")
    #expect(ago(-30) == "Just now")
    #expect(ago(8 * 60 + 1) == "8m ago")
    #expect(ago(3 * 3_600 + 59) == "3h ago")
    #expect(ago(2 * 86_400) == "2d ago")
    #expect(ago(10 * 86_400).contains { $0.isNumber })
    #expect(!ago(10 * 86_400).contains("ago"))
}
