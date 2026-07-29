export const indiaEvidenceSources = [
  {
    id: "dpiit",
    label: "DPIIT Annual Report 2025 to 2026",
    url: "https://www.dpiit.gov.in/static/uploads/2026/03/863a5fef349d79a1bba316c4b51eaacb.pdf",
    scope: "Current sector overview: operational mills, fibre routes, turnover, employment and per-capita consumption.",
  },
  {
    id: "ipma",
    label: "IPMA Paper Industry Myths versus Realities",
    url: "https://ipmaindia.org/wp-content/uploads/2023/11/Myths-versus-Realities-Sep23.pdf",
    scope: "Industry-reported agroforestry reach and share of sector wood demand.",
  },
  {
    id: "cse",
    label: "CSE Wastepaper Circularity Study",
    url: "https://www.cseindia.org/improving-wastepaper-circularity-for-the-pulp-and-paper-sector-12004",
    scope: "Recovered-paper use, domestic recovery estimate and the collection gap.",
  },
  {
    id: "niti",
    label: "NITI Aayog Bamboo for Pulp presentation",
    url: "https://niti.gov.in/sites/default/files/2022-02/Bamboo_Presentations/Technical_Session_3_Bamboo_for_Pulp_and_Paper_Shri_Sanjeev_Jain.pdf",
    scope: "Reference production mix of recovered fibre, wood and agro residue.",
  },
  {
    id: "ibef",
    label: "IBEF Paper and Packaging Industry",
    url: "https://www.ibef.org/industry/paper-packaging",
    scope: "Packaging-sector scale, operating units and SME participation.",
  },
  {
    id: "trade",
    label: "Department of Commerce TradeStat",
    url: "https://tradestat.commerce.gov.in/ftspcc/import_commodity_wise",
    scope: "Official commodity-level import and export records.",
  },
] as const;

export const indiaReferenceFibreMix = [
  { label: "Recovered fibre", short: "Recovered", share: 71, color: "#285d40", note: "Used paper returned as a production input" },
  { label: "Agro residue", short: "Agro", share: 8, color: "#d1a35f", note: "Bagasse, wheat straw and other suitable residues" },
  { label: "Wood and bamboo", short: "Wood", share: 21, color: "#9a6548", note: "Fresh fibre route, including farm forestry" },
] as const;

export const indiaCurrentFacts = [
  { value: "74 to 76%", label: "paper produced from recovered fibre", source: "DPIIT 2025 to 2026" },
  { value: "~550", label: "pulp and paper mills reported operational", source: "DPIIT 2025 to 2026" },
  { value: "₹90,000+ cr", label: "estimated annual industry turnover", source: "DPIIT 2025 to 2026" },
  { value: "16 kg", label: "estimated per-capita paper consumption", source: "DPIIT 2025 to 2026" },
  { value: "5 lakh", label: "direct jobs supported", source: "DPIIT 2025 to 2026" },
  { value: "15 lakh", label: "indirect jobs supported", source: "DPIIT 2025 to 2026" },
] as const;

export const indiaTradeSeries = [
  { year: "2018 to 2019", imports: 2844.7, exports: 1494.6 },
  { year: "2019 to 2020", imports: 2991.4, exports: 1662.1 },
  { year: "2020 to 2021", imports: 1747.2, exports: 2194.0 },
  { year: "2021 to 2022", imports: 1751.5, exports: 2856.6 },
  { year: "2022 to 2023", imports: 2058.7, exports: 1766.2 },
  { year: "2023 to 2024", imports: 2593.6, exports: 1560.2 },
] as const;

export const indiaTradeCategories = [
  { label: "Coated paper and board", imports: 850, qualifier: "approx." },
  { label: "Newsprint", imports: 664.5 },
  { label: "Uncoated writing and printing", imports: 494.8 },
  { label: "Uncoated kraft paper and board", imports: 383.6 },
  { label: "Other uncoated paper and board", imports: 193.9 },
] as const;

export const packagingDemand = [
  { label: "Food processing", share: 45 },
  { label: "Personal and homecare", share: 20 },
  { label: "Industrial products", share: 15 },
  { label: "Pharmaceuticals", share: 10 },
  { label: "Hot beverages", share: 10 },
] as const;

