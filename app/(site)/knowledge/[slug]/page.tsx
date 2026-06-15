import { ArrowLeft, ArrowRight, BookOpen, Clock, ExternalLink, Quote, Share2 } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "How Fibre Sourcing Shapes the Paper Story",
  description: "A context-led guide to reading claims about paper, forests, fibre and recovery.",
};

export default function ArticleReaderPage() {
  return <article className="article-reader">
    <div className="article-progress"><span /></div>
    <header className="article-reader-hero">
      <div className="article-reader-meta"><Link href="/knowledge"><ArrowLeft /> Knowledge hub</Link><span>Context · Forestry · Recovery</span></div>
      <p className="home-micro-label">Cover essay · Reading time 8 minutes</p>
      <h1>How fibre sourcing<br />shapes the <em>paper story.</em></h1>
      <p className="article-reader-deck">“Paper” is not one environmental outcome. To understand a sheet, follow where its fibre came from, how it was made and whether the system can recover it.</p>
      <div className="article-byline"><span>Editorial Desk</span><span><Clock /> 8 min read</span><button><Share2 /> Share</button></div>
      <div className="article-cover-figure"><BookOpen /><span>FIG. 01 · FIBRE / SOURCE / SYSTEM</span><strong>Read past the material label.</strong><i /></div>
    </header>

    <div className="article-reader-layout">
      <aside className="article-toc"><p>In this essay</p><a href="#label">01 · The label is a beginning</a><a href="#source">02 · Source changes the answer</a><a href="#loop">03 · Recovery needs replenishment</a><a href="#questions">04 · Better questions</a></aside>
      <article className="article-prose">
        <section id="label"><span>01 · Context</span><h2>The material label is a beginning, not a conclusion.</h2><p className="article-dropcap">Paper can be light or heavy, short-lived or durable, responsibly sourced or poorly sourced, recoverable or made difficult to recycle by design. Calling every one of those outcomes simply “paper” hides the decisions that matter.</p><p>A useful assessment starts with boundaries: which product, made where, from which fibre mix, used how many times, and collected by what local system?</p></section>
        <blockquote><Quote /><p>Good material literacy replaces “Is paper good?” with “What evidence describes this paper system?”</p></blockquote>
        <section id="source"><span>02 · Source</span><h2>Fresh fibre is not one thing either.</h2><p>Wood fibre may be associated with conversion of natural forest, or it may come from responsibly managed production landscapes and farm forestry. Recovered fibre avoids discarding useful material, but its availability and quality depend on collection, sorting and previous product design.</p><div className="article-evidence-card"><small>Evidence habit</small><strong>Look for source, certification scope, land-use context and a traceable method.</strong><a href="https://www.fao.org/sustainable-forest-management/toolbox/modules/management-of-planted-forests/further-learning/en/" target="_blank" rel="noreferrer">FAO guidance <ExternalLink /></a></div></section>
        <section id="loop"><span>03 · Circularity</span><h2>A recovered-fibre loop still needs strength.</h2><p>Fibres shorten and some are lost through use, collection and recycling. That is why a functioning loop uses recovered fibre efficiently while responsibly sourced fresh fibre replenishes the material that cannot return.</p><p>The right mix varies by grade. Tissue, packaging and fine writing paper ask different things from their fibres. A single percentage should never be treated as a universal recipe.</p></section>
        <section id="questions"><span>04 · Use it</span><h2>Four questions make a better paper decision.</h2><ol><li><strong>Source:</strong> Is there credible evidence about where the fibre came from?</li><li><strong>Design:</strong> Is the product fit for purpose without unnecessary material?</li><li><strong>Use:</strong> Can it serve fully, or be reused before disposal?</li><li><strong>Recovery:</strong> Is it clean, dry and accepted by the available collection system?</li></ol></section>
      </article>
      <aside className="article-side-note"><span>Reading note</span><strong>Context is not indecision.</strong><p>It is the information required to make a defensible choice.</p></aside>
    </div>

    <footer className="article-reader-next"><p className="home-micro-label">Continue reading</p><Link href="/myths"><span>Next desk</span><strong>Put familiar paper claims under pressure.</strong><ArrowRight /></Link></footer>
  </article>;
}
