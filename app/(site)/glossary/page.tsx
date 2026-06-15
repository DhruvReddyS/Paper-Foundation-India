import GlossaryHero from "./sections/GlossaryHero";
import AlphabetNav from "./sections/AlphabetNav";
import GlossaryTermList from "./sections/GlossaryTermList";

export const metadata = {
  title: "Glossary | Paper Foundation India",
  description:
    "A comprehensive A–Z glossary of paper industry and sustainability terminology.",
};

export default function GlossaryPage() {
  return (
    <main>
      <GlossaryHero />
      <AlphabetNav />
      <GlossaryTermList />
    </main>
  );
}
