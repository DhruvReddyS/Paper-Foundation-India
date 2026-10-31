import AboutExperience from "@/components/editorial/AboutExperience";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About the Foundation | Mission, method and principles",
  description:
    "Who Paper Foundation India is, how claims are checked before publication, the corrections policy, and the people accountable for the work.",
  path: "/about",
  keywords: ["paper foundation india about", "paper NGO India", "corrections policy"],
});
export default function AboutPage() { return <AboutExperience />; }
