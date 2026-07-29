"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, BarChart3, Factory, FileCheck2, Layers3, MapPin, Recycle, Search, Trees } from "lucide-react";
import {
  indiaFibreMix,
  indiaGradeMix,
  indiaPaperSources,
  indiaPaperTrend,
  indiaStatePaperProfiles,
} from "@/content/indiaPaperData";
import styles from "./IndiaAtlas.module.css";

type Layer = "output" | "fibre";

const formatLakhs = new Intl.NumberFormat("en-IN");

export default function IndiaAtlas() {
  const [layer, setLayer] = useState<Layer>("output");
  const [selectedId, setSelectedId] = useState("GJ");
  const selected = useMemo(() => indiaStatePaperProfiles.find((state) => state.id === selectedId) ?? indiaStatePaperProfiles[0], [selectedId]);

  return (
    <main className={styles.atlas}>
      <header className={styles.hero}>
        <div>
          <p><Search /> India paper evidence atlas</p>
          <h1>Follow the fibre.<br /><em>Read the boundary.</em></h1>
        </div>
        <aside>
          <span>READ THIS FIRST</span>
          <p>Factory output, paper tonnage and recycling performance are different measures. Every chart below keeps its source year and scope attached.</p>
        </aside>
      </header>

      <section className={styles.mapDesk}>
        <header className={styles.deskHeader}>
          <div><span>01 / STATE DESK</span><h2>Where paper activity shows up</h2></div>
          <div className={styles.layerToggle}>
            <button className={layer === "output" ? styles.active : ""} onClick={() => setLayer("output")}><BarChart3 /> Factory output</button>
            <button className={layer === "fibre" ? styles.active : ""} onClick={() => setLayer("fibre")}><Layers3 /> Fibre evidence</button>
          </div>
        </header>

        <div className={styles.mapGrid}>
          <div className={styles.mapSheet}>
            <Image src="/images/maps/india-state-outline.png" alt="Outline map of India with state boundaries" fill priority sizes="(max-width: 900px) 94vw, 700px" />
            {indiaStatePaperProfiles.map((state) => (
              <button
                key={state.id}
                className={`${styles.statePin} ${selectedId === state.id ? styles.selectedPin : ""} ${layer === "fibre" && !state.fibreProfile.includes("No verified") ? styles.evidencePin : ""}`}
                style={{ left: `${state.x}%`, top: `${state.y}%` }}
                onClick={() => setSelectedId(state.id)}
                aria-label={`Open ${state.name} evidence`}
              >
                <span>{state.id}</span>
                {layer === "output" && state.outputShare ? <i style={{ height: `${Math.max(10, state.outputShare * 2.2)}px` }} /> : <i />}
              </button>
            ))}
            <p className={styles.mapKey}>{layer === "output" ? "Marker height follows MoSPI output share. It is not physical mill location." : "Rust markers have a fibre or cluster statement in the cited public sources."}</p>
          </div>

          <article className={styles.stateFile}>
            <header><span>{selected.id} / STATE FILE</span>{selected.rank && <b>OUTPUT RANK {String(selected.rank).padStart(2, "0")}</b>}</header>
            <h3>{selected.name}</h3>
            {selected.outputShare ? (
              <div className={styles.stateMetric}><strong>{selected.outputShare}%</strong><span>share of all-India registered factory output for NIC 17 in 2021 to 2022</span></div>
            ) : (
              <div className={styles.stateMetric}><strong>Major</strong><span>paper-sector presence identified by CPPRI, outside the leading 80 percent group displayed by MoSPI</span></div>
            )}
            {selected.outputLakhs && <p className={styles.rupeeValue}>₹{formatLakhs.format(selected.outputLakhs)} lakh reported output</p>}
            <div className={styles.fileSection}><span>FIBRE PROFILE</span><p>{selected.fibreProfile}</p></div>
            <div className={styles.fileSection}><span>WHAT THE SOURCE ACTUALLY SAYS</span><p>{selected.evidence}</p></div>
            <div className={styles.clusterList}>{selected.clusters.map((cluster) => <span key={cluster}><MapPin />{cluster}</span>)}</div>
            <footer>Missing state numbers are left blank, not estimated.</footer>
          </article>
        </div>

        <div className={styles.stateRanking}>
          <header><span>MOSPI / NIC 17 / 2021 TO 2022</span><p>Ten states contributing 80.03% of registered factory output</p></header>
          <div>
            {indiaStatePaperProfiles.filter((state) => state.outputShare).map((state) => (
              <button key={state.id} onClick={() => setSelectedId(state.id)} className={selectedId === state.id ? styles.rankActive : ""}>
                <span>{state.rank}</span><b>{state.name}</b><i style={{ "--bar": `${(state.outputShare! / 18.01) * 100}%` } as React.CSSProperties} /><strong>{state.outputShare}%</strong>
              </button>
            ))}
          </div>
          <a href={indiaPaperSources.asi.url} target="_blank" rel="noreferrer">Open MoSPI source <ArrowUpRight /></a>
        </div>
      </section>

      <section className={styles.nationalDesk}>
        <header><span>02 / NATIONAL MATERIAL BALANCE</span><h2>One production year, three ways to read it.</h2><p>All figures in this section come from the same CPPRI census table for 2019 to 2020.</p></header>
        <div className={styles.keyFigures}>
          <article><Factory /><strong>21.37M</strong><span>tonnes produced</span></article>
          <article><BarChart3 /><strong>23.99M</strong><span>tonnes installed capacity</span></article>
          <article><Recycle /><strong>76.3%</strong><span>of reported tonnage used recovered fibre</span></article>
          <article><Trees /><strong>23.7%</strong><span>wood and agro residue combined</span></article>
        </div>

        <div className={styles.chartPair}>
          <article className={styles.fibreChart}>
            <header><span>RAW MATERIAL ROUTES</span><b>21,366,842 tonnes total</b></header>
            <div className={styles.fibreStack}>{indiaFibreMix.map((item) => <i key={item.label} style={{ width: `${item.share}%`, background: item.color }} />)}</div>
            <div className={styles.fibreLegend}>{indiaFibreMix.map((item) => <p key={item.label}><i style={{ background: item.color }} /><span>{item.label}</span><b>{item.share}%</b><small>{formatLakhs.format(item.tonnes)} t</small></p>)}</div>
            <footer>Recovered-fibre share of production input is not the same thing as a national collection or recycling rate.</footer>
          </article>
          <article className={styles.gradeChart}>
            <header><span>WHAT THE MILLS MADE</span><b>Production by grade</b></header>
            <div>{indiaGradeMix.map((item) => <p key={item.label}><span>{item.label}</span><i><b style={{ width: `${item.share}%` }} /></i><strong>{item.share}%</strong></p>)}</div>
            <footer>Shares are calculated from the published CPPRI grade tonnages and rounded to one decimal place.</footer>
          </article>
        </div>

        <article className={styles.trendChart}>
          <header><div><span>FOUR-YEAR SERIES</span><h3>Capacity, production and apparent consumption</h3></div><p>Million tonnes per year</p></header>
          <div className={styles.trendRows}>
            {indiaPaperTrend.map((row) => <div key={row.year}><span>{row.year}</span><p><i className={styles.capacity} style={{ width: `${row.capacity / 24 * 100}%` }} /><b>{row.capacity}</b></p><p><i className={styles.production} style={{ width: `${row.production / 24 * 100}%` }} /><b>{row.production}</b></p><p><i className={styles.consumption} style={{ width: `${row.consumption / 24 * 100}%` }} /><b>{row.consumption}</b></p></div>)}
          </div>
          <footer><span><i className={styles.capacity} />Capacity</span><span><i className={styles.production} />Production</span><span><i className={styles.consumption} />Apparent consumption</span></footer>
        </article>
      </section>

      <section className={styles.performanceDesk}>
        <header><span>03 / PERFORMANCE, CORRECTLY SCOPED</span><h2>A basin programme, not a national average.</h2></header>
        <div className={styles.performanceGrid}>
          <article>
            <span>CPCB MAIN-STEM INVENTORY / 2023</span>
            <div><strong>161</strong><p>mills in five Ganga and Yamuna main-stem states</p></div>
            <div><strong>130</strong><p>found operating during inspection</p></div>
            <div><strong>18,552</strong><p>tonnes per day average production across operating mills</p></div>
          </article>
          <article className={styles.beforeAfter}>
            <span>AVERAGE FRESHWATER CONSUMPTION</span>
            <p><b style={{ height: "100%" }}>51.34</b><small>Before programme</small></p>
            <p><b style={{ height: "16.3%" }}>8.37</b><small>2023</small></p>
            <em>kL per tonne</em>
          </article>
          <article className={styles.beforeAfter}>
            <span>AVERAGE EFFLUENT DISCHARGE</span>
            <p><b style={{ height: "100%" }}>33.75</b><small>Before programme</small></p>
            <p><b style={{ height: "15.1%" }}>5.10</b><small>2023</small></p>
            <em>kL per tonne</em>
          </article>
        </div>
        <p className={styles.scopeNote}><FileCheck2 /> CPCB reports that recovered-fibre and wastepaper mills made up about 87% of operating units and 82% of production in this inspected five-state inventory. These percentages must not be labelled as all-India recycling rates.</p>
      </section>

      <section className={styles.globalDesk}>
        <header><span>04 / INDIA IN THE 2024 WORLD SERIES</span><h2>Large producer. Major recovered-paper importer.</h2></header>
        <div>
          <article><strong>5%</strong><p>of global paper and paperboard production</p></article>
          <article><strong>3%</strong><p>of global recovered-paper production</p></article>
          <article><strong>13%</strong><p>of global recovered-paper imports</p></article>
          <article><strong>3%</strong><p>of global paper and paperboard imports</p></article>
        </div>
        <p>FAO 2024 shares are international context, not a substitute for India’s domestic material-balance tables.</p>
      </section>

      <section className={styles.sources}>
        <header><span>THE SOURCE DESK</span><h2>Every number has somewhere to go.</h2></header>
        <div>{Object.values(indiaPaperSources).map((source, index) => <a key={source.label} href={source.url} target="_blank" rel="noreferrer"><span>0{index + 1}</span><b>{source.label}</b><p>{source.note}</p><ArrowUpRight /></a>)}</div>
      </section>
    </main>
  );
}
