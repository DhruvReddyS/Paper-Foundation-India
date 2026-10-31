import assert from "node:assert/strict";
import test from "node:test";
import { absoluteUrl, articleSchema, breadcrumbSchema, faqSchema, organizationSchema, pageMetadata } from "../lib/seo";
import { databaseNameFromUri } from "../lib/db";

test("page metadata always carries a canonical, an image and both card formats", () => {
  const meta = pageMetadata({
    title: "Myths vs Facts",
    description: "Sixty paper claims checked against their sources.",
    path: "/myths",
  });
  assert.equal(meta.alternates?.canonical, absoluteUrl("/myths"));
  assert.equal(meta.openGraph?.url, absoluteUrl("/myths"));
  assert.equal((meta.twitter as { card?: string })?.card, "summary_large_image");
  const images = meta.openGraph?.images as { url: string }[];
  assert.ok(images?.[0]?.url.startsWith("http"), "the Open Graph image must be absolute");
});

test("a page can point its canonical at another route", () => {
  const meta = pageMetadata({ title: "Games Lab", description: "Five games.", path: "/games", canonicalPath: "/discover" });
  assert.equal(meta.alternates?.canonical, absoluteUrl("/discover"));
});

test("a noindex page is marked for robots and still resolvable", () => {
  const meta = pageMetadata({ title: "Unsubscribe", description: "Stop email.", path: "/unsubscribe", noIndex: true });
  assert.deepEqual(meta.robots, { index: false, follow: false });
});

test("an absolute title opts out of the brand template so it is not repeated", () => {
  const templated = pageMetadata({ title: "About", description: "d", path: "/about" });
  assert.equal(templated.title, "About");
  const absolute = pageMetadata({ title: "Paper Foundation India | Home", description: "d", path: "/", absoluteTitle: true });
  assert.deepEqual(absolute.title, { absolute: "Paper Foundation India | Home" });
});

test("structured data is valid schema.org and uses absolute URLs", () => {
  const org = organizationSchema();
  assert.equal(org["@context"], "https://schema.org");
  assert.ok(String(org.url).startsWith("http"));

  const crumbs = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Knowledge", path: "/knowledge" },
  ]) as { itemListElement: { position: number; item: string }[] };
  assert.equal(crumbs.itemListElement.length, 2);
  assert.equal(crumbs.itemListElement[0].position, 1);
  assert.ok(crumbs.itemListElement[1].item.startsWith("http"));

  const article = articleSchema({ title: "T", description: "D", path: "/knowledge/t" });
  assert.equal(article["@type"], "Article");
  assert.ok(String((article.mainEntityOfPage as { "@id": string })["@id"]).startsWith("http"));

  const faq = faqSchema([{ question: "Q?", answer: "A." }]) as { mainEntity: unknown[] };
  assert.equal(faq.mainEntity.length, 1);
});

test("a database name is always resolved, so content cannot land in the default test database", () => {
  assert.equal(databaseNameFromUri("mongodb+srv://u:p@cluster.mongodb.net/"), "paperfoundation");
  assert.equal(databaseNameFromUri("mongodb+srv://u:p@cluster.mongodb.net"), "paperfoundation");
  assert.equal(databaseNameFromUri("mongodb+srv://u:p@cluster.mongodb.net/?retryWrites=true"), "paperfoundation");
  assert.equal(databaseNameFromUri("mongodb+srv://u:p@cluster.mongodb.net/pfi_live"), "pfi_live");
  assert.equal(databaseNameFromUri("mongodb+srv://u:p@cluster.mongodb.net/pfi_live?w=majority"), "pfi_live");
});
