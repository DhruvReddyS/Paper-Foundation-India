import assert from "node:assert/strict";
import test from "node:test";
import { captionFor, shareHref, truncateAtWord, X_LIMIT, type ShareSubject } from "../lib/share";

const subject: ShareSubject = {
  title: "Grow or Shred result",
  summary: "A living evidence quiz about paper, fibre and recovery.",
  url: "https://paperfoundation.in/discover/grow-or-shred",
  tags: ["PaperIQ", "Recycling"],
  scoreLine: "I scored 1200/1620 in Grow or Shred and earned “Fibre Thinker”.",
};

test("an X caption stays inside the platform limit, counting the link weight", () => {
  const long: ShareSubject = {
    ...subject,
    scoreLine: "I scored 1200 out of 1620 ".repeat(20),
  };
  const caption = captionFor("x", long);
  // The link is counted as 23 characters by X regardless of its real length.
  const weighted = caption.replace(long.url, "x".repeat(23));
  assert.ok(weighted.length <= X_LIMIT, `caption was ${weighted.length} characters`);
});

test("every caption carries the link, except Instagram which cannot use one", () => {
  // Telegram is excluded: its composer takes the URL as a separate parameter,
  // so a copy inside the text would appear twice in the posted message.
  for (const platform of ["whatsapp", "linkedin", "x", "facebook", "email"] as const) {
    assert.ok(captionFor(platform, subject).includes(subject.url), `${platform} dropped the link`);
  }
  assert.ok(shareHref("telegram", subject)!.includes(encodeURIComponent(subject.url)));
  const instagram = captionFor("instagram", subject);
  assert.ok(!instagram.includes(subject.url), "Instagram caption should not carry an unusable link");
  assert.match(instagram, /Link in bio/);
});

test("hashtags are sanitised and the house tags are always appended", () => {
  const caption = captionFor("linkedin", { ...subject, tags: ["Paper IQ!", "re-cycling"] });
  assert.match(caption, /#PaperIQ/);
  assert.match(caption, /#recycling/);
  assert.match(caption, /#PaperFoundationIndia/);
  assert.ok(!caption.includes("#Paper IQ!"), "a hashtag must not contain punctuation or spaces");
});

test("share targets are built for every platform that has a web composer", () => {
  assert.equal(shareHref("instagram", subject), null);
  for (const platform of ["whatsapp", "linkedin", "x", "facebook", "telegram", "reddit", "email"] as const) {
    const href = shareHref(platform, subject);
    assert.ok(href, `${platform} produced no target`);
    assert.ok(
      href.startsWith("https://") || href.startsWith("mailto:"),
      `${platform} produced an unexpected scheme: ${href}`
    );
    assert.ok(
      href.includes(encodeURIComponent(subject.url)) || platform === "email",
      `${platform} did not encode the shared URL`
    );
  }
});

test("truncation breaks on a word boundary and never exceeds the limit", () => {
  const text = "Recovered fibre keeps the paper loop working across Indian mills";
  const cut = truncateAtWord(text, 30);
  assert.ok(cut.length <= 30, `got ${cut.length}`);
  assert.ok(cut.endsWith("…"));
  assert.ok(!cut.includes("  "));
  assert.equal(truncateAtWord("short", 30), "short");
});
