import IndiaLedger from "@/components/home/sections/india-ledger/IndiaLedger";
import InitiativeForm from "@/components/home/sections/initiative-form/InitiativeForm";
import JourneyPreview from "@/components/home/sections/journey-preview/JourneyPreview";
import KnowledgeHub from "@/components/home/sections/knowledge-hub/KnowledgeHub";
import LivingCover from "@/components/home/sections/living-cover/LivingCover";
import MythsFairly from "@/components/home/sections/myths-fairly/MythsFairly";
import PlayableEdition from "@/components/home/sections/playable-edition/PlayableEdition";

export default function HomePage() {
  return (
    <div>
      <LivingCover />
      <MythsFairly />
      <KnowledgeHub />
      <JourneyPreview />
      <PlayableEdition />
      <IndiaLedger />
      <InitiativeForm />
    </div>
  );
}
