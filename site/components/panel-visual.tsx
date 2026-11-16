import type { CSSProperties, ReactNode } from "react";

export type PanelRow = {
  text: string;
  sub: string;
  shortcut?: string;
  pinned?: boolean;
  selected?: boolean;
  image?: boolean;
  code?: boolean;
};

const tabs = ["All", "Pinned", "Links", "Images", "Sent"];

/** A still of the On Hand panel, built from the Brushed popover parts. Decorative: the copy beside it says what it shows. */
export default function PanelVisual({
  tab = "All",
  query,
  boards,
  rows,
  status = "Capturing · On this Mac only",
  children,
}: {
  tab?: string;
  query?: string;
  boards?: { names: string[]; on: string };
  rows?: PanelRow[];
  status?: string;
  children?: ReactNode;
}) {
  return (
    <div className="bx-mount panel-visual" aria-hidden="true">
      <span className="bx-screw" />
      <span className="bx-screw" />
      <span className="bx-screw" />
      <span className="bx-screw" />
      <div className="pop light" style={{ "--acc": "#b43a9e" } as CSSProperties}>
        <div className="fas">
          <div className="fh">
            <span className="np">
              <i />
              Clips
            </span>
            <span className="tbar">
              <span className="tbi">⏸</span>
              <span className="tbi">⋯</span>
            </span>
          </div>
          <div className="labs">
            <span className="lo">Passwords skipped</span>
            <span className="ls">Clipboard</span>
          </div>
        </div>
        <div style={{ height: 12 }} />
        <div className="field">
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="6" cy="6" r="4.2" />
            <path d="m9.2 9.2 3.3 3.3" />
          </svg>
          {query ? <span className="pv-query">{query}</span> : "Search clipboard history"}
          <span className="kb">⌘F</span>
        </div>
        <div className="tabs">
          {tabs.map((name) => (
            <span key={name} className={name === tab ? "on" : ""}>
              {name}
            </span>
          ))}
        </div>
        {boards && (
          <div className="tabs pv-boards">
            {boards.names.map((name) => (
              <span key={name} className={name === boards.on ? "on" : ""}>
                {name}
              </span>
            ))}
          </div>
        )}
        {children}
        {rows?.map((row) => (
          <div key={row.text} className={`row${row.image ? "" : " noico"}${row.selected ? " sel" : ""}`}>
            {row.image && <span className="thumb" />}
            <span className={`nm${row.code ? " clip" : ""}`}>{row.text}</span>
            <span className="vl">
              <span className="ts">
                {row.shortcut}
                {row.pinned ? " 📌" : ""}
              </span>
            </span>
            <span className="sb">{row.sub}</span>
          </div>
        ))}
        <div className="pf">
          <span>
            <span style={{ color: "var(--go)" }}>●</span> {status}
          </span>
          <span>↑↓ select ↵ copy</span>
        </div>
      </div>
    </div>
  );
}
