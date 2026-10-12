"use client";

import { Check, Terminal } from "lucide-react";
import { useState } from "react";
import { copyText } from "@/components/copy-block";

export default function CopyPromptButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!(await copyText(text))) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <p className="agent-install">
      <Terminal size={14} aria-hidden />
      Installing with Claude Code or Codex?{" "}
      <button type="button" onClick={copy}>
        {copied ? (
          <>
            <Check size={13} aria-hidden /> Prompt copied
          </>
        ) : (
          "Copy install prompt"
        )}
      </button>
      <a href="#install">See it</a>
    </p>
  );
}
