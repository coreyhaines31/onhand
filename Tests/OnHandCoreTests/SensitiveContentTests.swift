@testable import OnHandCore
import Testing

@Test(arguments: [
    "4242 4242 4242 4242", "4242424242424242", "My card is 5555-5555-5555-4444, exp 12/28",
    "378282246310005", "6011111111111117", "2223003122003222"
])
func detectsCardNumbers(_ text: String) {
    #expect(SensitiveContent.detect(in: text) == .cardNumber)
}

@Test(arguments: ["123-45-6789", "SSN: 078 05 1120", "my ssn is 219-09-9999."])
func detectsSocialSecurityNumbers(_ text: String) {
    #expect(SensitiveContent.detect(in: text) == .socialSecurityNumber)
}

// Fixtures are assembled at runtime so secret scanners don't mistake them for real keys.
private let fakeKeyBody = String(repeating: "Ab3", count: 13)
private let fakeSecretKeys: [String] = [
    "AKIA" + "IOSFODNN7EXAMPLE",
    ["sk", "live", fakeKeyBody].joined(separator: "_"),
    ["ghp", fakeKeyBody].joined(separator: "_"),
    "-----BEGIN OPENSSH " + "PRIVATE KEY-----",
    ["sk", "ant", fakeKeyBody].joined(separator: "-"),
    ["xoxb", "1234567890", fakeKeyBody].joined(separator: "-")
]
private let fakePublishableKey = ["pk", "live", fakeKeyBody].joined(separator: "_")

@Test(arguments: fakeSecretKeys)
func detectsSecretKeys(_ text: String) {
    #expect(SensitiveContent.detect(in: text) == .secretKey)
}

@Test(arguments: [
    "4242 4242 4242 4241", "Call +1 (555) 123-4567", "Order 1234567890123456", "ISBN 978-0-306-40615-7",
    "2026-10-06", "123456789", "000-12-3456", "666-12-3456", "900-12-3456", "123-00-4567", "123-45-0000",
    "3f2b8c1e-9d4a-4f6b-8e2a-7c5d1b0a9e3f", "192.168.100.200", "1.2345678901234567",
    fakePublishableKey, "Hello, world", ""
])
func ignoresOrdinaryText(_ text: String) {
    #expect(SensitiveContent.detect(in: text) == nil)
}
