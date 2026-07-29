import UnsubscribePanel from "@/components/site/UnsubscribePanel";

export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<{ email?: string; token?: string }> }) {
  const { email = "", token = "" } = await searchParams;
  return <UnsubscribePanel email={email} token={token} />;
}
