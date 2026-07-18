import { ArrowLeft, ArrowRight, Clock, Quote, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { articleCatalog, articleCoverImage, type ArticleCatalogItem } from "@/content/articleCatalog";

const categoryNotes: Record<ArticleCatalogItem["category"], { lens: string; evidence: string; question: string }> = {
  Forestry: { lens: "landscape, traceability and management", evidence: "Look for geography, fibre origin, land-use context and the scope of any certification claim.", question: "What evidence connects this fibre to the landscape that produced it?" },
  Recovery: { lens: "collection, quality and fibre yield", evidence: "Separate collection rate from usable mill yield, and check contamination, grade and final application.", question: "How much clean fibre returns—and what prevents the rest from returning?" },
  Method: { lens: "boundaries, assumptions and comparison", evidence: "Name the product, geography, time period, functional unit and end-of-life route before comparing outcomes.", question: "What does this conclusion include, and what has it left outside the frame?" },
  Production: { lens: "process, performance and mill decisions", evidence: "Inspect fibre preparation, water circuits, energy source, chemistry, drying and the grade being produced.", question: "Which production decision changes the performance of this particular sheet?" },
  Education: { lens: "behaviour, systems and measurable practice", evidence: "Pair awareness with purchasing rules, full use, clean separation, a collection partner and visible measurement.", question: "What can a school change, measure and keep working over time?" },
  Use: { lens: "purpose, service life and responsible choice", evidence: "Start with fitness for purpose, avoid unnecessary material, use the product fully and follow the local recovery route.", question: "How can this sheet perform its job fully before it leaves our hands?" },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articleCatalog.find(item => item.slug === slug);
  return article ? { title: article.title, description: article.summary } : { title: "Article not found" };
}

const newArticleAngles: Record<string, string[]> = {
  "fibre-isnt-one-thing": ["Name the fibre before judging it", "Performance begins with fibre length and preparation", "A diverse basket needs visible sourcing", "Choose evidence that fits the route"],
  "clean-separation-protects-fibre": ["The recycling decision begins at disposal", "Water and food residue reduce usable yield", "Grades are separated for a reason", "Design the collection habit, not only the bin"],
  "bagasse-agricultural-residue-paper": ["Residues can become industrial fibre", "Seasonality changes storage and supply", "Silica and preparation affect the mill", "Use non-wood fibre where it genuinely fits"],
  "what-paper-grammage-means": ["GSM is mass—not a quality score", "Bulk and thickness are separate properties", "Strength comes from furnish and formation", "Specify the job before specifying the number"],
  "choosing-paper-food-contact": ["Food safety is the first boundary", "Barriers add function and complexity", "Grease, moisture and temperature change the choice", "Local recovery decides the honest end-of-life claim"],
  "epr-paper-packaging-explained": ["Responsibility follows the product", "Targets need a transparent denominator", "Collection is different from recycling", "Good policy reaches the design table"],
  "libraries-extend-book-life": ["Shared use multiplies material value", "Repair is a circular practice", "Storage protects paper from avoidable damage", "The best end-of-life can begin much later"],
  "water-in-paper-mills": ["Water carries fibre to the forming section", "Closed loops reduce intake but require control", "Treatment protects both process and environment", "A single water number needs a product boundary"],
  "coatings-adhesives-recovery": ["Function is added at the converting stage", "Repulpability depends on how layers separate", "Screens remove what fibres cannot carry", "Design and local infrastructure must meet"],
  "credible-paper-claims-checklist": ["Ask what product the claim describes", "Look for fibre origin and percentage", "Separate recycled from recyclable", "Check geography, method and correction date"],
  "india-fibre-basket": ["Recovered paper is a major but uneven stream", "Farm forestry connects mills and growers", "Agricultural residues add regional options", "Imports, quality and logistics complete the picture"],
  "hidden-infrastructure-waste-paper": ["A sheet moves through many hands", "Aggregation creates transport efficiency", "Grading protects mill recipes", "Fair, visible systems improve recovery quality"],
  "paper-carbon-and-time": ["Biogenic carbon still needs careful accounting", "Energy source changes manufacturing results", "Product life and substitution affect the boundary", "One number cannot answer every decision"],
  "designing-packaging-for-circularity": ["Start with the product’s protection need", "Remove unnecessary mass and layers", "Test inks, barriers and adhesives together", "Make disposal instructions locally truthful"],
  "next-indian-paper-mill": ["Flexible fibre preparation widens the basket", "Water loops become measured systems", "Energy and heat integration lower exposure", "Transparent performance builds public trust"],
};

function generatedBody(item: ArticleCatalogItem) {
  const angles = newArticleAngles[item.slug] ?? ["Define the system", "Inspect the material", "Follow the evidence", "Choose the responsible action"];
  return angles.map((heading, index) => ({
    heading,
    paragraphs: [
      `${index === 0 ? item.summary : `${heading} is not a standalone slogan.`} A useful reading begins by naming the product, place, performance requirement and recovery route. Paper is a family of engineered materials, so the answer changes with fibre furnish, mill practice, converting choices and the system available after use.`,
      `${categoryNotes[item.category].evidence} This is why a credible decision records its assumptions and distinguishes what is measured from what is inferred. The practical goal is not to make every sheet identical; it is to match material and process to a real need while keeping avoidable loss visible.`,
    ],
  }));
}

async function sourceBody(item: ArticleCatalogItem) {
  if (!item.sourceFile) return null;
  try {
    return await readFile(path.join(process.cwd(), "content", "articles", `${item.slug}.md`), "utf8");
  } catch {
    return null;
  }
}

function markdownBlocks(markdown: string) {
  return markdown.split(/\n{2,}/).map(block => block.trim()).filter(Boolean);
}

export default async function ArticleReaderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = articleCatalog.find(article => article.slug === slug);
  if (!item) notFound();
  const note = categoryNotes[item.category];
  const next = articleCatalog[item.id % articleCatalog.length];
  const markdown = await sourceBody(item);
  const generated = generatedBody(item);

  return <article className="article-reader">
    <div className="article-progress"><span /></div>
    <header className="article-reader-hero">
      <div className="article-reader-meta"><Link href="/knowledge"><ArrowLeft /> Knowledge hub</Link><span>{item.category} · Source draft {String(item.id).padStart(2, "0")}</span></div>
      <p className="home-micro-label">{item.format} · Reading time {item.time}</p>
      <h1>{item.title}</h1>
      <p className="article-reader-deck">{item.summary}</p>
      <div className="article-byline"><span>Editorial Desk</span><span><Clock /> {item.time} read</span><button type="button"><Share2 /> Share</button></div>
      <div className="article-cover-image"><Image src={articleCoverImage(item)} alt={`Cover image for ${item.title}`} fill priority sizes="(max-width: 900px) 94vw, 1200px" /><span>FIG. {String(item.id).padStart(2, "0")} · {item.category.toUpperCase()} / CONTEXT / SOURCE</span><strong>Read the claim with its system attached.</strong><i /></div>
    </header>

    <div className="article-reader-layout">
      <aside className="article-toc"><p>On this reading desk</p><a href="#question">01 · The question</a><a href="#article-body">02 · Full article</a><a href="#method">03 · What to inspect</a><a href="#sources">04 · Sources &amp; status</a></aside>
      <article className="article-prose">
        <section id="question"><span>01 · Begin</span><h2>{note.question}</h2><p className="article-dropcap">{item.summary} The useful starting point is not a verdict about a material in isolation, but a clearly bounded question about a real product and system.</p></section>
        <blockquote><Quote /><p>Good paper literacy keeps source, manufacture, purpose and recovery in the same sentence.</p></blockquote>
        <section id="article-body"><span>02 · Full article</span><h2>Read through {note.lens}.</h2>
          {markdown ? markdownBlocks(markdown).map((block, index) => {
            const clean = block.replace(/\*\*/g, "");
            if (/^#{2,3}\s/.test(clean)) return <h3 key={index}>{clean.replace(/^#{2,3}\s/, "")}</h3>;
            if (/^[-•]\s/m.test(clean)) return <ul key={index}>{clean.split("\n").map((line, lineIndex) => <li key={lineIndex}>{line.replace(/^[-•]\s*/, "")}</li>)}</ul>;
            return <p key={index}>{clean.replace(/^#\s*/, "")}</p>;
          }) : generated.map((section, index) => <div className="article-generated-section" key={section.heading}><h3>{String(index + 1).padStart(2, "0")} · {section.heading}</h3>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>)}
          <div className="article-evidence-card"><small>Evidence habit</small><strong>Prefer a named source and visible method over a confident, context-free number.</strong></div>
        </section>
        <section id="method"><span>03 · Inspect</span><h2>Four checks travel with every article.</h2><ol><li><strong>Claim:</strong> What exactly is being asserted?</li><li><strong>Boundary:</strong> Which product, place, time and use are included?</li><li><strong>Source:</strong> Can the evidence and method be inspected?</li><li><strong>Correction:</strong> What would change the conclusion?</li></ol></section>
        <section id="sources"><span>04 · Sources &amp; editorial workflow</span><h2>{item.status === "published" ? "Published in the editable knowledge catalogue." : "Source document connected to the CMS review queue."}</h2><p>{item.status === "published" ? "This article is stored in the same content shape used by the CMS: title, cover, summary, body, reading time, sources, status and featured placement can all be replaced by a database record." : "The supplied long-form document is displayed here and remains marked for editorial and source verification. CMS editors can replace the body, cover, metadata and review status without changing the page design."}</p></section>
      </article>
      <aside className="article-side-note"><span>Editorial state</span><strong>Source draft connected.</strong><p>Body copy remains reviewable, replaceable and correctable through the content model.</p></aside>
    </div>

    <footer className="article-reader-next"><p className="home-micro-label">Continue reading</p><Link href={`/knowledge/${next.slug}`}><span>Next desk · {next.category}</span><strong>{next.title}</strong><ArrowRight /></Link></footer>
  </article>;
}
