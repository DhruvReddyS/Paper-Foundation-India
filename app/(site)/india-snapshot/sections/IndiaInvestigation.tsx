"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, MapPin, Paperclip, Search } from "lucide-react";

const sourceUrl = "https://www.cppri.res.in/resources/uploads/PageContentPdf/169892692135.pdf";
const overviewUrl = sourceUrl;

const regionNotes = [
  { name: "North", detail: "Writing, printing and agro residue routes", position: "north" },
  { name: "West", detail: "Packaging, board and high-volume conversion", position: "west" },
  { name: "East", detail: "Forest fibre, recovered paper and mill clusters", position: "east" },
  { name: "South", detail: "Integrated mills, farm forestry and specialty grades", position: "south" },
];

export default function IndiaInvestigation() {
  return (
    <section className="india-casefile">
      <header className="india-casefile-header">
        <div>
          <p><Search /> National evidence file / open</p>
          <h1>Paper across India.</h1>
        </div>
        <p>One map, four evidence slips, and the source boundaries that keep every number honest.</p>
      </header>

      <div className="india-pinboard">
        <div className="india-map-sheet">
          <div className="india-map-label"><span>CASE 01</span><b>INDIA / PAPER SYSTEM</b></div>
          <Image
            src="/images/maps/india-state-outline.png"
            alt="Map of India with state boundaries"
            fill
            priority
            sizes="(max-width: 900px) 92vw, 620px"
          />
          {regionNotes.map((region, index) => (
            <motion.div
              className={`india-region-pin india-region-${region.position}`}
              key={region.name}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: .12 + index * .08, type: "spring" }}
            >
              <MapPin />
              <span><b>{region.name}</b>{region.detail}</span>
            </motion.div>
          ))}
          <span className="india-map-scale">State outlines are geographic reference only</span>
        </div>

        <motion.article className="india-evidence-card india-card-production" initial={{ opacity: 0, y: -25, rotate: 4 }} whileInView={{ opacity: 1, y: 0, rotate: 3 }} viewport={{ once: true }}>
          <Paperclip />
          <small>CPPRI CENSUS / PRODUCTION</small>
          <div><strong>21.37</strong><span>million tonnes</span></div>
          <p>Reported production of paper, paperboard and newsprint in the CPPRI census table.</p>
          <a href={sourceUrl} target="_blank" rel="noreferrer">Open source desk <ArrowUpRight /></a>
        </motion.article>

        <motion.article className="india-evidence-card india-card-fibre" initial={{ opacity: 0, x: -25, rotate: -5 }} whileInView={{ opacity: 1, x: 0, rotate: -4 }} viewport={{ once: true }}>
          <small>FIBRE ROUTES / CPPRI 2019 TO 2020</small>
          <div className="india-ring"><strong>76.3%</strong><span>reported tonnage from recovered fibre</span></div>
          <p>The same raw-material table records 18.3% wood and 5.4% agro residue by reported production tonnage.</p>
          <a href={overviewUrl} target="_blank" rel="noreferrer">Read the boundary <ArrowUpRight /></a>
        </motion.article>

        <motion.article className="india-evidence-card india-card-grades" initial={{ opacity: 0, x: 30, rotate: 3 }} whileInView={{ opacity: 1, x: 0, rotate: 2 }} viewport={{ once: true }}>
          <small>PRODUCTION MIX / CPPRI 2019 TO 2020</small>
          <h2>What India makes</h2>
          <div className="india-grade-bars">
            <span style={{ "--share": "71%" } as React.CSSProperties}><b>70.8%</b><i>Kraft and board</i></span>
            <span style={{ "--share": "22.4%" } as React.CSSProperties}><b>22.4%</b><i>Writing and print</i></span>
            <span style={{ "--share": "3.1%" } as React.CSSProperties}><b>3.1%</b><i>Newsprint</i></span>
            <span style={{ "--share": "3.6%" } as React.CSSProperties}><b>3.6%</b><i>Tissue and other grades</i></span>
          </div>
        </motion.article>

        <motion.article className="india-evidence-card india-card-people" initial={{ opacity: 0, y: 25, rotate: -2 }} whileInView={{ opacity: 1, y: 0, rotate: -1 }} viewport={{ once: true }}>
          <small>INDUSTRY FOOTPRINT / PUBLISHED OVERVIEW</small>
          <h2>People behind the sheet</h2>
          <div className="india-people-grid">
            <span><b>~900</b><i>mills in the report</i></span>
            <span><b>2.5M</b><i>direct and indirect livelihoods</i></span>
            <span><b>23.99M</b><i>tonnes installed capacity</i></span>
          </div>
          <p>These are sector overview figures, not a live registry. They are shown with their original source scope.</p>
        </motion.article>

        <i className="india-thread thread-one" />
        <i className="india-thread thread-two" />
        <i className="india-thread thread-three" />
      </div>

      <footer className="india-source-strip">
        <span>READING NOTE</span>
        <p>Figures come from different CPPRI publications and reporting years. They should be read as sourced snapshots, not combined into a single current-year estimate.</p>
        <a href="https://cppri.res.in/en/division/industry-coordination-%26-international-cooperation" target="_blank" rel="noreferrer">How CPPRI collects industry statistics <ArrowUpRight /></a>
      </footer>
    </section>
  );
}
