import { sourceUrl } from "@/lib/site";

// Every release publishes a version-less OnHand.zip, so GitHub's latest-release URL is always current.
export function GET() {
  return Response.redirect(`${sourceUrl}/releases/latest/download/OnHand.zip`, 302);
}