export const stateDemandEstimates = [
  { id: "UP", state: "Uttar Pradesh", total: 4180, packaging: 2612, print: 1384, x: 50, y: 34, hub: "Muzaffarnagar and Meerut recycled-fibre cluster" },
  { id: "BR", state: "Bihar", total: 2177, packaging: 1361, print: 722, x: 61, y: 39, hub: "Large consumption market; published mill split is limited" },
  { id: "MH", state: "Maharashtra", total: 2090, packaging: 1306, print: 693, x: 38, y: 59, hub: "Major production and packaging network" },
  { id: "WB", state: "West Bengal", total: 1742, packaging: 1088, print: 577, x: 69, y: 47, hub: "Eastern production and consumption corridor" },
  { id: "MP", state: "Madhya Pradesh", total: 1480, packaging: 925, print: 491, x: 43, y: 48, hub: "Central converting and demand corridor" },
  { id: "RJ", state: "Rajasthan", total: 1411, packaging: 882, print: 467, x: 32, y: 38, hub: "Registered paper-products manufacturing presence" },
  { id: "TN", state: "Tamil Nadu", total: 1393, packaging: 871, print: 462, x: 45, y: 82, hub: "Integrated, agro-residue and recovered-fibre systems" },
  { id: "KA", state: "Karnataka", total: 1167, packaging: 729, print: 387, x: 39, y: 71, hub: "Bengaluru-led consumption and converting demand" },
  { id: "GJ", state: "Gujarat", total: 1097, packaging: 686, print: 364, x: 27, y: 48, hub: "Morbi and Vapi recycled kraft and board cluster" },
  { id: "AP", state: "Andhra Pradesh", total: 923, packaging: 577, print: 306, x: 52, y: 70, hub: "Integrated pulp mills and farm-forestry linkages" },
  { id: "TS", state: "Telangana", total: 749, packaging: 468, print: 248, x: 47, y: 63, hub: "Integrated mill and metropolitan demand network" },
] as const;

export const productionHubs = [
  { id: "GJ", state: "Gujarat", x: 27, y: 48, title: "Circular manufacturing belt", detail: "High density of recovered-fibre kraft and board mills around Morbi and Vapi.", clusters: ["Morbi", "Vapi", "Ahmedabad", "Surat"] },
  { id: "MH", state: "Maharashtra", x: 38, y: 59, title: "Production and packaging network", detail: "A major paper-products economy connected to large converting and consumption markets.", clusters: ["Mumbai", "Pune", "Nagpur", "Aurangabad"] },
  { id: "UP", state: "Uttar Pradesh", x: 50, y: 34, title: "Recovered-fibre cluster", detail: "Muzaffarnagar and Meerut are long-established recycled paper manufacturing centres.", clusters: ["Muzaffarnagar", "Meerut", "Kanpur"] },
  { id: "TN", state: "Tamil Nadu", x: 45, y: 82, title: "Mixed fibre system", detail: "Integrated mills, recovered paper and bagasse routes support a diverse southern paper base.", clusters: ["Coimbatore", "Erode", "Karur"] },
  { id: "AP", state: "Andhra Pradesh", x: 52, y: 70, title: "Integrated fibre basin", detail: "Large integrated mills connect pulp production with farm-forestry programmes.", clusters: ["Rajamahendravaram", "Kakinada"] },
  { id: "KA", state: "Karnataka", x: 39, y: 71, title: "Production and demand corridor", detail: "Mill activity connects with Bengaluru's packaging, print and e-commerce demand.", clusters: ["Bengaluru", "Dandeli"] },
  { id: "PB", state: "Punjab", x: 37, y: 25, title: "Northern agro-industrial belt", detail: "Agricultural and manufacturing systems support paper and packaging activity.", clusters: ["Ludhiana", "Sangrur"] },
  { id: "UK", state: "Uttarakhand", x: 49, y: 25, title: "Kashipur mill cluster", detail: "A recognised northern cluster with wood, agro-residue and recovered-fibre routes.", clusters: ["Kashipur"] },
  { id: "WB", state: "West Bengal", x: 69, y: 47, title: "Eastern paper corridor", detail: "Manufacturing and port-linked markets create a distinct eastern fibre network.", clusters: ["Kolkata region"] },
] as const;
