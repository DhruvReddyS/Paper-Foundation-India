export type PaperEverywhereSource = {
  organisation: string;
  title: string;
  year: string;
  url: string;
  note: string;
};

export type PaperEverywhereObject = {
  slug: string;
  number: string;
  title: string;
  category: string;
  image: string;
  alt: string;
  thesis: string;
  introduction: string;
  figure: string;
  figureLabel: string;
  figureContext: string;
  material: string[];
  job: string[];
  afterUse: string[];
  evidenceCheck: string;
  source: PaperEverywhereSource;
};

export const paperEverywhereObjects: PaperEverywhereObject[] = [
  {
    slug: "notebooks",
    number: "01",
    title: "Notebooks",
    category: "Learning",
    image: "/images/everyday/learning-in-paper.jpg",
    alt: "A student writing in a notebook",
    thesis: "A bound stack of sheets becomes an external memory.",
    introduction:
      "A notebook is deliberately quiet technology. It holds sequence, annotation, diagrams and revisions without power or a login. The useful unit is not the blank sheet, but the return visit: finding an earlier idea, adding a margin note and carrying the record forward.",
    figure: "24.8 crore",
    figureLabel: "students in India’s school system",
    figureContext:
      "UDISE+ recorded nearly 24.8 crore students across 14.72 lakh schools in 2023 to 2024. This is a scale marker for learning infrastructure, not a measure of notebook consumption.",
    material: [
      "Writing paper is selected for opacity, smoothness and controlled ink absorption.",
      "Binding, cover board, lamination and adhesives can change how easily a notebook separates after use.",
      "Recycled content and fresh fibre are both possible inputs. The final grade depends on the performance required.",
    ],
    job: [
      "Keep marks readable on both sides of a sheet.",
      "Survive repeated opening, carrying and handling.",
      "Make information easy to scan, annotate and revisit.",
    ],
    afterUse: [
      "Use the remaining pages before discarding the book.",
      "Remove non-paper covers, spiral wire and plastic pockets where your collector asks for separation.",
      "Keep used notebooks clean and dry for the paper recovery stream.",
    ],
    evidenceCheck:
      "Do not turn student counts into paper-consumption estimates. The official figure proves the scale of the learning system only.",
    source: {
      organisation: "Department of School Education & Literacy, Government of India",
      title: "UDISE+ Report 2023 to 2024",
      year: "2024",
      url: "https://www.education.gov.in/sites/upload_files/mhrd/files/statistics-new/udise_report_nep_23_24.pdf",
      note: "Key Results, All India, page 9",
    },
  },
  {
    slug: "corrugated-boxes",
    number: "02",
    title: "Corrugated boxes",
    category: "Protection",
    image: "/images/everyday/business-in-paper.jpg",
    alt: "A small business packing an order in a corrugated box",
    thesis: "A repeating paper flute turns light sheets into a protective structure.",
    introduction:
      "Corrugated board works through geometry. Fluted paper held between liners resists crushing and creates cushioning space while printed surfaces carry handling and identity information. The box is part structure, part information system and part logistics tool.",
    figure: "IS 2771",
    figureLabel: "the Indian specification cited for corrugated fibreboard boxes",
    figureContext:
      "FSSAI’s 2025 packaging compendium lists IS 2771 Part 1 among the standards for paper and board intended for food contact.",
    material: [
      "Linerboard provides flat faces for strength, closure and printing.",
      "Fluting creates columns and air spaces that resist compression.",
      "Tape, wax, wet-strength treatments and barrier coatings affect repulping and recovery.",
    ],
    job: [
      "Protect a product against stacking, vibration and impact.",
      "Use folds and flute direction to put strength where the journey needs it.",
      "Carry identification, handling and traceability information.",
    ],
    afterUse: [
      "Reuse a sound box before flattening it.",
      "Remove loose plastic, foam and excessive tape where practical.",
      "Keep the board dry and flatten it for collection.",
    ],
    evidenceCheck:
      "A brown colour does not prove recycled content, recyclability or food-contact suitability. Check the specification and the complete pack construction.",
    source: {
      organisation: "Food Safety and Standards Authority of India",
      title: "Food Safety and Standards (Packaging) Regulations, 2018, Version V",
      year: "2025",
      url: "https://fssai.gov.in/upload/uploadfiles/files/Compendium_Packaging_V_%2002-04-2025.pdf",
      note: "General requirements and Schedule I",
    },
  },
  {
    slug: "tissue-and-towels",
    number: "03",
    title: "Tissue and towels",
    category: "Hygiene",
    image: "/images/everyday/hygiene-in-paper.jpg",
    alt: "Paper napkins used in an everyday dining space",
    thesis: "Some paper is engineered for one short, hygienic task.",
    introduction:
      "Tissue grades trade long service life for softness, absorbency and rapid wetting. That brief use can be functional, especially in hygiene settings. It also means the right disposal route is different from a clean office sheet.",
    figure: "Single use",
    figureLabel: "the towel format named in WHO hand-hygiene guidance",
    figureContext:
      "WHO guidance for low-resource community settings identifies clean water, soap and single-use disposable towels as elements of best practice.",
    material: [
      "Low basis weight and creping help create softness and bulk.",
      "Wet strength may be added when a sheet must stay intact while damp.",
      "Lotions, food soil and bodily fluids can make a used sheet unsuitable for ordinary paper recycling.",
    ],
    job: [
      "Absorb liquid quickly.",
      "Create a clean, individual-use surface.",
      "Release easily from a roll, box or dispenser.",
    ],
    afterUse: [
      "Do not place contaminated tissues in the clean paper stream.",
      "Follow local sanitary-waste rules for used hygiene tissue.",
      "Choose the quantity and grade needed for the task, rather than treating every tissue product as interchangeable.",
    ],
    evidenceCheck:
      "Hygiene guidance supports a use case. It does not make every disposable product environmentally preferable in every setting.",
    source: {
      organisation: "World Health Organization",
      title: "Considerations for community hand hygiene practices in low-resource situations",
      year: "2020",
      url: "https://www.who.int/publications-detail-redirect/WPR-DSE-2020-019",
      note: "Normative community guidance",
    },
  },
  {
    slug: "newsprint",
    number: "04",
    title: "Newsprint",
    category: "Public record",
    image: "/images/everyday/newsprint-in-paper.jpg",
    alt: "A newspaper being read at a tea stall",
    thesis: "A low-cost sheet lets a public record travel hand to hand.",
    introduction:
      "Newsprint is designed for speed, reach and efficient reproduction. Its surface, opacity and print behaviour are tuned for high-volume publishing rather than archival permanence. A newspaper’s physical openness lets several readers scan, share and discuss the same edition.",
    figure: "149,809",
    figureLabel: "registered newspapers and magazines",
    figureContext:
      "The Press Registrar General of India dashboard reported this total on 23 May 2026. Registration is not the same as active publication, audited circulation or print readership.",
    material: [
      "Newsprint is a relatively light, economical printing grade.",
      "Opacity matters because dense text is printed on both sides.",
      "Ink, inserts, moisture and collection quality affect the recovered fibre stream.",
    ],
    job: [
      "Carry large amounts of text and imagery at low unit weight.",
      "Run reliably through high-speed presses.",
      "Fold, bundle and move through broad distribution networks.",
    ],
    afterUse: [
      "Keep newspapers dry and separate from food waste.",
      "Reuse clean sheets for packing or protection where appropriate.",
      "Send the remainder into a recognised dry-waste or paper collection route.",
    ],
    evidenceCheck:
      "Never describe registration totals as readership or circulation. These are different measures collected by different systems.",
    source: {
      organisation: "Press Registrar General of India",
      title: "Registered Newspaper and Magazine, Periodicity Wise",
      year: "2026",
      url: "https://egov.rni.nic.in/Webforms/ReportRegdPeriodityWise.aspx",
      note: "Dashboard snapshot dated 23 May 2026",
    },
  },
  {
    slug: "food-contact-paper",
    number: "05",
    title: "Food-contact paper",
    category: "Food service",
    image: "/images/everyday/food-in-paper.jpg",
    alt: "Food being packed in paperboard cartons",
    thesis: "When paper touches food, appearance is not evidence of safety.",
    introduction:
      "Filters, wraps, cups, trays and cartons face different combinations of grease, moisture, heat and contact time. A paper-looking pack may include coatings, laminates or seals, so the full construction matters as much as the fibre layer.",
    figure: "No direct contact",
    figureLabel: "for the printed surface of food packaging",
    figureContext:
      "FSSAI’s packaging regulations state that printing inks must conform to IS 15495 and that the printed surface must not directly contact food.",
    material: [
      "Porosity is useful in a tea filter but a barrier is useful in a greasy wrap.",
      "Coatings and laminates can add liquid or grease resistance.",
      "Food-grade suitability is a regulated performance requirement, not a visual style.",
    ],
    job: [
      "Contain food without changing its safety or quality.",
      "Withstand the mechanical, chemical and thermal stresses of normal use.",
      "Separate the food from printing, handling and the external environment.",
    ],
    afterUse: [
      "Check local instructions for coated or multilayer packs.",
      "Empty and dry accepted cartons before collection.",
      "Do not assume that every paper-looking food pack belongs in the same recovery stream.",
    ],
    evidenceCheck:
      "Words such as natural, kraft or paper do not prove food-contact compliance. Ask for the applicable standard or conformity evidence.",
    source: {
      organisation: "Food Safety and Standards Authority of India",
      title: "Food Safety and Standards (Packaging) Regulations, 2018, Version V",
      year: "2025",
      url: "https://fssai.gov.in/upload/uploadfiles/files/Compendium_Packaging_V_%2002-04-2025.pdf",
      note: "General requirements, clauses 2, 9 and 10",
    },
  },
  {
    slug: "one-rupee-note",
    number: "06",
    title: "The ₹1 note",
    category: "Security paper",
    image: "/images/everyday/currency-paper.jpg",
    alt: "Indian currency notes",
    thesis: "The familiar word paper can hide a specialised textile-fibre substrate.",
    introduction:
      "Currency substrate must tolerate folding, abrasion, skin oils, counting machinery and long circulation while holding fine printing and security features. It belongs to the paper family in everyday language, but it is not ordinary writing paper.",
    figure: "100%",
    figureLabel: "cotton rag content specified for the 2017 ₹1 note",
    figureContext:
      "A Government of India notification reproduced by RBI specifies 100 per cent cotton rag content for the one-rupee currency note.",
    material: [
      "Cotton rag fibre gives the ₹1 note a substrate distinct from common wood-pulp papers.",
      "Security printing and controlled manufacture are integral to the object.",
      "The exact construction of one denomination must not be generalised to every banknote series.",
    ],
    job: [
      "Remain recognisable through repeated handling.",
      "Carry denomination, legal identity and security information.",
      "Work with counting, sorting and authenticity-checking systems.",
    ],
    afterUse: [
      "Do not put damaged currency into household paper recycling.",
      "Banks and RBI issue offices provide formal exchange routes for eligible soiled or mutilated notes.",
      "Treat currency as a controlled public instrument, not ordinary scrap.",
    ],
    evidenceCheck:
      "The 100 per cent figure applies to the notified ₹1 note. It should not be presented as the disclosed composition of every Indian banknote.",
    source: {
      organisation: "Reserve Bank of India",
      title: "Dimensions and paper composition of One Rupee Currency Note",
      year: "2017",
      url: "https://www.rbi.org.in/commonperson/english/scripts/PressReleases.aspx?Id=2346",
      note: "Government notification hosted by RBI",
    },
  },
  {
    slug: "medicine-cartons",
    number: "07",
    title: "Medicine cartons",
    category: "Healthcare",
    image: "/images/everyday/health-in-paper.jpg",
    alt: "Medicine supplied in a paperboard carton",
    thesis: "The outer pack protects a medicine and makes safety information visible.",
    introduction:
      "A pharmaceutical carton is not just a decorative sleeve. It groups the primary pack, supports tamper evidence and gives regulated information enough surface area to remain legible. The leaflet inside extends that information into instructions, warnings and storage conditions.",
    figure: "2024",
    figureLabel: "the current consolidated Drugs Rules edition used here",
    figureContext:
      "CDSCO’s consolidated Drugs Rules, 1945 edition dated 1 July 2024 sets out labelling requirements, including QR or bar-code provisions for specified products.",
    material: [
      "Folding boxboard provides a printable, creaseable secondary pack.",
      "Braille, varnish, foil, labels or tamper seals may add function but also complexity.",
      "The carton is separate from the primary container that directly holds the medicine.",
    ],
    job: [
      "Protect and group the primary medicine pack.",
      "Carry identity, batch, expiry, storage and statutory information.",
      "Make warnings and instructions legible through the supply chain.",
    ],
    afterUse: [
      "Never discard unused medicine with a carton in the clean paper stream.",
      "Remove blister packs, bottles and leaflets if your local system requests separation.",
      "Keep empty, uncontaminated board dry for an accepted paper route.",
    ],
    evidenceCheck:
      "A carton can carry regulated information without being the sterile barrier. Keep secondary packaging and primary packaging roles distinct.",
    source: {
      organisation: "Central Drugs Standard Control Organization",
      title: "The Drugs Rules, 1945, consolidated edition dated 1 July 2024",
      year: "2024",
      url: "https://cdsco.gov.in/opencms/resources/UploadCDSCOWeb/2022/drug_rules/Drugs%20Rules%201945_2024%2009.pdf",
      note: "Government of India consolidated rulebook",
    },
  },
  {
    slug: "paper-bags",
    number: "08",
    title: "Paper bags",
    category: "Retail",
    image: "/images/everyday/craft-in-paper.jpg",
    alt: "A maker working with paper and board",
    thesis: "A bag’s value depends on strength, repeated use and a real collection route.",
    introduction:
      "Paper bags use folds, handles and fibre strength to create a light carrying format. Their performance can be altered by wet-strength chemistry, lamination, windows and reinforced handles. Material choice alone cannot answer how many times a bag will be used or where it will go next.",
    figure: "9.59%",
    figureLabel: "average paper share in a CPCB municipal-waste study",
    figureContext:
      "A CPCB standard operating procedure reports paper at an average 9.59 per cent of municipal waste across selected pilot cities, with a range of 4.8 to 20.7 per cent. It is a study result, not a national recycling rate.",
    material: [
      "Kraft or sack paper is selected for tensile and tear strength.",
      "Handles and reinforcement distribute load through the folded structure.",
      "Plastic windows, lamination and heavy food contamination can change the recovery route.",
    ],
    job: [
      "Carry the intended load without tearing.",
      "Fold flat for efficient storage and transport.",
      "Provide a reusable surface for identity and information.",
    ],
    afterUse: [
      "Reuse a sound bag as many times as its condition allows.",
      "Keep clean bags dry and remove non-paper components where practical.",
      "Use a local dry-waste or paper collection route rather than assuming a bin label guarantees recovery.",
    ],
    evidenceCheck:
      "The CPCB percentage describes the composition of sampled municipal waste. It does not show how much paper was recycled or identify paper bags separately.",
    source: {
      organisation: "Central Pollution Control Board",
      title: "Standard Operating Procedure with municipal-waste composition in 20 cities",
      year: "2024",
      url: "https://cpcb.nic.in/uploads/plasticwaste/SOP_PWM_24062024.pdf",
      note: "Figure 7 and Table 8",
    },
  },
  {
    slug: "textbooks",
    number: "09",
    title: "Textbooks",
    category: "Long life",
    image: "/images/knowledge/articles/zero-paper-waste-campuses.jpg",
    alt: "Students using books and paper in a classroom",
    thesis: "The most resourceful book is one designed to be read, repaired and passed on.",
    introduction:
      "A textbook coordinates typography, illustration, page sequence and binding for repeated learning. Unlike a short-lived handout, it can serve many reading sessions and sometimes several readers. Durability is therefore part of material efficiency.",
    figure: "14.72 lakh",
    figureLabel: "schools recorded by UDISE+ in 2023 to 2024",
    figureContext:
      "The national school database recorded nearly 14.72 lakh schools and more than 98 lakh teachers. The figures establish system scale, not the number of books printed.",
    material: [
      "Text paper balances opacity, readability, weight and print reproduction.",
      "Binding style determines whether pages survive repeated opening and repair.",
      "Covers protect the text block but films and complex laminates can complicate separation.",
    ],
    job: [
      "Keep a long sequence of information navigable.",
      "Survive repeated reading, transport and annotation.",
      "Hold consistent diagrams, type and page references across a class.",
    ],
    afterUse: [
      "Repair, donate or pass on a usable edition.",
      "Confirm that the content is still current before reuse.",
      "Separate unsuitable covers or inserts when required by the collector.",
    ],
    evidenceCheck:
      "School counts demonstrate reach. They cannot be multiplied by an assumed books-per-student figure without a documented procurement dataset.",
    source: {
      organisation: "Department of School Education & Literacy, Government of India",
      title: "UDISE+ Report 2023 to 2024",
      year: "2024",
      url: "https://www.education.gov.in/sites/upload_files/mhrd/files/statistics-new/udise_report_nep_23_24.pdf",
      note: "Key Results, All India, page 9",
    },
  },
];

export function getPaperEverywhereObject(slug: string) {
  return paperEverywhereObjects.find((item) => item.slug === slug);
}
