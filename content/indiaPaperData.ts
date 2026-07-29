export const indiaPaperSources = {
  asi: {
    label: "MoSPI, Annual Survey of Industries 2021 to 2022",
    url: "https://mospi.gov.in/sites/default/files/asi_results/Summary%20Results%20for%20Factory%20Sector%202021-22%20Final_C.pdf",
    note: "Statement 19, NIC 17: Paper and paper products. Values cover the registered factory sector and are reported in ₹ lakh.",
  },
  cppri: {
    label: "CPPRI Annual Report, Indian paper industry census",
    url: "https://www.cppri.res.in/resources/uploads/PageContentPdf/169892692135.pdf",
    note: "Production, capacity, raw material and grade tables refer principally to 2019 to 2020. The 2020 to 2021 row is marked estimated in the source.",
  },
  cpcb: {
    label: "CPCB Charter 3.0 for Water Recycling and Pollution Prevention",
    url: "https://cpcb.nic.in/ngrba/Charter-3.0-PulpPaper.pdf",
    note: "The 2023 inventory covers main-stem Ganga and Yamuna states. It is not an all-India mill census.",
  },
  fao: {
    label: "FAO, Global forest products facts and figures 2024",
    url: "https://www.fao.org/forestry/statistics/data/",
    note: "International production and trade shares. FAO notes that missing country returns may be supplemented by estimates or repeated historical values.",
  },
} as const;

export type IndiaStatePaperProfile = {
  id: string;
  name: string;
  x: number;
  y: number;
  outputLakhs?: number;
  outputShare?: number;
  rank?: number;
  fibreProfile: string;
  evidence: string;
  clusters: string[];
};

export const indiaStatePaperProfiles: IndiaStatePaperProfile[] = [
  { id: "GJ", name: "Gujarat", x: 27, y: 47, outputLakhs: 3172606, outputShare: 18.01, rank: 1, fibreProfile: "Predominantly recovered fibre among its many paper-making units.", evidence: "CPPRI records Gujarat as having the largest number of paper-making units and says most are recycled-fibre based.", clusters: ["Vapi", "Ahmedabad"] },
  { id: "MH", name: "Maharashtra", x: 39, y: 60, outputLakhs: 2121510, outputShare: 12.04, rank: 2, fibreProfile: "Mixed mill system. A public state-wide fibre split is not reported in the cited census.", evidence: "CPPRI identifies Maharashtra among the states containing major paper-sector players.", clusters: ["Major mill presence"] },
  { id: "UP", name: "Uttar Pradesh", x: 50, y: 34, outputLakhs: 2016513, outputShare: 11.44, rank: 3, fibreProfile: "Mixed wood, agro-residue and recovered-fibre routes. No verified state share is published here.", evidence: "CPPRI records the second-largest number of mills and identifies the Muzaffarnagar and Meerut concentration.", clusters: ["Muzaffarnagar", "Meerut"] },
  { id: "TN", name: "Tamil Nadu", x: 44, y: 84, outputLakhs: 1572260, outputShare: 8.92, rank: 4, fibreProfile: "Integrated and recovered-fibre mills operate in the state, but the cited sources do not publish one state-wide split.", evidence: "CPPRI identifies Tamil Nadu among the states containing major players and names Coimbatore as a major cluster.", clusters: ["Coimbatore"] },
  { id: "UK", name: "Uttarakhand", x: 49, y: 26, outputLakhs: 1128473, outputShare: 6.4, rank: 5, fibreProfile: "Wood, agro-residue and recovered-fibre categories appear in the CPCB basin inventory. State-specific shares are not stated.", evidence: "CPPRI names Kashipur as a major cluster. CPCB includes Uttarakhand in its main-stem inventory.", clusters: ["Kashipur"] },
  { id: "KA", name: "Karnataka", x: 39, y: 72, outputLakhs: 1007063, outputShare: 5.72, rank: 6, fibreProfile: "No verified state-wide fibre split was found in the cited national sources.", evidence: "MoSPI reports Karnataka among the ten states contributing the leading 80 percent of registered factory output for NIC 17.", clusters: ["State split unavailable"] },
  { id: "TS", name: "Telangana", x: 47, y: 65, outputLakhs: 877769, outputShare: 4.98, rank: 7, fibreProfile: "No verified state-wide fibre split was found in the cited national sources.", evidence: "MoSPI reports Telangana among the ten states contributing the leading 80 percent of registered factory output for NIC 17.", clusters: ["State split unavailable"] },
  { id: "HR", name: "Haryana", x: 42, y: 28, outputLakhs: 771296, outputShare: 4.38, rank: 8, fibreProfile: "Wood, agro-residue and recovered-fibre categories appear in the CPCB basin inventory. State-specific shares are not stated.", evidence: "Haryana is within CPCB's main-stem Ganga and Yamuna industry inventory.", clusters: ["CPCB basin inventory"] },
  { id: "PB", name: "Punjab", x: 36, y: 24, outputLakhs: 770346, outputShare: 4.37, rank: 9, fibreProfile: "No verified state-wide fibre split was found in the cited national sources.", evidence: "MoSPI reports Punjab among the ten states contributing the leading 80 percent of registered factory output for NIC 17.", clusters: ["State split unavailable"] },
  { id: "RJ", name: "Rajasthan", x: 31, y: 37, outputLakhs: 663819, outputShare: 3.77, rank: 10, fibreProfile: "No verified state-wide fibre split was found in the cited national sources.", evidence: "MoSPI reports Rajasthan among the ten states contributing the leading 80 percent of registered factory output for NIC 17.", clusters: ["State split unavailable"] },
  { id: "AP", name: "Andhra Pradesh", x: 51, y: 71, fibreProfile: "The cited census does not provide a state-wide fibre split.", evidence: "CPPRI identifies Andhra Pradesh among the states containing major paper-sector players. It is not in MoSPI's listed states that together make up the leading 80 percent of NIC 17 output.", clusters: ["Major mill presence"] },
];

export const indiaPaperTrend = [
  { year: "2016 to 2017", capacity: 20.65, production: 16.91, consumption: 20.18 },
  { year: "2017 to 2018", capacity: 22.11, production: 18.91, consumption: 21.166 },
  { year: "2018 to 2019", capacity: 21.9, production: 19.36, consumption: 20.7 },
  { year: "2019 to 2020", capacity: 23.99, production: 21.36, consumption: 22.83 },
] as const;

export const indiaFibreMix = [
  { label: "Recovered fibre", tonnes: 16296739, share: 76.3, color: "#21583c" },
  { label: "Wood", tonnes: 3908160, share: 18.3, color: "#9b704c" },
  { label: "Agro residue", tonnes: 1161943, share: 5.4, color: "#d6ad70" },
] as const;

export const indiaGradeMix = [
  { label: "Kraft paper", tonnes: 11685072, share: 54.7 },
  { label: "Writing and printing", tonnes: 4794272, share: 22.4 },
  { label: "Duplex and board", tonnes: 3440056, share: 16.1 },
  { label: "Newsprint", tonnes: 667726, share: 3.1 },
  { label: "Other grades", tonnes: 516053, share: 2.4 },
  { label: "Tissue", tonnes: 263663, share: 1.2 },
] as const;
