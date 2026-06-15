import InvolvementForm from "./sections/InvolvementForm";
import PartnerLogos from "./sections/PartnerLogos";
import ShareToolkit from "./sections/ShareToolkit";

export const metadata = {
  title: "Get Involved | Paper Foundation India",
  description:
    "Volunteer, partner, donate, or spread the word — join the paper sustainability movement.",
};

export default function GetInvolvedPage() {
  return (
    <main>
      <InvolvementForm />
      <PartnerLogos />
      <ShareToolkit />
    </main>
  );
}
