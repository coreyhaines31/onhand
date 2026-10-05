"use client";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  FileText,
  Keyboard,
  Link,
  Pin,
  Play,
  RectangleHorizontal,
  Search,
  Settings,
  X,
} from "lucide-react";
import { useState } from "react";

const initialClips = [
  {
    id: 1,
    text: "Meet at the coffee shop. Thursday, 10:30.",
    source: "Messages",
    kind: "Text",
    time: "2 min ago",
    pinned: true,
  },
  {
    id: 2,
    text: "https://developer.apple.com/design/",
    source: "Safari",
    kind: "Links",
    time: "4 min ago",
    pinned: false,
  },
  {
    id: 3,
    text: "Send the updated mockups before Friday’s review.",
    source: "Notes",
    kind: "Text",
    time: "8 min ago",
    pinned: false,
  },
  {
    id: 4,
    text: "Thanks for the feedback. I’ll send a revised version tomorrow.",
    source: "Mail",
    kind: "Text",
    time: "12 min ago",
    pinned: false,
  },
  {
    id: 5,
    text: "let smallThings = makeSomethingUseful()",
    source: "Xcode",
    kind: "Text",
    time: "18 min ago",
    pinned: false,
  },
];

export default function ClipboardDemo() {
  const [clips, setClips] = useState(initialClips);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [previewID, setPreviewID] = useState<number | null>(null);
  const [copied, setCopied] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const preview = clips.find((clip) => clip.id === previewID);
  const words = query.toLocaleLowerCase().trim().split(/\s+/);
  const filtered = clips
    .filter(
      (clip) =>
        (filter !== "Pinned" || clip.pinned) &&
        (filter !== "Links" || clip.kind === "Links") &&
        filter !== "Images" &&
        words.every((word) =>
          `${clip.text} ${clip.source}`.toLocaleLowerCase().includes(word),
        ),
    )
    .sort((left, right) => Number(right.pinned) - Number(left.pinned));

  function pin(id: number) {
    setClips((current) =>
      current.map((clip) =>
        clip.id === id ? { ...clip, pinned: !clip.pinned } : clip,
      ),
    );
  }

  async function copy(id: number, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setMessage("Copied. Paste with ⌘V.");
    } catch {
      setMessage("Copy unavailable in this browser. Try the Mac app.");
    }
  }

  return (
    <div className="demo-window" aria-label="Interactive On Hand preview">
      <div className="demo-header">
        {preview ? (
          <button
            className="demo-back"
            onClick={() => setPreviewID(null)}
            aria-label="Back to demo history"
          >
            <ChevronLeft size={15} />
          </button>
        ) : (
          <Copy size={15} aria-hidden="true" />
        )}
        <strong>{preview ? "Clip preview" : "On Hand"}</strong>
        <div
          className="demo-tools"
          aria-hidden="true"
          title="Window controls are available in the Mac app"
        >
          <RectangleHorizontal />
          <Play />
          <Keyboard />
          <Settings />
        </div>
      </div>
      {preview ? (
        <div className="demo-detail">
          <div className="demo-metadata">
            <strong>{preview.kind === "Links" ? "Link" : "Text"}</strong>
            <p>
              From {preview.source} · {preview.time}
            </p>
          </div>
          <div className="demo-content">{preview.text}</div>
          <div className="demo-actions">
            <button
              onClick={() => pin(preview.id)}
              aria-pressed={preview.pinned}
            >
              <Pin size={13} />
              {preview.pinned ? "Unpin" : "Pin"}
            </button>
            <button
              className="copy-action"
              onClick={() => copy(preview.id, preview.text)}
            >
              {copied === preview.id ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      ) : (
        <>
          <label className="demo-search">
            <Search size={14} aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search clipboard history"
              aria-label="Search demo clips"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear demo search"
              >
                <X size={13} />
              </button>
            )}
          </label>
          <div
            className="demo-filters"
            role="group"
            aria-label="Filter demo clips"
          >
            {["All", "Pinned", "Links", "Images"].map((item) => (
              <button
                key={item}
                aria-pressed={filter === item}
                className={filter === item ? "active" : ""}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="demo-count">
            <span>{query ? "Search results" : "Clipboard history"}</span>
            <span>
              {filtered.length} {filtered.length === 1 ? "item" : "items"}
            </span>
          </div>
          <div className="demo-list">
            {filtered.length ? (
              filtered.map((clip, index) => (
                <div
                  className={`demo-row ${copied === clip.id || (copied === null && index === 0) ? "selected" : ""}`}
                  key={clip.id}
                >
                  <span className="clip-icon" aria-hidden="true">
                    {copied === clip.id ? (
                      <Check size={16} />
                    ) : clip.kind === "Links" ? (
                      <Link size={16} />
                    ) : (
                      <FileText size={16} />
                    )}
                  </span>
                  <button
                    className="clip-copy"
                    onClick={() => copy(clip.id, clip.text)}
                    aria-label={`Copy ${clip.text}`}
                  >
                    <span>{clip.text}</span>
                    <small>
                      {clip.source}
                      <b>·</b>
                      {copied === clip.id ? "Copied" : clip.time}
                    </small>
                  </button>
                  <button
                    className="preview-button"
                    onClick={() => setPreviewID(clip.id)}
                    aria-label={`Preview ${clip.text}`}
                  >
                    <ChevronRight size={12} />
                  </button>
                  <button
                    className={`pin-button ${clip.pinned ? "pinned" : ""}`}
                    aria-label={`${clip.pinned ? "Unpin" : "Pin"} ${clip.text}`}
                    aria-pressed={clip.pinned}
                    onClick={() => pin(clip.id)}
                  >
                    <Pin size={13} />
                  </button>
                </div>
              ))
            ) : (
              <div className="demo-empty">
                {filter === "Images"
                  ? "Images are supported in the Mac app."
                  : filter === "Pinned" && !query
                    ? "Keep a clip here."
                    : "No matching clips."}
                <small>
                  {filter === "Images"
                    ? "This preview uses sample text and links."
                    : filter === "Pinned" && !query
                      ? "Pin a clip from All to find it here."
                      : "Try another word or an app name."}
                </small>
              </div>
            )}
          </div>
        </>
      )}
      <div className="demo-footer">
        <span>
          <i />
          Sample clips
        </span>
        <span role="status" aria-live="polite">
          {message || "Click a clip to copy"}
        </span>
      </div>
    </div>
  );
}
