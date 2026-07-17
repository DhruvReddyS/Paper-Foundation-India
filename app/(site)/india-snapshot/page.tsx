"use client";

import ProductionChart from "./sections/ProductionChart";
import ConsumptionChart from "./sections/ConsumptionChart";
import RecycledFibreChart from "./sections/RecycledFibreChart";
import RecyclingRateChart from "./sections/RecyclingRateChart";
import MillDistribution from "./sections/MillDistribution";
import EmploymentSection from "./sections/EmploymentSection";
import TradeSection from "./sections/TradeSection";
import SourcesBibliography from "./sections/SourcesBibliography";
import styles from "../paper-everywhere-pages.module.css";

export default function IndiaSnapshotPage() {
  return (
    <main className={styles.snapshot}>
      <header className={styles.snapshotTop}>
        <div><p className={styles.snapshotLabel}>India facts &amp; numbers / data edition</p><h1>The paper ledger.</h1></div>
        <div><span><b>08</b><small>DATA PLATES</small></span><span><b>06</b><small>SOURCE DESKS</small></span></div>
      </header>
      <div className={styles.snapshotBody}>
        <ProductionChart />
        <ConsumptionChart />
        <RecycledFibreChart />
        <RecyclingRateChart />
        <MillDistribution />
        <EmploymentSection />
        <TradeSection />
        <SourcesBibliography />
      </div>
    </main>
  );
}
