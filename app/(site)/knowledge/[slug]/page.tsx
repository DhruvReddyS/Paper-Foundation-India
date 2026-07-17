import { ArrowLeft, ArrowRight, BookOpen, Clock, Quote, Share2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articleCatalog, type ArticleCatalogItem } from "@/content/articleCatalog";

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

export default async function ArticleReaderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = articleCatalog.find(article => article.slug === slug);
  if (!item) notFound();
  const note = categoryNotes[item.category];
  const next = articleCatalog[item.id % articleCatalog.length];

  return <article className="article-reader">
    <div className="article-progress"><span /></div>
    <header className="article-reader-hero">
      <div className="article-reader-meta"><Link href="/knowledge"><ArrowLeft /> Knowledge hub</Link><span>{item.category} · Source draft {String(item.id).padStart(2, "0")}</span></div>
      <p className="home-micro-label">{item.format} · Reading time {item.time}</p>
      <h1>{item.title}</h1>
      <p className="article-reader-deck">{item.summary}</p>
      <div className="article-byline"><span>Editorial Desk</span><span><Clock /> {item.time} read</span><button type="button"><Share2 /> Share</button></div>
      <div className="article-cover-figure"><BookOpen /><span>FIG. {String(item.id).padStart(2, "0")} · {item.category.toUpperCase()} / CONTEXT / SOURCE</span><strong>Read the claim with its system attached.</strong><i /></div>
    </header>

    <div className="article-reader-layout">
      <aside className="article-toc"><p>On this reading desk</p><a href="#question">01 · The question</a><a href="#lens">02 · The evidence lens</a><a href="#method">03 · What to inspect</a><a href="#status">04 · Editorial status</a></aside>
      <article className="article-prose">
        <section id="question"><span>01 · Begin</span><h2>{note.question}</h2><p className="article-dropcap">{item.summary} The useful starting point is not a verdict about a material in isolation, but a clearly bounded question about a real product and system.</p></section>
        <blockquote><Quote /><p>Good paper literacy keeps source, manufacture, purpose and recovery in the same sentence.</p></blockquote>
        <section id="lens"><span>02 · Lens</span><h2>Read through {note.lens}.</h2><p>{note.evidence}</p><div className="article-evidence-card"><small>Evidence habit</small><strong>Prefer a named source and visible method over a confident, context-free number.</strong></div></section>
        <section id="method"><span>03 · Inspect</span><h2>Four checks travel with every article.</h2><ol><li><strong>Claim:</strong> What exactly is being asserted?</li><li><strong>Boundary:</strong> Which product, place, time and use are included?</li><li><strong>Source:</strong> Can the evidence and method be inspected?</li><li><strong>Correction:</strong> What would change the conclusion?</li></ol></section>
        <section id="status"><span>04 · Editorial workflow</span><h2>This source draft is connected to the CMS review queue.</h2><p>The public design, metadata and reading route are ready. The supplied long-form document remains marked for editorial and source review before its complete body is published.</p></section>
      </article>
      <aside className="article-side-note"><span>Editorial state</span><strong>Source draft connected.</strong><p>Body copy remains reviewable, replaceable and correctable through the content model.</p></aside>
    </div>

    <footer className="article-reader-next"><p className="home-micro-label">Continue reading</p><Link href={`/knowledge/${next.slug}`}><span>Next desk · {next.category}</span><strong>{next.title}</strong><ArrowRight /></Link></footer>
  </article>;
}
