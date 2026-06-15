import SearchBar from "./sections/SearchBar";
import SearchSuggestions from "./sections/SearchSuggestions";
import SearchResults from "./sections/SearchResults";

export const metadata = {
  title: "Search | Paper Foundation India",
  description: "Search across articles, myths, resources, and glossary terms.",
};

export default function SearchPage() {
  return (
    <main>
      <SearchBar />
      <SearchSuggestions />
      <SearchResults />
    </main>
  );
}
