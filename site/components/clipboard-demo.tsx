"use client";
import {
  Check,
  Copy,
  FileText,
  Link,
  Pin,
  Search,
  Settings2,
  X,
} from "lucide-react";
import { useState } from "react";

const initialClips = [
  {
    id: 1,
    text: "The best ideas tend to arrive when you’re doing something else.",
    source: "Notes",
    kind: "Text",
    time: "Just now",
    pinned: false,
  },
  {
    id: 2,
    text: "https://www.are.na/quiet-corners",
    source: "Safari",
    kind: "Links",
    time: "2 minutes ago",
    pinned: false,
  },
  {
    id: 3,
    text: "Good things take a little room to grow.",
    source: "Notes",
    kind: "Text",
    time: "8 minutes ago",
    pinned: true,
  },
  {
    id: 4,
    text: "Thursday, 10:30. The little coffee shop on the corner.",
    source: "Messages",
    kind: "Text",
    time: "12 minutes ago",
    pinned: false,
  },
  {
    id: 5,
    text: "#315D4B · A very good green",
    source: "Figma",
    kind: "Text",
    time: "18 minutes ago",
    pinned: false,
  },
];

export default function ClipboardDemo() {
  const [clips, setClips] = useState(initialClips);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [copied, setCopied] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const filtered = clips.filter(
    (clip) =>
      (filter !== "Pinned" || clip.pinned) &&
      (filter !== "Links" || clip.kind === "Links") &&
      `${clip.text} ${clip.source}`.toLowerCase().includes(query.toLowerCase()),
  );
  async function copy(id: number, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setMessage("Copied. Ready to paste.");
    } catch {
      setMessage("Clipboard access isn’t available here. Try the Mac app.");
    }
  }
  return (
    <div className="demo-window" aria-label="Interactive On Hand preview">
      <div className="demo-titlebar">
        <div className="traffic-lights">
          <i />
          <i />
          <i />
        </div>
        <span>ON HAND</span>
        <span className="demo-label">LIVE DEMO</span>
      </div>
      <div className="demo-header">
        <span className="mark small">
          <Copy size={20} />
        </span>
        <div>
          <strong>On Hand</strong>
          <span>Your clipboard, with a little memory.</span>
        </div>
        <Settings2 size={17} aria-hidden="true" />
      </div>
      <label className="demo-search">
        <Search size={17} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Find something you copied…"
          aria-label="Search demo clips"
        />
        {query && (
          <button onClick={() => setQuery("")} aria-label="Clear demo search">
            <X size={15} />
          </button>
        )}
      </label>
      <div className="demo-filters">
        {["All", "Pinned", "Links"].map((item) => (
          <button
            key={item}
            aria-pressed={filter === item}
            className={filter === item ? "active" : ""}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
        <span>{filtered.length} clips</span>
      </div>
      <div className="demo-list">
        {filtered.length ? (
          filtered.map((clip) => (
            <div className="demo-row" key={clip.id}>
              <span
                className={`clip-icon ${clip.source === "Figma" ? "swatch" : ""}`}
              >
                {clip.kind === "Links" ? (
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
                  {copied === clip.id ? "Copied!" : clip.time}
                </small>
              </button>
              <button
                className={`pin-button ${clip.pinned ? "pinned" : ""}`}
                aria-label={`${clip.pinned ? "Unpin" : "Pin"} ${clip.text}`}
                aria-pressed={clip.pinned}
                onClick={() =>
                  setClips(
                    clips.map((item) =>
                      item.id === clip.id
                        ? { ...item, pinned: !item.pinned }
                        : item,
                    ),
                  )
                }
              >
                {copied === clip.id ? <Check size={14} /> : <Pin size={14} />}
              </button>
            </div>
          ))
        ) : (
          <div className="demo-empty">
            Nothing here by that name.<small>Try “Notes” or “coffee”.</small>
          </div>
        )}
      </div>
      <div className="demo-footer">
        <span>
          <i />
          Sample clips only
        </span>
        <span role="status" aria-live="polite">
          {message || "Click a clip to copy"}
        </span>
      </div>
    </div>
  );
}
