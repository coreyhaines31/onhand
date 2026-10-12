import Foundation

/// Compact clip ages for list rows: "Just now", "8m ago", "3h ago", "2d ago", then a date like "Oct 4".
public enum ClipAge {
    public static func label(for date: Date, now: Date = Date(), calendar: Calendar = .current) -> String {
        let seconds = max(0, now.timeIntervalSince(date))
        switch seconds {
        case ..<60: return "Just now"
        case ..<3_600: return "\(Int(seconds / 60))m ago"
        case ..<86_400: return "\(Int(seconds / 3_600))h ago"
        case ..<(7 * 86_400): return "\(Int(seconds / 86_400))d ago"
        default:
            let sameYear = calendar.component(.year, from: date) == calendar.component(.year, from: now)
            let format = sameYear ? Date.FormatStyle().month(.abbreviated).day()
                                  : Date.FormatStyle().month(.abbreviated).day().year()
            return date.formatted(format)
        }
    }
}
