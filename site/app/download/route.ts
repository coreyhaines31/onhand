import { sourceUrl } from "@/lib/site";

export const revalidate = 3600;

type Release = { assets: { name: string; browser_download_url: string }[] };

export async function GET() {
  const fallback = `${sourceUrl}/releases/latest`;
  try {
    const response = await fetch(
      "https://api.github.com/repos/coreyhaines31/onhand/releases/latest",
      { headers: { Accept: "application/vnd.github+json" }, next: { revalidate } },
    );
    if (!response.ok) return Response.redirect(fallback, 302);
    const release = (await response.json()) as Release;
    const asset = release.assets.find((a) => /^OnHand-[\d.]+\.zip$/.test(a.name));
    return Response.redirect(asset?.browser_download_url ?? fallback, 302);
  } catch {
    return Response.redirect(fallback, 302);
  }
}
