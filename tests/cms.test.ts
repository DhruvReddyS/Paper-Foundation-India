import assert from "node:assert/strict";
import test from "node:test";
import { articleSchema } from "../lib/validators/article";
import { inquirySchema } from "../lib/validators/inquiry";
import { mythSchema } from "../lib/validators/myth";
import { renderCampaignHtml, unsubscribeToken } from "../lib/gmail";
import { validDocumentId } from "../lib/validators/id";
import { decryptMfaSecret, encryptMfaSecret, generateMfaSecret, generateRecoveryCodes, normalizeRecoveryCode, totpCode, verifyTotp } from "../lib/mfa";
import { publicSubmissionIsSpam } from "../lib/public-submission";
import { validateUploadFile } from "../lib/file-security";

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

test("MFA secrets encrypt at rest and TOTP codes validate only inside the allowed window", () => {
  process.env.NEXTAUTH_SECRET = "a-production-length-secret-used-for-the-test";
  const secret = generateMfaSecret();
  const encrypted = encryptMfaSecret(secret);
  const now = 1_800_000_000_000;
  const code = totpCode(secret, now);
  const wrongCode = code === "000000" ? "000001" : "000000";
  assert.notEqual(encrypted, secret);
  assert.equal(decryptMfaSecret(encrypted), secret);
  assert.equal(verifyTotp(secret, code, now), true);
  assert.equal(verifyTotp(secret, wrongCode, now), false);
});

test("MFA recovery codes are unique and normalize for safe comparison", () => {
  const codes = generateRecoveryCodes();
  assert.equal(codes.length, 8);
  assert.equal(new Set(codes).size, codes.length);
  assert.equal(normalizeRecoveryCode(codes[0].toLowerCase()), codes[0].replace("-", ""));
});

test("public form traps accept normal submissions and quietly detect bots", () => {
  const now = 1_800_000_000_000;
  assert.equal(publicSubmissionIsSpam({ _website: "", formStartedAt: now - 5_000 }, now), false);
  assert.equal(publicSubmissionIsSpam({ _website: "https://spam.invalid", formStartedAt: now - 5_000 }, now), true);
  assert.equal(publicSubmissionIsSpam({ _website: "", formStartedAt: now - 100 }, now), true);
});

test("upload validation checks actual bytes and rejects active PDF content", async () => {
  const safePdf = new File(["%PDF-1.7\n1 0 obj\n<<>>\nendobj"], "safe.pdf", { type: "application/pdf" });
  const disguisedPdf = new File(["not a pdf"], "fake.pdf", { type: "application/pdf" });
  const activePdf = new File(["%PDF-1.7\n/OpenAction 1 0 R"], "active.pdf", { type: "application/pdf" });
  assert.deepEqual(await validateUploadFile(safePdf, ["application/pdf"]), { safe: true });
  assert.equal((await validateUploadFile(disguisedPdf, ["application/pdf"])).safe, false);
  assert.equal((await validateUploadFile(activePdf, ["application/pdf"])).safe, false);
});
