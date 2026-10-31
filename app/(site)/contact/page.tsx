import CorrespondencePage from "@/components/site/CorrespondencePage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact the Foundation",
  description:
    "Reach the public correspondence desk for questions, partnerships, classroom requests, media enquiries and fact-check requests.",
  path: "/contact",
  keywords: ["contact paper foundation india", "paper foundation enquiry"],
});

export default function ContactPage() {
  return <CorrespondencePage mode="contact" />;
}
