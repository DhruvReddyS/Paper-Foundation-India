import crypto from "node:crypto";

const sender = () => process.env.GMAIL_SENDER_EMAIL ?? "";
const clientId = () => process.env.GMAIL_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || "";
const clientSecret = () => process.env.GMAIL_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET || "";

export function gmailConfigured() {
  return Boolean(sender() && clientId() && clientSecret() && process.env.GMAIL_REFRESH_TOKEN);
}

function safeHeader(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function base64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[character]!));
}

export function renderCampaignHtml(body: string, name: string, previewText: string, unsubscribeUrl: string) {
  const personalized = body.replace(/\{\{name\}\}/g, name || "there");
  const paragraphs = personalized.split(/\n{2,}/).map(paragraph => `<p style="margin:0 0 20px;font-size:16px;line-height:1.75;color:#354139">${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`).join("");
  return `<!doctype html><html><body style="margin:0;background:#f2eee5;font-family:Arial,sans-serif"><div style="display:none;max-height:0;overflow:hidden">${escapeHtml(previewText)}</div><table width="100%" role="presentation" cellspacing="0" cellpadding="0" style="background:#f2eee5"><tr><td align="center" style="padding:32px 16px"><table width="620" role="presentation" cellspacing="0" cellpadding="0" style="max-width:620px;width:100%;background:#fff"><tr><td style="padding:28px 36px;background:#173b29;color:#fff"><strong style="font-family:Georgia,serif;font-size:22px">Paper Foundation India</strong><div style="margin-top:6px;color:#d9b37f;font-size:11px;letter-spacing:1.5px">EVIDENCE · FIBRE · PUBLIC UNDERSTANDING</div></td></tr><tr><td style="padding:38px 36px">${paragraphs}</td></tr><tr><td style="padding:22px 36px;background:#eee8dc;color:#6e756f;font-size:11px;line-height:1.6">You received this because you subscribed to Paper Foundation India updates.<br><a href="${unsubscribeUrl}" style="color:#315e40">Unsubscribe from future emails</a></td></tr></table></td></tr></table></body></html>`;
}

async function accessToken() {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId(),
      client_secret: clientSecret(),
      refresh_token: process.env.GMAIL_REFRESH_TOKEN ?? "",
      grant_type: "refresh_token",
    }),
  });
  const result = await response.json();
  if (!response.ok || !result.access_token) throw new Error(result.error_description || "Could not refresh Gmail access");
  return String(result.access_token);
}

export function unsubscribeToken(email: string) {
  return crypto.createHmac("sha256", process.env.NEXTAUTH_SECRET || "development-only").update(email.toLowerCase()).digest("hex");
}

export async function sendGmail({ to, name, subject, previewText, body }: { to: string; name: string; subject: string; previewText: string; body: string }) {
  if (!gmailConfigured()) throw new Error("Gmail sending is not configured");
  const origin = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
  const unsubscribeUrl = `${origin}/unsubscribe?email=${encodeURIComponent(to)}&token=${unsubscribeToken(to)}`;
  const html = renderCampaignHtml(body, name, previewText, unsubscribeUrl);
  const boundary = `pfi_${crypto.randomBytes(12).toString("hex")}`;
  const raw = [
    `From: Paper Foundation India <${safeHeader(sender())}>`,
    `To: ${safeHeader(to)}`,
    `Subject: ${safeHeader(subject)}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=UTF-8",
    "",
    body.replace(/\{\{name\}\}/g, name || "there"),
    "",
    `Unsubscribe: ${unsubscribeUrl}`,
    `--${boundary}`,
    "Content-Type: text/html; charset=UTF-8",
    "",
    html,
    `--${boundary}--`,
  ].join("\r\n");
  const token = await accessToken();
  const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ raw: base64Url(raw) }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error?.message || "Gmail rejected the message");
  return result;
}
