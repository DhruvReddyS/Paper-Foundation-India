import FeaturedArticlesExperience from "@/components/editorial/FeaturedArticlesExperience";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Featured Articles | Long-form reading room",
  description:
    "The Foundation's long-form editorial stories about paper, fibre, recovery and responsible material systems.",
  path: "/knowledge/featured",
  keywords: ["long form paper articles", "paper essays"],
});

export default function FeaturedArticlesPage() {
  return <FeaturedArticlesExperience />;
}
