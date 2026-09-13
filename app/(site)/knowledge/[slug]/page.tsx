import { ArrowLeft, ArrowRight, Clock, Quote, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articleCatalog, articleCoverImage, type ArticleCatalogItem } from "@/content/articleCatalog";
import { connectDB } from "@/lib/db";
import { Article } from "@/lib/models/Article";

const categoryNotes: Record<ArticleCatalogItem["category"], { lens: string; evidence: string; question: string }> = {
  Forestry: { lens: "landscape, traceability and management", evidence: "Look for geography, fibre origin, land-use context and the scope of any certification claim.", question: "What evidence connects this fibre to the landscape that produced it?" },
  Recovery: { lens: "collection, quality and fibre yield", evidence: "Separate collection rate from usable mill yield, and check contamination, grade and final application.", question: "How much clean fibre returns, and what prevents the rest from returning?" },
  Method: { lens: "boundaries, assumptions and comparison", evidence: "Name the product, geography, time period, functional unit and end-of-life route before comparing outcomes.", question: "What does this conclusion include, and what has it left outside the frame?" },
  Production: { lens: "process, performance and mill decisions", evidence: "Inspect fibre preparation, water circuits, energy source, chemistry, drying and the grade being produced.", question: "Which production decision changes the performance of this particular sheet?" },
  Education: { lens: "behaviour, systems and measurable practice", evidence: "Pair awareness with purchasing rules, full use, clean separation, a collection partner and visible measurement.", question: "What can a school change, measure and keep working over time?" },
  Use: { lens: "purpose, service life and responsible choice", evidence: "Start with fitness for purpose, avoid unnecessary material, use the product fully and follow the local recovery route.", question: "How can this sheet perform its job fully before it leaves our hands?" },
};

