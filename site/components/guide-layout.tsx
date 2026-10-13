import Link from "next/link";
import type { ReactNode } from "react";
import DownloadCta from "@/components/download-cta";
import SiteFooter from "@/components/site-footer";
import SiteNav from "@/components/site-nav";
import { type Guide, findGuide } from "@/lib/guides";
import { siteUrl } from "@/lib/site";

export default function GuideLayout({ guide, children }: { guide: Guide; children: ReactNode }) {
  const url = `${siteUrl}/guides/${guide.slug}`;
  const related = guide.related.map(findGuide).filter((item) => item !== undefined);
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.description,
      url,
      datePublished: guide.published,
      dateModified: guide.published,
      author: { "@type": "Person", name: "Corey Haines" },
      image: `${siteUrl}/opengraph-image`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: guide.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Guides", item: `${siteUrl}/guides` },
        { "@type": "ListItem", position: 2, name: guide.h1, item: url },
      ],
    },
  ];

  return (
    <>
      <SiteNav />
      <main className="document article wrap">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
        <Link className="back" href="/guides">
          ← Mac clipboard guides
        </Link>
        <h1>{guide.h1}</h1>
        {children}

        <h2>Questions</h2>
        {guide.faqs.map((faq) => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}

        <h2>More Mac clipboard guides</h2>
        <ul>
          {related.map((item) => (
            <li key={item.slug}>
              <Link href={`/guides/${item.slug}`}>{item.h1}</Link>
            </li>
          ))}
          <li>
            <Link href="/mac-clipboard-history">How to see clipboard history on Mac</Link>
          </li>
        </ul>

        <DownloadCta
          title="Keep everything you copy."
          body="On Hand is a free, open-source clipboard manager for macOS 14 and later. History stays on your Mac."
        />
      </main>
      <SiteFooter />
    </>
  );
}
