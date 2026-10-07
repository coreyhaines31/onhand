import { ArrowDown } from "lucide-react";
import { downloadUrl } from "@/lib/site";

export default function DownloadCta({ title, body }: { title: string; body: string }) {
  return (
    <aside className="cta">
      <div>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
      <a className="button primary" href={downloadUrl}>
        <ArrowDown size={18} />
        Download for free
      </a>
    </aside>
  );
}
