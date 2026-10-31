import IndiaFibreAtlas from "@/components/editorial/IndiaFibreAtlas";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "India Fibre Atlas | Mills, demand and recovery by state",
  description:
    "An interactive atlas of India's paper landscape: where mills cluster, which states drive demand, and how recovered fibre moves across the country.",
  path: "/india-map",
  keywords: ["India paper mills", "fibre atlas India", "paper industry map India", "state paper demand"],
});

export default function IndiaMapPage() {
  return <IndiaFibreAtlas />;
}
