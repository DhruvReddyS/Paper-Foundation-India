import HomeLanding from "@/components/home/HomePage";
import StructuredData from "@/components/site/StructuredData";
import { organizationSchema, pageMetadata, websiteSchema } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Paper Foundation India | Paper, read as evidence",
  description:
    "An Indian public-interest foundation testing paper claims against sources: myths and facts, long-form knowledge, the fibre atlas, and five short games about how paper is actually made and recovered.",
  path: "/",
  absoluteTitle: true,
  keywords: [
    "paper foundation india",
    "paper myths and facts",
    "paper recycling India",
    "recovered fibre",
    "sustainable paper",
  ],
});

export default function HomePage() {
  return (
    <>
      <StructuredData schema={[organizationSchema(), websiteSchema()]} />
      <HomeLanding />
    </>
  );
}
