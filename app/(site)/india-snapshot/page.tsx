"use client";

import SnapshotHeader from "./sections/SnapshotHeader";
import ProductionChart from "./sections/ProductionChart";
import ConsumptionChart from "./sections/ConsumptionChart";
import RecycledFibreChart from "./sections/RecycledFibreChart";
import RecyclingRateChart from "./sections/RecyclingRateChart";
import MillDistribution from "./sections/MillDistribution";
import EmploymentSection from "./sections/EmploymentSection";
import TradeSection from "./sections/TradeSection";
import SourcesBibliography from "./sections/SourcesBibliography";

export default function IndiaSnapshotPage() {
  return (
    <main className="min-h-screen">
      <SnapshotHeader />
      <ProductionChart />
      <ConsumptionChart />
      <RecycledFibreChart />
      <RecyclingRateChart />
      <MillDistribution />
      <EmploymentSection />
      <TradeSection />
      <SourcesBibliography />
    </main>
  );
}
