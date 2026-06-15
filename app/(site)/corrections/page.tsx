import CorrectionsHeader from "./sections/CorrectionsHeader";
import CorrectionsList from "./sections/CorrectionsList";

export const metadata = {
  title: "Corrections & Updates | Paper Foundation India",
  description: "Transparency in action — view all corrections and updates to our published content.",
};

export default function CorrectionsPage() {
  return (
    <main>
      <CorrectionsHeader />
      <CorrectionsList />
    </main>
  );
}
