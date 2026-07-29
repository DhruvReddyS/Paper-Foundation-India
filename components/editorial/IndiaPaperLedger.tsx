"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, BriefcaseBusiness, Factory, PackageOpen, Recycle, Scale, Trees, UsersRound } from "lucide-react";
import Link from "next/link";
import { indiaCurrentFacts, indiaEvidenceSources, indiaReferenceFibreMix, indiaTradeCategories, indiaTradeSeries, packagingDemand } from "@/content/indiaAdvocacyData";
import styles from "./IndiaPaperLedger.module.css";

const maxTrade = Math.max(...indiaTradeSeries.flatMap(item => [item.imports, item.exports]));

export default function IndiaPaperLedger() {
  return <main className={styles.ledger}>
    <header className={styles.hero}>
      <div><p>INDIA PAPER LEDGER / 2026 EDITION</p><h1>The numbers<br />behind <em>the sheet.</em></h1><span>A sourced national view of fibre, mills, jobs, recovery, packaging and trade. Every figure keeps its year and boundary attached.</span></div>
      <aside><span>THE CORE ADVOCACY FACT</span><strong>79%</strong><h2>of the reference production mix uses recovered fibre or agro residue.</h2><p>This supports the case for paper as a renewable and circular material system. It does not mean that every individual product contains 79% recycled fibre.</p></aside>
    </header>

    <section className={styles.mix}>
      <header><div><p>01 / MATERIAL BALANCE</p><h2>Three fibre routes make India&apos;s paper.</h2></div><span>NITI Aayog reference production mix. Newer DPIIT reporting places recovered fibre at 74 to 76%.</span></header>
      <div className={styles.mixChart}><div className={styles.mixBar}>{indiaReferenceFibreMix.map(item => <motion.i initial={{ width: 0 }} whileInView={{ width: `${item.share}%` }} viewport={{ once: true }} transition={{ duration: .8 }} key={item.label} style={{ background: item.color }} />)}</div><div className={styles.mixCards}>{indiaReferenceFibreMix.map((item, index) => <article key={item.label}><span>0{index + 1}</span><strong>{item.share}%</strong><h3>{item.label}</h3><p>{item.note}</p></article>)}</div></div>
    </section>

    <section className={styles.facts}>
      <header><p>02 / INDUSTRY SCALE</p><h2>Large enough to matter. Detailed enough to measure.</h2></header>
      <div>{indiaCurrentFacts.map((fact, index) => <motion.article key={fact.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .05 }}><span>{index === 0 ? <Recycle /> : index === 1 ? <Factory /> : index === 2 ? <BriefcaseBusiness /> : index === 3 ? <Scale /> : <UsersRound />}</span><strong>{fact.value}</strong><p>{fact.label}</p><small>{fact.source}</small></motion.article>)}</div>
    </section>

    <section className={styles.recovery}>
      <div className={styles.recoveryCopy}><p>03 / THE CIRCULARITY GAP</p><h2>High recycled production.<br />A collection system still catching up.</h2><span>CSE estimates that mills recover and use about 12 million tonnes of wastepaper a year, equal to a 57% recovery rate. That leaves useful fibre outside mill recovery streams and maintains demand for imported recovered paper.</span><a href={indiaEvidenceSources[2].url} target="_blank" rel="noreferrer">Open the CSE study <ArrowUpRight /></a></div>
      <div className={styles.recoveryGauge}><div><i style={{ "--recovery": "57%" } as React.CSSProperties}><strong>57%</strong><span>estimated recovery</span></i></div><article><strong>12M</strong><span>tonnes recovered and used by mills per year</span></article><article><strong>43%</strong><span>of domestic paper consumption estimated to move into secondary uses</span></article></div>
    </section>

    <section className={styles.forestry}>
      <div><Trees /><span>04 / FARM FORESTRY</span><strong>1.2M+</strong><h2>hectares brought under pulpwood plantations through industry and farmer programmes.</h2></div>
      <article><strong>90%+</strong><p>of sector wood demand is reported by IPMA as supplied through agro and farm forestry.</p><small>Industry-reported figure. Farm forestry should not be described as equivalent to a natural forest ecosystem.</small><a href={indiaEvidenceSources[1].url} target="_blank" rel="noreferrer">Read the source <ArrowUpRight /></a></article>
    </section>

    <section className={styles.trade}>
      <header><div><p>05 / PAPER, PAPERBOARD AND NEWSPRINT</p><h2>Six years of trade movement.</h2></div><span>Thousand tonnes</span></header>
      <div className={styles.tradeChart}>{indiaTradeSeries.map(item => <article key={item.year}><div><i className={styles.imports} style={{ height: `${item.imports / maxTrade * 100}%` }}><b>{item.imports.toLocaleString("en-IN")}</b></i><i className={styles.exports} style={{ height: `${item.exports / maxTrade * 100}%` }}><b>{item.exports.toLocaleString("en-IN")}</b></i></div><span>{item.year}</span></article>)}</div>
      <div className={styles.tradeLegend}><span><i className={styles.imports} /> Imports</span><span><i className={styles.exports} /> Exports</span><p>FY 2023 to 2024 closed with 2,593.6 kt of imports and 1,560.2 kt of exports in the supplied trade series.</p></div>
      <div className={styles.categories}><header><span>FY 2023 TO 2024 / IMPORT CATEGORIES</span><small>KT</small></header>{indiaTradeCategories.map(item => <p key={item.label}><span>{item.label}</span><i><b style={{ width: `${item.imports / 850 * 100}%` }} /></i><strong>{"qualifier" in item && "~"}{item.imports}</strong></p>)}</div>
    </section>

    <section className={styles.packaging}>
      <header><PackageOpen /><div><p>06 / PACKAGING ECONOMY</p><h2>Demand begins with what India needs to protect.</h2></div></header>
      <div className={styles.packagingGrid}><article className={styles.packScale}><strong>22,000+</strong><h3>packaging units</h3><p>IBEF reports that 85% are small and medium enterprises.</p><a href={indiaEvidenceSources[4].url} target="_blank" rel="noreferrer">Open IBEF overview <ArrowUpRight /></a></article><div className={styles.packChart}>{packagingDemand.map(item => <p key={item.label}><span>{item.label}</span><i><b style={{ width: `${item.share / 45 * 100}%` }} /></i><strong>{item.share}%</strong></p>)}</div></div>
    </section>

    <section className={styles.sources}><header><p>07 / SOURCE REGISTER</p><h2>Proof belongs beside the claim.</h2></header><div>{indiaEvidenceSources.map((source, index) => <a key={source.id} href={source.url} target="_blank" rel="noreferrer"><span>0{index + 1}</span><strong>{source.label}</strong><p>{source.scope}</p><ArrowUpRight /></a>)}</div></section>
    <section className={styles.next}><p>Need the state view?</p><h2>Open the India Fibre Atlas.</h2><Link href="/india-map">Explore the map <ArrowRight /></Link></section>
  </main>;
}
