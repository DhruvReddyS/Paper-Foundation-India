import JourneySaga from "@/components/journey/JourneySaga";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "How Paper Is Made | The Paper Journey",
  description:
    "An interactive storybook tour of paper, from responsible and recovered fibre through pulping, forming, drying, use and return.",
  path: "/journey",
  keywords: ["how paper is made", "papermaking process", "paper journey"],
});

export default function JourneyPage() {
  return <JourneySaga />;
}
