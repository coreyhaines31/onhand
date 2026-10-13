"use client";
import {
  AlignLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  CirclePause,
  CirclePlay,
  Ellipsis,
  Image as ImageIcon,
  Link,
  Paperclip,
  Pin,
  Search,
  X,
} from "lucide-react";
import { type KeyboardEvent, useState } from "react";

type Clip = {
  id: number;
  kind: "text" | "link" | "image";
  text: string;
  source: string;
  minutesAgo: number;
  pinned: boolean;
  board?: string;
};

// The same sample clips as the Mac app's demo mode.
const initialClips: Clip[] = [
  {
    id: 1,
    kind: "text",
    text: "Everything you copy, close at hand.",
    source: "Notes",
    minutesAgo: 0,
    pinned: true,
  },
  {
    id: 2,
    kind: "text",
    text: "let smallThings = makeSomethingUseful()",
    source: "Xcode",
    minutesAgo: 8,
    pinned: true,
    board: "Snippets",
  },
  {
    id: 3,
    kind: "image",
    text: "Order #4021 · Ships Thursday",
    source: "Screenshot",
    minutesAgo: 1,
    pinned: false,
  },
  {
    id: 4,
    kind: "link",
    text: "https://developer.apple.com/design/",
    source: "Safari",
    minutesAgo: 2,
    pinned: false,
  },
  {
    id: 5,
    kind: "text",
    text: "Good tools get out of your way. Great tools feel like they were always there.",
    source: "Notes",
    minutesAgo: 4,
    pinned: false,
  },
  {
    id: 6,
    kind: "text",
    text: "Meet at the little coffee shop on the corner. Thursday, 10:30.",
    source: "Messages",
    minutesAgo: 6,
    pinned: false,
  },
];

const filters = ["All", "Pinned", "Links", "Images"];
const boards = ["Snippets", "Addresses"];

function age(minutes: number) {
  return minutes === 0 ? "Just now" : `${minutes}m ago`;
}

function Thumbnail({ clip, copied }: { clip: Clip; copied: boolean }) {
  if (copied) {
    return (
      <span className="clip-icon" aria-hidden="true">
        <Check size={16} />
      </span>
    );
  }
  if (clip.kind === "image") {
    return (
      <span className="clip-icon clip-shot" aria-hidden="true">
        <span>{clip.text}</span>
      </span>
    );
  }
  return (
    <span className="clip-icon" aria-hidden="true">
      {clip.kind === "link" ? <Link size={15} /> : <AlignLeft size={15} />}
    </span>
  );
}

