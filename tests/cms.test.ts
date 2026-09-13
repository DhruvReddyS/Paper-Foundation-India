import assert from "node:assert/strict";
import test from "node:test";
import { articleSchema } from "../lib/validators/article";
import { inquirySchema } from "../lib/validators/inquiry";
import { mythSchema } from "../lib/validators/myth";
import { renderCampaignHtml, unsubscribeToken } from "../lib/gmail";
import { validDocumentId } from "../lib/validators/id";

test("article publishing input accepts a complete record", () => {
  const result = articleSchema.safeParse({ title: "A production-ready article", slug: "production-ready-article", category: "Method", format: "Core lesson", excerpt: "A sufficiently detailed article summary for readers.", body: "Complete body", status: "published", featured: false, order: 0 });
  assert.equal(result.success, true);
});

test("article publishing input rejects unsafe slugs", () => {
  assert.equal(articleSchema.safeParse({ title: "A production-ready article", slug: "../Admin Route", category: "Method", excerpt: "A sufficiently detailed article summary for readers." }).success, false);
});

test("myth and inquiry payloads enforce editorial bounds", () => {
  assert.equal(mythSchema.safeParse({ claim: "This is a specific public claim", verdict: "context", correction: "This is a specific correction", explanation: "This explanation provides sufficient context for an editorial record.", category: "General" }).success, true);
  assert.equal(inquirySchema.safeParse({ type: "Contact", name: "A", email: "not-an-email", subject: "Help", message: "Too short" }).success, false);
});

test("campaign HTML escapes editor content and personalizes safely", () => {
  const html = renderCampaignHtml("Hello {{name}},\n\n<script>alert(1)</script>", "Reader", "Preview", "https://example.org/unsubscribe");
  assert.match(html, /Hello Reader/);
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;script&gt;/);
});

test("unsubscribe tokens are normalized by email case", () => {
  process.env.NEXTAUTH_SECRET = "a-production-length-secret-used-for-the-test";
  assert.equal(unsubscribeToken("Reader@Example.org"), unsubscribeToken("reader@example.org"));
});

test("CMS mutations reject malformed database identifiers", () => {
  assert.equal(validDocumentId("not-an-object-id"), false);
  assert.equal(validDocumentId("507f1f77bcf86cd799439011"), true);
});
