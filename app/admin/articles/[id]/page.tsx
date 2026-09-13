import { redirect } from "next/navigation";

export default async function AdminArticleEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/admin/articles?edit=${encodeURIComponent(id)}`);
}