export default function ClipboardDemo() {
  const [clips, setClips] = useState(initialClips);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [board, setBoard] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [selectedID, setSelectedID] = useState<number | null>(null);
  const [previewID, setPreviewID] = useState<number | null>(null);
  const [copiedID, setCopiedID] = useState<number | null>(null);
  const [copyFailed, setCopyFailed] = useState(false);
  const preview = clips.find((clip) => clip.id === previewID);
  const words = query.toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const visible = clips
    .filter(
      (clip) =>
        (filter !== "Pinned" || clip.pinned) &&
        (filter !== "Pinned" || board === null || clip.board === board) &&
        (filter !== "Links" || clip.kind === "link") &&
        (filter !== "Images" || clip.kind === "image") &&
        words.every((word) =>
          `${clip.text} ${clip.source}`.toLocaleLowerCase().includes(word),
        ),
    )
    .sort(
      (left, right) =>
        Number(right.pinned) - Number(left.pinned) ||
        left.minutesAgo - right.minutesAgo,
    );
  const selected = visible.find((clip) => clip.id === selectedID) ?? visible[0];

  function pin(id: number) {
    setClips((current) =>
      current.map((clip) =>
        clip.id === id
          ? { ...clip, pinned: !clip.pinned, board: undefined }
          : clip,
      ),
    );
  }

  async function copy(clip: Clip) {
    setSelectedID(clip.id);
    try {
      // Browsers can't put a sample screenshot on the clipboard, so image clips copy their text.
      await navigator.clipboard.writeText(clip.text);
      setCopiedID(clip.id);
      setCopyFailed(false);
    } catch {
      setCopyFailed(true);
    }
  }

  function chooseFilter(item: string) {
    setFilter(item);
    setBoard(null);
    setSelectedID(null);
  }

  function handleKey(event: KeyboardEvent<HTMLInputElement>) {
    if (!visible.length) return;
    const index = selected ? visible.indexOf(selected) : -1;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setSelectedID(
        visible[Math.min(visible.length - 1, Math.max(0, index + step))].id,
      );
    } else if (event.key === "Enter" && selected) {
      copy(selected);
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
          <Paperclip size={16} aria-hidden="true" />
        )}
        <strong>{preview ? "Clip preview" : "On Hand"}</strong>
        <div className="demo-tools">
          <button
            onClick={() => setPaused(!paused)}
            aria-label={paused ? "Resume capture" : "Pause capture"}
            title={paused ? "Resume capture" : "Pause capture"}
          >
            {paused ? <CirclePlay /> : <CirclePause />}
          </button>
          <span
            title="Settings and shortcuts are in the Mac app"
            aria-hidden="true"
          >
            <Ellipsis />
          </span>
        </div>
      </div>
      {preview ? (
        <div className="demo-detail">
          <div className="demo-metadata">
            <strong>
              {preview.kind === "image" ? (
                <ImageIcon size={13} />
              ) : preview.kind === "link" ? (
                <Link size={13} />
              ) : (
                <AlignLeft size={13} />
              )}
              {preview.kind === "image"
                ? "Image"
                : preview.kind === "link"
                  ? "Link"
                  : "Text"}
            </strong>
            <p>
              From {preview.source} · {age(preview.minutesAgo)}
            </p>
          </div>
          <div className="demo-content">
            {preview.kind === "image" ? (
              <>
                <div className="demo-shot">{preview.text}</div>
                <small>Text in image</small>
                <p>{preview.text}</p>
              </>
            ) : (
              preview.text
            )}
          </div>
          <div className="demo-actions">
            <button
              onClick={() => pin(preview.id)}
              aria-pressed={preview.pinned}
            >
              <Pin size={13} />
              {preview.pinned ? "Unpin" : "Pin"}
            </button>
            <button className="copy-action" onClick={() => copy(preview)}>
              {copiedID === preview.id ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      ) : (
        <>
          <label className="demo-search">
            <Search size={14} aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSelectedID(null);
              }}
              onKeyDown={handleKey}
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
          {paused && (
            <div className="demo-paused">
              <CirclePause size={14} aria-hidden="true" />
              <span>Capture is paused. New copies aren’t saved.</span>
              <button onClick={() => setPaused(false)}>Resume</button>
            </div>
          )}
          <div
            className="demo-filters"
            role="group"
            aria-label="Filter demo clips"
          >
            {filters.map((item) => (
              <button
                key={item}
                aria-pressed={filter === item}
                className={filter === item ? "active" : ""}
                onClick={() => chooseFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
          {filter === "Pinned" && (
            <div className="demo-boards" role="group" aria-label="Boards">
              {[null, ...boards].map((name) => (
                <button
                  key={name ?? "all"}
                  className={board === name ? "active" : ""}
                  aria-pressed={board === name}
                  onClick={() => {
                    setBoard(name);
                    setSelectedID(null);
                  }}
                >
                  {name ?? "All pinned"}
                </button>
              ))}
            </div>
          )}
          <div className="demo-list">
            {visible.length ? (
              visible.map((clip, index) => (
                <div
                  className={`demo-row ${clip === selected ? "selected" : ""}`}
                  key={clip.id}
                >
                  <button
                    className="clip-copy"
                    onClick={() => copy(clip)}
                    aria-label={`Copy ${clip.text}`}
                  >
                    <Thumbnail clip={clip} copied={copiedID === clip.id} />
                    <span className="clip-text">
                      <span>{clip.text}</span>
                      <small>
                        {clip.source}
                        <b>·</b>
                        {age(clip.minutesAgo)}
                        {clip.board && (
                          <>
                            <b>·</b>
                            {clip.board}
                          </>
                        )}
                      </small>
                    </span>
                  </button>
                  {index < 9 && (
                    <kbd className="clip-shortcut">⌘{index + 1}</kbd>
                  )}
                  <button
                    className="preview-button"
                    onClick={() => {
                      setSelectedID(clip.id);
                      setPreviewID(clip.id);
                    }}
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
                {filter === "Pinned" && !query
                  ? "Nothing pinned here yet."
                  : "No matching clips."}
                <small>
                  {filter === "Pinned" && !query
                    ? "Pin a clip from All to keep it here."
                    : "Try another word, or the name of an app."}
                </small>
              </div>
            )}
          </div>
        </>
      )}
      <div className="demo-footer">
        <span>
          <i className={paused ? "paused" : ""} />
          {paused ? "Capture paused" : "Capturing · On this Mac only"}
          <b>·</b>
          {visible.length === 1 ? "1 item" : `${visible.length} items`}
        </span>
        <span
          role="status"
          aria-live="polite"
          className={copiedID !== null && !copyFailed ? "copied" : ""}
        >
          {copyFailed
            ? "This browser blocked copying."
            : copiedID !== null
              ? "Copied · ⌘V to paste"
              : "↑↓ select  ↵ copy"}
        </span>
      </div>
    </div>
  );
}
