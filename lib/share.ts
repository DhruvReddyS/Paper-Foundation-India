/**
 * Sharing targets and captions.
 *
 * Each network reads a post differently, so one caption cannot serve them all:
 * X counts characters, LinkedIn rewards a full sentence, Instagram cannot carry
 * a clickable link at all. The caption is therefore written per network rather
 * than copied, and the pure functions here are unit tested.
 */

export type SharePlatform =
  | "whatsapp"
  | "linkedin"
  | "x"
  | "facebook"
  | "instagram"
  | "telegram"
  | "reddit"
  | "email";

export type ShareSubject = {
  /** Headline of the thing being shared. */
  title: string;
  /** One sentence a reader would want to see in the post. */
  summary: string;
  /** Absolute URL. */
  url: string;
  /** Short topical tags, without the hash. */
  tags?: string[];
  /** Set for a game result so captions can invite a reply. */
  scoreLine?: string;
};

export const X_LIMIT = 280;
/** X counts every link as 23 characters regardless of real length. */
const X_LINK_WEIGHT = 23;

const BRAND_TAGS = ["PaperFoundationIndia", "PaperFacts"];

function hashtags(tags: string[], limit: number) {
  return tags
    .slice(0, limit)
    .map((tag) => `#${tag.replace(/[^A-Za-z0-9]/g, "")}`)
    .filter((tag) => tag.length > 1)
    .join(" ");
}

/**
 * Trims to a whole word and appends a single ellipsis character, so a caption
 * never ends mid-word or breaks a platform's counter.
 */
export function truncateAtWord(text: string, max: number) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

export function captionFor(platform: SharePlatform, subject: ShareSubject): string {
  const tags = [...(subject.tags ?? []), ...BRAND_TAGS];
  const lead = subject.scoreLine ?? subject.summary;

  switch (platform) {
    case "linkedin":
      // Room for a real paragraph, and the audience is professional.
      return [
        lead,
        "",
        subject.scoreLine ? subject.summary : "",
        "",
        `Read it here: ${subject.url}`,
        "",
        hashtags(tags, 5),
      ]
        .filter((line, index, all) => line !== "" || all[index - 1] !== "")
        .join("\n")
        .trim();

    case "x": {
      // The link and a trailing space are counted before the text is trimmed.
      const tagLine = hashtags(tags, 2);
      const budget = X_LIMIT - X_LINK_WEIGHT - tagLine.length - 3;
      return `${truncateAtWord(lead, Math.max(40, budget))}\n\n${subject.url} ${tagLine}`.trim();
    }

    case "whatsapp":
      // Read on a phone, usually forwarded to one person.
      return `${lead}\n\n${subject.url}`;

    case "telegram":
      return lead;

    case "facebook":
      // Facebook ignores prefilled text and renders the page's Open Graph card,
      // so the caption is only used for the copy-to-clipboard fallback.
      return `${lead}\n\n${subject.url}`;

    case "instagram":
      // No clickable link in a caption, so the post must say where to go.
      return [
        lead,
        "",
        subject.summary !== lead ? subject.summary : "",
        "",
        "Link in bio: paperfoundation.in",
        "",
        hashtags(tags, 8),
      ]
        .filter((line, index, all) => line !== "" || all[index - 1] !== "")
        .join("\n")
        .trim();

    case "reddit":
      return subject.title;

    case "email":
      return `${lead}\n\n${subject.url}\n\nPaper Foundation India`;
  }
}

/**
 * The URL that opens the network's composer. Instagram has no web composer,
 * so it returns null and the caller falls back to save-image-and-copy.
 */
export function shareHref(platform: SharePlatform, subject: ShareSubject): string | null {
  const caption = captionFor(platform, subject);
  const encodedUrl = encodeURIComponent(subject.url);

  switch (platform) {
    case "whatsapp":
      return `https://wa.me/?text=${encodeURIComponent(caption)}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case "x":
      return `https://x.com/intent/post?text=${encodeURIComponent(
        caption.replace(subject.url, "").trim()
      )}&url=${encodedUrl}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "telegram":
      return `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(caption)}`;
    case "reddit":
      return `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodeURIComponent(subject.title)}`;
    case "email":
      return `mailto:?subject=${encodeURIComponent(subject.title)}&body=${encodeURIComponent(caption)}`;
    case "instagram":
      return null;
  }
}

export const SHARE_PLATFORMS: { id: SharePlatform; label: string }[] = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "instagram", label: "Instagram" },
  { id: "x", label: "X" },
  { id: "facebook", label: "Facebook" },
  { id: "telegram", label: "Telegram" },
  { id: "reddit", label: "Reddit" },
  { id: "email", label: "Email" },
];
