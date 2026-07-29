"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Boxes, Factory, FileCheck2, MapPinned, Recycle, Search, Trees } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { indiaEvidenceSources, indiaReferenceFibreMix, productionHubs, stateDemandEstimates } from "@/content/indiaAdvocacyData";
import styles from "./IndiaFibreAtlas.module.css";

type Layer = "hubs" | "demand";

export default function IndiaFibreAtlas() {
  const [layer, setLayer] = useState<Layer>("hubs");
  const [selectedId, setSelectedId] = useState("GJ");
  const records = layer === "hubs" ? productionHubs : stateDemandEstimates;
  const selected = useMemo(() => records.find(record => record.id === selectedId) ?? records[0], [records, selectedId]);

  function changeLayer(next: Layer) {
    setLayer(next);
    setSelectedId(next === "hubs" ? "GJ" : "UP");
  }

  return <main className={styles.atlas}>
    <header className={styles.hero}>
      <div className={styles.heroCopy}>
        <p><MapPinned /> India Fibre Atlas</p>
        <h1>Where fibre<br /><em>moves,</em> mills gather.</h1>
        <span>Explore documented manufacturing hubs and a clearly labelled state demand model. Production, consumption and recycling are kept separate.</span>
      </div>
      <div className={styles.heroMix}>
        <header><span>REFERENCE PRODUCTION MIX</span><small>NITI Aayog presentation</small></header>
        <div className={styles.mixDisc} style={{ background: `conic-gradient(${indiaReferenceFibreMix.map((item, index) => `${item.color} ${indiaReferenceFibreMix.slice(0, index).reduce((sum, entry) => sum + entry.share, 0)}% ${indiaReferenceFibreMix.slice(0, index + 1).reduce((sum, entry) => sum + entry.share, 0)}%`).join(",")})` }}><i><strong>79%</strong><span>non-wood routes</span></i></div>
        <div>{indiaReferenceFibreMix.map(item => <p key={item.label}><i style={{ background: item.color }} /><span>{item.label}</span><strong>{item.share}%</strong></p>)}</div>
        <footer>Shares are a published reference mix. Newer DPIIT reporting places recovered-fibre production at 74 to 76%.</footer>
      </div>
    </header>

    <section className={styles.explorer}>
      <header className={styles.explorerHead}>
        <div><p><Search /> SELECT AN EVIDENCE LAYER</p><h2>One map. Two honest readings.</h2></div>
        <div className={styles.switch}>
          <button className={layer === "hubs" ? styles.active : ""} onClick={() => changeLayer("hubs")}><Factory /> Manufacturing hubs</button>
          <button className={layer === "demand" ? styles.active : ""} onClick={() => changeLayer("demand")}><Boxes /> Demand estimate</button>
        </div>
      </header>

      <div className={styles.mapDesk}>
        <div className={styles.map}>
          <div className={styles.mapLabel}><span>INDIA / MATERIAL NETWORK</span><small>{layer === "hubs" ? "DOCUMENTED CLUSTERS" : "MODELLED DEMAND"}</small></div>
          <Image src="/images/maps/india-state-outline.png" alt="Outline map of India with state boundaries" fill priority sizes="(max-width: 900px) 94vw, 720px" />
          {records.map(record => <button className={`${styles.pin} ${selected.id === record.id ? styles.selected : ""}`} key={record.id} style={{ left: `${record.x}%`, top: `${record.y}%` }} onClick={() => setSelectedId(record.id)} aria-label={`Inspect ${record.state}`}><i /><span>{record.id}</span>{layer === "demand" && "total" in record && <b style={{ height: `${18 + record.total / 135}px` }} />}</button>)}
          <footer><span>20.5937° N / 78.9629° E</span><p>{layer === "hubs" ? "Pins indicate regional clusters, not individual mills." : "Bar height follows estimated total demand."}</p></footer>
        </div>

        <AnimatePresence mode="wait">
          <motion.article className={styles.file} key={`${layer}-${selected.id}`} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
            <header><span>{selected.id} / STATE FILE</span><FileCheck2 /></header>
            <h3>{selected.state}</h3>
            {layer === "hubs" && "title" in selected ? <>
              <p className={styles.fileTitle}>{selected.title}</p>
              <p className={styles.fileCopy}>{selected.detail}</p>
              <div className={styles.clusters}><span>KNOWN CLUSTERS</span>{selected.clusters.map(cluster => <b key={cluster}>{cluster}</b>)}</div>
              <footer><strong>Reading boundary</strong><p>Cluster descriptions synthesize published sector overviews. They do not claim a live mill count.</p></footer>
            </> : layer === "demand" && "total" in selected ? <>
              <div className={styles.demandHero}><strong>{selected.total.toLocaleString("en-IN")}</strong><span>estimated thousand tonnes total demand</span></div>
              <div className={styles.demandSplit}>
                <p><span>Packaging and recycled board</span><b>{selected.packaging.toLocaleString("en-IN")}</b><i><em style={{ width: `${selected.packaging / selected.total * 100}%` }} /></i></p>
                <p><span>Writing, print and newsprint</span><b>{selected.print.toLocaleString("en-IN")}</b><i><em style={{ width: `${selected.print / selected.total * 100}%` }} /></i></p>
              </div>
              <p className={styles.fileCopy}>{selected.hub}</p>
              <footer><strong>Estimate, not census</strong><p>State demand values are a model supplied for this project. No official state consumption series was identified.</p></footer>
            </> : null}
          </motion.article>
        </AnimatePresence>
      </div>

      <div className={styles.index}>
        <header><span>{layer === "hubs" ? "CLUSTER INDEX" : "DEMAND RANKING"}</span><p>{records.length} state files</p></header>
        <div>{records.map((record, index) => <button key={record.id} onClick={() => setSelectedId(record.id)} className={record.id === selected.id ? styles.indexActive : ""}><span>{String(index + 1).padStart(2, "0")}</span><strong>{record.state}</strong><i />{layer === "demand" && "total" in record ? <b>{record.total.toLocaleString("en-IN")} kt</b> : <b>{record.id}</b>}</button>)}</div>
      </div>
    </section>

    <section className={styles.fibreStory}>
      <header><p><Recycle /> INDIA&apos;S MATERIAL ADVANTAGE</p><h2>Most paper already begins outside a natural forest.</h2></header>
      <div className={styles.routeCards}>
        {indiaReferenceFibreMix.map((item, index) => <article key={item.label} style={{ "--route": item.color } as React.CSSProperties}><span>0{index + 1}</span>{index === 0 ? <Recycle /> : index === 1 ? <Boxes /> : <Trees />}<strong>{item.share}%</strong><h3>{item.label}</h3><p>{item.note}</p></article>)}
        <article className={styles.forestryCard}><small>WOOD ROUTE / CONTEXT</small><strong>90%+</strong><h3>of sector wood demand</h3><p>is reported by IPMA as coming from agro and farm forestry developed across more than 1.2 million hectares.</p><a href={indiaEvidenceSources[1].url} target="_blank" rel="noreferrer">Open the IPMA source <ArrowUpRight /></a></article>
      </div>
    </section>

    <section className={styles.next}>
      <div><p>Continue the India file</p><h2>See the national numbers, trade and jobs behind the map.</h2></div>
      <Link href="/india-snapshot">Open India Paper Ledger <ArrowRight /></Link>
    </section>
  </main>;
}
