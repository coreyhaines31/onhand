import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import GuideLayout from "@/components/guide-layout";
import CopyFromIphoneToMac from "@/components/guides/copy-from-iphone-to-mac";
import PasteWithoutFormattingMac from "@/components/guides/paste-without-formatting-mac";
import ScreenshotToClipboardMac from "@/components/guides/screenshot-to-clipboard-mac";
import { findGuide, guides } from "@/lib/guides";

type Props = { params: Promise<{ slug: string }> };

const content: Record<string, ComponentType> = {
  "paste-without-formatting-mac": PasteWithoutFormattingMac,
  "copy-from-iphone-to-mac": CopyFromIphoneToMac,
  "screenshot-to-clipboard-mac": ScreenshotToClipboardMac,
};

export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = findGuide((await params).slug);
  if (!guide) return {};
  const url = `/guides/${guide.slug}`;
  return {
    title: { absolute: guide.title },
    description: guide.description,
    alternates: { canonical: url },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url,
      type: "article",
      images: "/opengraph-image",
    },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = findGuide(slug);
  const Content = content[slug];
  if (!guide || !Content) notFound();
  return (
    <GuideLayout guide={guide}>
      <Content />
    </GuideLayout>
  );
}
