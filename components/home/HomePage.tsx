import EvidenceDesk from "@/components/home/sections/evidence-desk/EvidenceDesk";
import FieldNotes from "@/components/home/sections/field-notes/FieldNotes";
import IndiaLedger from "@/components/home/sections/india-ledger/IndiaLedger";
import JoinTheFold from "@/components/home/sections/join-the-fold/JoinTheFold";
import JourneyPreview from "@/components/home/sections/journey-preview/JourneyPreview";
import LivingCover from "@/components/home/sections/living-cover/LivingCover";
import PaperEverywhere from "@/components/home/sections/paper-everywhere/PaperEverywhere";
import PlayableEdition from "@/components/home/sections/playable-edition/PlayableEdition";
import Reconsidered from "@/components/home/sections/reconsidered/Reconsidered";

export default function HomePage() {
  return (
    <div>
      <LivingCover />
      <Reconsidered />
      <EvidenceDesk />
      <PlayableEdition />
      <IndiaLedger />
      <JourneyPreview />
      <FieldNotes />
      <PaperEverywhere />
      <JoinTheFold />
    </div>
  );
}
