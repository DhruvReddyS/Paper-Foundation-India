import PressReleases from "./sections/PressReleases";
import MediaCoverage from "./sections/MediaCoverage";
import Spokesperson from "./sections/Spokesperson";
import BrandKit from "./sections/BrandKit";
import MediaContactForm from "./sections/MediaContactForm";

export const metadata = {
  title: "Newsroom | Paper Foundation India",
  description:
    "Press releases, media coverage, brand assets, and media contact information.",
};

export default function NewsroomPage() {
  return (
    <main>
      <PressReleases />
      <MediaCoverage />
      <Spokesperson />
      <BrandKit />
      <MediaContactForm />
    </main>
  );
}
