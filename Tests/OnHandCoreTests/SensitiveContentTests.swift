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
private let fakeSecretKeys: [(String, String)] = [
    ("AKIA" + "IOSFODNN7EXAMPLE", "AWS access key"),
    (["sk", "live", fakeKeyBody].joined(separator: "_"), "Stripe secret key"),
    (["ghp", fakeKeyBody].joined(separator: "_"), "GitHub token"),
    ("-----BEGIN OPENSSH " + "PRIVATE KEY-----", "private key"),
    (["sk", "ant", fakeKeyBody].joined(separator: "-"), "Anthropic API key"),
    (["sk", "proj", fakeKeyBody].joined(separator: "-"), "OpenAI API key"),
    (["xoxb", "1234567890", fakeKeyBody].joined(separator: "-"), "Slack token"),
    ("GOCSPX-" + String(fakeKeyBody.prefix(28)), "Google OAuth client secret"),
    (["whsec", fakeKeyBody].joined(separator: "_"), "Stripe webhook secret"),
    ("glpat-" + String(fakeKeyBody.prefix(20)), "GitLab token"),
    (["npm", String(fakeKeyBody.prefix(36))].joined(separator: "_"), "npm token"),
    ("pypi-" + "AgEIcHlwaS5vcmc" + fakeKeyBody + fakeKeyBody, "PyPI token"),
    (["hf", fakeKeyBody].joined(separator: "_"), "Hugging Face token"),
    (["SG", String(fakeKeyBody.prefix(22)), String(fakeKeyBody.prefix(39)) + "Ab3x"].joined(separator: "."),
     "SendGrid API key"),
    (["shpat", fakeHex(32)].joined(separator: "_"), "Shopify token"),
    (["dop", "v1", fakeHex(64)].joined(separator: "_"), "DigitalOcean token"),
    (["lin", "api", String(fakeKeyBody.prefix(39)) + "x"].joined(separator: "_"), "Linear API key"),
    (["secret", String(fakeKeyBody.prefix(39)) + "Ab3x"].joined(separator: "_"), "Notion token"),
    (["PMAK", fakeHex(24), fakeHex(34)].joined(separator: "-"), "Postman API key"),
    (["sbp", fakeHex(40)].joined(separator: "_"), "Supabase token"),
    (["key", fakeHex(32)].joined(separator: "-"), "Mailgun API key"),
    (["dp", "pt", fakeKeyBody + "x"].joined(separator: "."), "Doppler token"),
    ("postgresql://app:" + "s3cr3tPass" + "@db.example.com/app", "database password"),
    ("mongodb+srv://admin:" + "hunter22" + "@cluster0.example.net", "database password"),
    ("DATABASE_PASSWORD=" + "correct-horse-battery", "secret"),
    ("export OPENROUTER_API_KEY=\"" + fakeKeyBody + "\"", "secret"),
    ("PORT=3000\nAUTH_SECRET=" + fakeKeyBody, "secret")
]

private func fakeHex(_ count: Int) -> String { String(String(repeating: "0a1b2c3d4e5f", count: 6).prefix(count)) }
private let fakePublishableKey = ["pk", "live", fakeKeyBody].joined(separator: "_")

@Test(arguments: fakeSecretKeys)
func detectsSecretKeys(_ text: String, name: String) {
    #expect(SensitiveContent.detect(in: text) == .secretKey(name))
}

@Test(arguments: [
    "4242 4242 4242 4241", "Call +1 (555) 123-4567", "Order 1234567890123456", "ISBN 978-0-306-40615-7",
    "2026-10-06", "123456789", "000-12-3456", "666-12-3456", "900-12-3456", "123-00-4567", "123-45-0000",
    "3f2b8c1e-9d4a-4f6b-8e2a-7c5d1b0a9e3f", "192.168.100.200", "1.2345678901234567",
    fakePublishableKey, "Hello, world", "",
    "postgresql://localhost:5432/app", "https://user@example.com/path",
    "API_KEY=$OPENAI_API_KEY", "const API_KEY = process.env.API_KEY", "token = getToken()",
    "PASSWORD=short", "# set SECRET_KEY=your-value-here in .env",
    "Use the key-value store", "monkey-0123456789abcdef"
])
func ignoresOrdinaryText(_ text: String) {
    #expect(SensitiveContent.detect(in: text) == nil)
}
