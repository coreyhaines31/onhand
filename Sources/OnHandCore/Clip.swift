import Foundation

public struct Clip: Identifiable, Equatable, Sendable {
    public enum Kind: String, Sendable { case text, link, image }
    public let id: String
    public let kind: Kind
    public let text: String
    public let data: Data
    public let source: String
    public let createdAt: Date
    public let isPinned: Bool
    public var recognizedText: String?
    public var board: String?

    public var title: String {
        if kind == .image { return "Image" }
        return text.split(whereSeparator: \.isNewline).first.map(String.init) ?? text
    }
}
