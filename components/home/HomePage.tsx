import IndiaLedger from "@/components/home/sections/india-ledger/IndiaLedger";
import CommunityDesk from "@/components/home/sections/community-desk/CommunityDesk";
import HomeReveal from "@/components/home/HomeReveal";
import JourneyPreview from "@/components/home/sections/journey-preview/JourneyPreview";
import KnowledgeHub from "@/components/home/sections/knowledge-hub/KnowledgeHub";
import LivingCover from "@/components/home/sections/living-cover/LivingCover";
import MythsFairly from "@/components/home/sections/myths-fairly/MythsFairly";
import PlayableEdition from "@/components/home/sections/playable-edition/PlayableEdition";

export default function HomePage() {
  return (
    <div className="home-shell">
      <HomeReveal />
      <LivingCover />
      <MythsFairly />
      <KnowledgeHub />
      <JourneyPreview />
      <PlayableEdition />
      <IndiaLedger />
      <CommunityDesk />
    </div>
  );
}
