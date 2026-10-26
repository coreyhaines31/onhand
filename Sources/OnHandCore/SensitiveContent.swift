import Foundation

/// On-device check for text that should never be kept in clipboard history.
public enum SensitiveContent: Equatable, Sendable {
    case cardNumber
    case socialSecurityNumber
    /// Carries the kind of key, like "GitHub token".
    case secretKey(String)

    public var name: String {
        switch self {
        case .cardNumber: "card number"
        case .socialSecurityNumber: "Social Security number"
        case .secretKey(let name): name
        }
    }

    public static func detect(in text: String) -> SensitiveContent? {
        let range = NSRange(text.startIndex..., in: text)
        let hasCard = cardCandidates.matches(in: text, range: range).contains { match in
            let digits = (text as NSString).substring(with: match.range).filter(\.isNumber)
            return hasCardPrefix(digits) && passesLuhn(digits)
        }
        if hasCard { return .cardNumber }
        let hasSSN = socialSecurityNumbers.matches(in: text, range: range).contains { match in
            let part = { Int((text as NSString).substring(with: match.range(at: $0))) ?? 0 }
            let area = part(1)
            return area != 0 && area != 666 && area < 900 && part(3) != 0 && part(4) != 0
        }
        if hasSSN { return .socialSecurityNumber }
        let key = secretKeys.first { $0.pattern.firstMatch(in: text, range: range) != nil }
        return key.map { .secretKey($0.name) }
    }

    nonisolated(unsafe) private static let cardCandidates = expression(#"(?<![\d.-])(?:\d[ -]?){12,18}\d(?![\d.-])"#)
    nonisolated(unsafe) private static let socialSecurityNumbers =
        expression(#"(?<![\d-])(\d{3})([- ])(\d{2})\2(\d{4})(?![\d-])"#)
    // Checked in order, so specific prefixes come before the general ones they overlap.
    nonisolated(unsafe) private static let secretKeys: [(name: String, pattern: NSRegularExpression)] = [
        ("private key", #"-----BEGIN (?:[A-Z]+ )?PRIVATE KEY-----"#),
        ("AWS access key", #"\bAKIA[0-9A-Z]{16}\b"#),
        ("Stripe secret key", #"\b[rs]k_live_[0-9A-Za-z]{20,}"#),
        ("GitHub token", #"\bgh[pousr]_[A-Za-z0-9]{36,}"#),
        ("GitHub token", #"\bgithub_pat_[A-Za-z0-9_]{40,}"#),
        ("Slack token", #"\bxox[abprs]-[A-Za-z0-9-]{10,}"#),
        ("Anthropic API key", #"\bsk-ant-[A-Za-z0-9_-]{20,}"#),
        ("OpenAI API key", #"\bsk-(?:proj-)?[A-Za-z0-9_-]{32,}"#),
        ("Google API key", #"\bAIza[0-9A-Za-z_-]{35}\b"#)
    ].map { ($0.0, expression($0.1)) }

    private static func expression(_ pattern: String) -> NSRegularExpression {
        // Patterns are compile-time constants covered by tests.
        // swiftlint:disable:next force_try
        try! NSRegularExpression(pattern: pattern)
    }

    private static func hasCardPrefix(_ digits: String) -> Bool {
        let length = digits.count
        let prefix = { Int(digits.prefix($0)) ?? 0 }
        switch true {
        case digits.hasPrefix("4"): return [13, 16, 19].contains(length)
        case (51...55).contains(prefix(2)), (2221...2720).contains(prefix(4)): return length == 16
        case [34, 37].contains(prefix(2)): return length == 15
        case prefix(4) == 6011, (644...649).contains(prefix(3)), prefix(2) == 65, prefix(2) == 62,
             (3528...3589).contains(prefix(4)):
            return (16...19).contains(length)
        case (300...305).contains(prefix(3)), [36, 38, 39].contains(prefix(2)): return (14...19).contains(length)
        default: return false
        }
    }

    private static func passesLuhn(_ digits: String) -> Bool {
        let sum = digits.reversed().compactMap(\.wholeNumberValue).enumerated().reduce(0) { total, item in
            let doubled = item.offset.isMultiple(of: 2) ? item.element : item.element * 2
            return total + (doubled > 9 ? doubled - 9 : doubled)
        }
        return sum.isMultiple(of: 10)
    }
}
