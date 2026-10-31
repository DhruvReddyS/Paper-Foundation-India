import UnsubscribePanel from "@/components/site/UnsubscribePanel";
import { pageMetadata } from "@/lib/seo";

// A transactional page reached from an email link. It carries a recipient
// address in the query string and must never be indexed.
export const metadata = pageMetadata({
  title: "Unsubscribe",
  description: "Stop receiving email from Paper Foundation India.",
  path: "/unsubscribe",
  noIndex: true,
});

export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<{ email?: string; token?: string }> }) {
  const { email = "", token = "" } = await searchParams;
  return <UnsubscribePanel email={email} token={token} />;
}
