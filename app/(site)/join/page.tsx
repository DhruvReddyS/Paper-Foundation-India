import InitiativeForm from "@/components/home/sections/initiative-form/InitiativeForm";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Join the Foundation | Membership application",
  description:
    "Complete the official Paper Foundation India membership application online, or download the signed PDF form.",
  path: "/join",
  keywords: ["paper foundation india membership", "join paper foundation"],
});
export default function Page(){return <InitiativeForm/>}