const readingTools: Record<ArticleCatalogItem["category"], Array<{ label: string; title: string; body: string }>> = {
  Forestry: [
    { label: "Landscape check", title: "Ask where the fibre grew.", body: "Country names are too broad. Look for the forest or farm region, the management system, the species mix and the years covered by the evidence." },
    { label: "Traceability check", title: "Follow the chain of custody.", body: "A responsible claim should connect the finished paper to documented fibre inputs. Certification can support this trail, but it does not replace local land and biodiversity context." },
    { label: "Time check", title: "Separate harvest from permanent loss.", body: "Tree removal, regrowth and land conversion describe different events. The evidence should show which event occurred and what happened to the land afterwards." },
    { label: "Decision check", title: "Reward visible sourcing.", body: "Choose suppliers that can identify fibre origin, management controls and improvement work. A vague green statement is not the same as an inspectable sourcing record." },
  ],
  Recovery: [
    { label: "Bin check", title: "Clean fibre begins at disposal.", body: "Dry paper kept separate from food, liquid and mixed waste has a better chance of reaching a useful grade. Collection design often matters more than the symbol printed on the pack." },
    { label: "Yield check", title: "Collected is not the same as recycled.", body: "Sorting, moisture, non-paper components and fibre damage reduce usable mill yield. A credible rate states exactly which stage was measured." },
    { label: "Grade check", title: "Different papers take different routes.", body: "Corrugated boxes, office paper, newspapers and coated packs are not interchangeable feedstock. Mills buy grades that match a product recipe." },
    { label: "Local check", title: "Name the real recovery system.", body: "A technically recyclable item may still lack a practical route nearby. Honest guidance connects product design to the collector, aggregator and mill that can handle it." },
  ],
  Method: [
    { label: "Question check", title: "Compare a service, not a material name.", body: "Define the job first. A bag, book, tissue and transport pack solve different problems, so one headline cannot judge them with one boundary." },
    { label: "Boundary check", title: "Write down what is included.", body: "Geography, product life, energy supply, transport, reuse and end of life can change a result. Missing boundaries are often the source of false certainty." },
    { label: "Source check", title: "Find the method behind the number.", body: "Prefer dated, attributable evidence that explains data collection and assumptions. A precise number without a method is still an unsupported claim." },
    { label: "Use check", title: "Turn the conclusion into a choice.", body: "The strongest reading ends with an action: use less unnecessary material, choose fit for purpose, protect the product, and recover clean fibre where a route exists." },
  ],
  Production: [
    { label: "Furnish check", title: "Start with the fibre recipe.", body: "Fibre length, source, recovered content and preparation influence strength, formation and surface. The same machine can make very different grades from different furnish." },
    { label: "Water check", title: "Track circulation, not only intake.", body: "Water carries fibre through the forming process. Meaningful performance data distinguishes fresh intake, recirculated flow, treated discharge and the grade being produced." },
    { label: "Energy check", title: "Drying changes the picture.", body: "Removing water from the web requires substantial heat. Fuel, electricity source, heat recovery and machine efficiency belong inside any manufacturing comparison." },
    { label: "Quality check", title: "Performance prevents hidden waste.", body: "A lighter sheet is not automatically better if it fails in use. Good production balances mass, strength, printability, safety and recovery compatibility." },
  ],
  Education: [
    { label: "Baseline check", title: "Measure before announcing a goal.", body: "Count purchasing, printing, classroom use and discarded grades. A baseline makes progress visible and prevents a campaign from relying only on intention." },
    { label: "Use check", title: "Keep the useful sheet in service.", body: "Duplex printing, scrap trays, repair and shared resources extend value before recycling. The right habit depends on the paper and the learning task." },
    { label: "Collection check", title: "Make correct disposal obvious.", body: "Place clearly labelled paper collection where the material is used. Train staff, students and vendors on contamination and agree on accepted grades with the collector." },
    { label: "Review check", title: "Publish what changed.", body: "Track purchases avoided, sheets used on both sides, clean paper collected and rejected loads. A short public review makes the programme teachable and durable." },
  ],
  Use: [
    { label: "Purpose check", title: "Choose for the actual job.", body: "Specify contact, strength, print, barrier, hygiene and storage needs before choosing a grade. Extra material that adds no useful performance is avoidable." },
    { label: "Life check", title: "Use every useful surface and cycle.", body: "Reuse, refill, repair and double-sided use can extend service life. The best option depends on safety and whether the product remains fit for its purpose." },
    { label: "Claim check", title: "Keep labels specific.", body: "Recycled content, responsible sourcing, recyclability and compostability describe different properties. Each needs its own evidence and local disposal instruction." },
    { label: "Exit check", title: "Prepare clean fibre for its next route.", body: "Remove food, liquid and avoidable non-paper parts where guidance allows. Keep the paper dry and follow the grade accepted by the local collection partner." },
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await findArticle(slug);
  return article ? { title: article.title, description: article.summary } : { title: "Article not found" };
}

const newArticleAngles: Record<string, string[]> = {
  "paper-isnt-the-problem-waste-is": ["Waste begins with a system decision", "Sourcing and use belong in the same account", "Recovery depends on clean routes", "A better question creates a better choice"],
  "why-paper-can-be-sustainable": ["Renewable does not mean impact free", "Performance can prevent material loss", "Recovery preserves invested fibre", "Evidence makes sustainability specific"],
  "every-sheet-deserves-a-second-life": ["Use the first life completely", "Keep the sheet clean and dry", "Collection preserves grade value", "Fresh fibre keeps the loop useful"],
  "forests-grow-because-they-are-managed": ["Name the landscape", "Distinguish harvest from conversion", "Management needs a long time horizon", "Traceability makes the claim inspectable"],
  "recycling-paper-giving-fibres-another-chance": ["The used sheet becomes a furnish", "Screens and cleaners protect the recipe", "Fibre quality changes with each cycle", "Losses show where design can improve"],
  "paper-vs-plastic-beyond-headlines": ["Compare a defined service", "Geography changes energy and recovery", "Product protection belongs in the boundary", "No material wins every use"],
  "circular-journey-of-a-sheet": ["Collection begins the return journey", "Sorting gives the fibre a grade", "Repulping separates fibre from additions", "The next product completes the useful cycle"],
  "responsible-paper-use-supports-forestry": ["Demand can reward traceable supply", "Farm forestry is a managed production system", "Certification supports but does not replace context", "Buy less wastefully and more visibly"],
  "zero-paper-waste-campuses": ["Build a baseline before a target", "Reduce waste without reducing learning", "Design clean collection into the timetable", "Measure what the collector accepts"],
  "after-the-paper-bin": ["A collector sees material, not a symbol", "Aggregation makes transport practical", "Grades protect mill performance", "Rejected loads reveal system gaps"],
  "not-every-paper-recycles-the-same": ["Paper grades carry different fibre", "Coatings and food change the route", "Local mills set real acceptance", "Clear labels prevent wishful recycling"],
  "science-behind-paper-recycling": ["Water releases the fibre network", "Screens remove large contaminants", "Cleaning and deinking refine the stock", "Short fibres and rejects remain visible"],
  "cardboard-unsung-recycling-hero": ["Corrugated board carries strong fibre", "Flattening helps collection work", "Dry storage protects grade value", "Old boxes become new packaging furnish"],
  "recycled-paper-all-around-you": ["Recovered fibre rarely announces itself", "Product requirements shape recycled content", "Colour and texture are not quality verdicts", "Specification can create stable demand"],
  "can-we-go-completely-paperless": ["Digital systems also need material infrastructure", "Paper remains essential in specific services", "Substitution must compare equal functions", "The useful goal is less avoidable waste"],
  "why-using-both-sides-matters": ["A blank reverse is unused service life", "Duplex habits need practical defaults", "Scrap paper can carry a second task", "Clean used sheets still need recovery"],
  "sustainable-forestry-makes-paper-renewable": ["Renewability begins with continued land use", "Regeneration must be observed", "Biodiversity needs a landscape view", "Traceable purchasing sends a signal"],
  "tree-to-notebook-to-new-notebook": ["Fibre begins in a managed source", "Pulp becomes a controlled furnish", "A notebook earns value through use", "Collection can start the next notebook"],
  "smart-paper-choices-homes-offices": ["Specify the real need", "Remove default waste", "Reuse before discarding", "Keep collection simple and dry"],
  "future-of-paper-circular-economy": ["Design decides what can return", "Collection needs dependable economics", "Producer responsibility can change specifications", "Transparent data keeps the loop honest"],
  "fibre-isnt-one-thing": ["Name the fibre before judging it", "Performance begins with fibre length and preparation", "A diverse basket needs visible sourcing", "Choose evidence that fits the route"],
  "clean-separation-protects-fibre": ["The recycling decision begins at disposal", "Water and food residue reduce usable yield", "Grades are separated for a reason", "Design the collection habit, not only the bin"],
  "bagasse-agricultural-residue-paper": ["Residues can become industrial fibre", "Seasonality changes storage and supply", "Silica and preparation affect the mill", "Use non-wood fibre where it genuinely fits"],
  "what-paper-grammage-means": ["GSM is mass, not a quality score", "Bulk and thickness are separate properties", "Strength comes from furnish and formation", "Specify the job before specifying the number"],
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
  const tools = readingTools[item.category] ?? readingTools.Method;
  return angles.map((heading, index) => ({
    heading,
    paragraphs: [
      `${index === 0 ? item.summary : `${heading} changes how the question should be framed.`} Start with the product and the service it must provide. Fibre furnish, mill practice, converting choices, duration of use and the available route after use all shape the result. Treating paper as one uniform material hides the decisions that matter most.`,
      `${tools[index].body} A useful account separates observation from assumption and identifies the point in the system where a choice can improve the outcome. It also avoids turning a single percentage, certification mark or laboratory property into a verdict about every paper product.`,
      `For an Indian reader, the route may include recovered paper traders, farm-grown wood, agricultural residues, mills of very different scales and local collection markets. The conclusion should therefore name its geography and grade. Where evidence is incomplete, the honest response is to mark the gap, keep the claim narrow and state what information would change the decision.`,
    ],
  }));
}

type ReaderItem = ArticleCatalogItem & { body?: string; coverImage?: string };
type CmsArticle = {
  order?: number;
  slug: string;
  title: string;
  category: string;
  format: string;
  featured?: boolean;
  readingMinutes?: number;
  excerpt: string;
  body?: string;
  coverImage?: string;
};

async function findArticle(slug: string): Promise<ReaderItem | undefined> {
  if (process.env.MONGODB_URI) {
    try {
      await connectDB();
      const dbItem = await Article.findOne({ slug, status: "published", deletedAt: null }).lean() as CmsArticle | null;
      if (dbItem) return {
        id: Number(dbItem.order ?? 0) + 1,
        slug: dbItem.slug,
        title: dbItem.title,
        category: dbItem.category as ArticleCatalogItem["category"],
        format: dbItem.format as ArticleCatalogItem["format"],
        featured: Boolean(dbItem.featured),
        time: `${dbItem.readingMinutes ?? 7} min`,
        summary: dbItem.excerpt,
        sourceFile: "",
        status: "published",
        body: dbItem.body,
        coverImage: dbItem.coverImage,
      };
    } catch {
      // The editorial manifest keeps public reading available during a database outage.
    }
  }
  return articleCatalog.find(article => article.slug === slug);
}

export default async function ArticleReaderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await findArticle(slug);
  if (!item) notFound();
  const safeCategory = categoryNotes[item.category] ? item.category : "Method";
  const note = categoryNotes[safeCategory];
  const next = articleCatalog[item.id % articleCatalog.length];
  const generated = generatedBody(item);

  return <article className="article-reader">
    <div className="article-progress"><span /></div>
    <header className="article-reader-hero">
      <div className="article-reader-meta"><Link href="/knowledge"><ArrowLeft /> Knowledge hub</Link><span>{item.category} · Source draft {String(item.id).padStart(2, "0")}</span></div>
      <p className="home-micro-label">{item.format} · Reading time {item.time}</p>
      <h1>{item.title}</h1>
      <p className="article-reader-deck">{item.summary}</p>
      <div className="article-byline"><span>Editorial Desk</span><span><Clock /> {item.time} read</span><button type="button"><Share2 /> Share</button></div>
      <div className="article-cover-image"><Image src={item.coverImage || articleCoverImage(item)} alt={`Cover image for ${item.title}`} fill priority sizes="(max-width: 900px) 94vw, 1200px" /><span>FIG. {String(item.id).padStart(2, "0")} · {item.category.toUpperCase()} / CONTEXT / SOURCE</span><strong>Read the claim with its system attached.</strong></div>
    </header>

    <div className="article-reader-layout">
      <aside className="article-toc"><p>On this reading desk</p><a href="#question">01 · The question</a><a href="#article-body">02 · Full article</a><a href="#method">03 · What to inspect</a><a href="#sources">04 · Sources &amp; status</a></aside>
      <article className="article-prose">
        <section id="question"><span>01 · Begin</span><h2>{note.question}</h2><p className="article-dropcap">{item.summary} The useful starting point is not a verdict about a material in isolation, but a clearly bounded question about a real product and system.</p></section>
        <blockquote><Quote /><p>Good paper literacy keeps source, manufacture, purpose and recovery in the same sentence.</p></blockquote>
        <section id="article-body"><span>02 · Full article</span><h2>Read through {note.lens}.</h2>
          {item.body ? <ArticleBody body={item.body} /> : generated.map((section, index) => <div className="article-generated-section" key={section.heading}>
            {index === 2 && <ArticleInterlude number={index} note={readingTools[safeCategory][index - 1]} />}
            <h3>{String(index + 1).padStart(2, "0")} · {section.heading}</h3>
            {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          </div>)}
          <div className="article-field-guide">
            <header><small>Keep beside the article</small><strong>A four-part reading card</strong></header>
            <div>{readingTools[safeCategory].map((tool, index) => <ArticleInterlude key={tool.title} number={index + 1} note={tool} compact />)}</div>
          </div>
          <div className="article-evidence-card"><small>Evidence habit</small><strong>Prefer a named source and visible method over a confident, context-free number.</strong></div>
        </section>
        <section id="method"><span>03 · Inspect</span><h2>Four checks travel with every article.</h2><ol><li><strong>Claim:</strong> What exactly is being asserted?</li><li><strong>Boundary:</strong> Which product, place, time and use are included?</li><li><strong>Source:</strong> Can the evidence and method be inspected?</li><li><strong>Correction:</strong> What would change the conclusion?</li></ol></section>
        <section id="sources"><span>04 · Sources &amp; status</span><h2>{item.status === "published" ? "Sources stay attached to the conclusion." : "This reading remains under editorial review."}</h2><p>{item.status === "published" ? "Named sources, dates and boundaries allow a reader to inspect the evidence and return when new information changes the conclusion." : "The long-form source is being checked for evidence, scope and India-specific context before it is treated as a final public reference."}</p></section>
      </article>
      <aside className="article-side-note"><span>Editorial state</span><strong>{item.status === "published" ? "Published reference." : "Evidence review in progress."}</strong><p>Claims remain open to correction when stronger or newer evidence becomes available.</p></aside>
    </div>

    <footer className="article-reader-next"><p className="home-micro-label">Continue reading</p><Link href={`/knowledge/${next.slug}`}><span>Next desk · {next.category}</span><strong>{next.title}</strong><ArrowRight /></Link></footer>
  </article>;
}

function ArticleBody({ body }: { body: string }) {
  const blocks = body.split(/\n{2,}/).map(block => block.trim()).filter(Boolean);
  return <div className="article-generated-section article-cms-body">{blocks.map((block, index) => {
    if (block.startsWith("### ")) return <h3 key={`${index}-${block}`}>{block.slice(4)}</h3>;
    if (block.startsWith("## ")) return <h2 key={`${index}-${block}`}>{block.slice(3)}</h2>;
    if (block.startsWith("> ")) return <blockquote key={`${index}-${block}`}><Quote /><p>{block.slice(2)}</p></blockquote>;
    const lines = block.split("\n");
    if (lines.every(line => /^[-*] /.test(line))) return <ul key={`${index}-${block}`}>{lines.map(line => <li key={line}>{line.slice(2)}</li>)}</ul>;
    if (lines.every(line => /^\d+\. /.test(line))) return <ol key={`${index}-${block}`}>{lines.map(line => <li key={line}>{line.replace(/^\d+\. /, "")}</li>)}</ol>;
    return <p className={index === 0 ? "article-dropcap" : undefined} key={`${index}-${block}`}>{lines.map((line, lineIndex) => <span key={`${lineIndex}-${line}`}>{line}{lineIndex < lines.length - 1 && <br />}</span>)}</p>;
  })}</div>;
}

function ArticleInterlude({ number, note, compact = false }: { number: number; note: { label: string; title: string; body: string }; compact?: boolean }) {
  return <aside className={`article-interlude ${compact ? "is-compact" : ""}`}>
    <span>{String(number).padStart(2, "0")}</span>
    <div><small>{note.label}</small><strong>{note.title}</strong><p>{note.body}</p></div>
  </aside>;
}
