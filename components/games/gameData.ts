export type QuizQuestion = {
  question: string;
  answers: string[];
  correct: number;
  explanation: string;
  source: string;
  sourceLabel: string;
};

export const quizQuestions: QuizQuestion[] = [
  {
    question: "What is the paper used for Indian banknotes made from?",
    answers: ["Wood pulp", "100% cotton", "Recycled newspaper", "Bamboo only"],
    correct: 1,
    explanation: "The Reserve Bank of India states that current Indian banknote paper is made using 100% cotton.",
    source: "https://www.rbi.org.in/commonperson/english/scripts/FAQs.aspx?Id=3158",
    sourceLabel: "Reserve Bank of India",
  },
  {
    question: "Which statement about fresh fibre is the most accurate?",
    answers: [
      "It always comes from old-growth forests",
      "It is never needed in recycling",
      "It can replenish fibres lost after repeated recycling",
      "It cannot be responsibly sourced",
    ],
    correct: 2,
    explanation: "Paper fibres shorten and some are lost during use and recycling, so responsibly sourced fresh fibre helps keep the loop working.",
    source: "https://www.cepi.org/wp-content/uploads/2022/10/PPCG-MG-22-030_Cepi-position-paper.pdf",
    sourceLabel: "CEPI fibre-loop guidance",
  },
  {
    question: "Why can a coated paper package be harder to recycle?",
    answers: [
      "Paper has no fibres",
      "Barrier layers may be difficult to separate",
      "Its colour is too bright",
      "All coatings dissolve instantly",
    ],
    correct: 1,
    explanation: "Functional coatings and laminates can complicate fibre separation. Recyclability depends on the package design and local recycling system.",
    source: "https://www.cepi.org/wp-content/uploads/2020/10/Cepi_recyclability-guidelines.pdf",
    sourceLabel: "CEPI recyclability guidelines",
  },
  {
    question: "Which everyday object can use a cellulose-based paper component?",
    answers: ["Car air filter", "Glass bottle", "Steel spoon", "Ceramic tile"],
    correct: 0,
    explanation: "Pleated cellulose filter media is commonly used to trap particles while allowing air to pass through.",
    source: "https://en.wikipedia.org/wiki/Air_filter",
    sourceLabel: "Air-filter reference",
  },
  {
    question: "What should happen to a clean, dry corrugated box after use?",
    answers: ["Burn it", "Keep it out of collection", "Flatten and recover it", "Soak it first"],
    correct: 2,
    explanation: "Clean, dry corrugated board is a valuable recovered-paper grade. Flattening it makes collection and transport easier.",
    source: "https://www.cepi.org/simple-paper-recycling-rules-from-the-erpc/",
    sourceLabel: "European recovered-paper guidance",
  },
  {
    question: "What makes a paper choice responsible?",
    answers: [
      "The word paper on the label",
      "Source, design, efficient use and recovery together",
      "Using the thickest sheet available",
      "Never using recycled fibre",
    ],
    correct: 1,
    explanation: "No material is automatically sustainable. Responsible sourcing, fit-for-purpose design, efficient use and recovery determine the outcome.",
    source: "https://www.fao.org/sustainable-forest-management/toolbox/modules/management-of-planted-forests/further-learning/en/",
    sourceLabel: "FAO sustainable forest management",
  },
];

export type TruthClaim = {
  claim: string;
  verdict: "myth" | "fact" | "context";
  explanation: string;
  repair?: string;
  evidence: string;
  source: string;
};

export const truthClaims: TruthClaim[] = [
  {
    claim: "Paper is always sustainable.",
    verdict: "context",
    explanation: "Paper's outcome depends on fibre source, product design, manufacturing efficiency, use and end-of-life recovery.",
    repair: "Responsibly sourced, fit-for-purpose and recovered paper can support a circular material system.",
    evidence: "Lifecycle conditions matter more than a one-word material label.",
    source: "https://www.cepi.org/wp-content/uploads/2020/10/Cepi_recyclability-guidelines.pdf",
  },
  {
    claim: "Indian banknote paper is made using 100% cotton.",
    verdict: "fact",
    explanation: "RBI's public banknote FAQ confirms that the paper currently used for Indian banknotes is made using 100% cotton.",
    evidence: "This is a direct statement from India's central bank.",
    source: "https://www.rbi.org.in/commonperson/english/scripts/FAQs.aspx?Id=3158",
  },
  {
    claim: "Every paper package belongs in every paper-recycling bin.",
    verdict: "myth",
    explanation: "Food contamination, wax, plastic laminates and some barrier coatings can make recovery difficult or unsuitable in a local system.",
    repair: "Check whether the package is clean and accepted by your local collection system.",
    evidence: "Recyclability depends on design and available mill technology.",
    source: "https://www.cepi.org/wp-content/uploads/2020/10/Cepi_recyclability-guidelines.pdf",
  },
  {
    claim: "Fresh fibre is automatically evidence of deforestation.",
    verdict: "context",
    explanation: "Fresh fibre can come from responsibly managed planted forests, but sourcing and land-management evidence must be checked.",
    repair: "Fresh fibre is not automatically harmful; its source and forest-management practices determine the impact.",
    evidence: "FAO maintains guidance for sustainable management of planted forests.",
    source: "https://www.fao.org/sustainable-forest-management/toolbox/modules/management-of-planted-forests/further-learning/en/",
  },
  {
    claim: "Digital communication has no material environmental footprint.",
    verdict: "myth",
    explanation: "Digital services rely on devices, networks, data centres and electricity. Comparing paper and digital requires a defined use case and lifecycle.",
    repair: "Digital and paper systems both have impacts; responsible choices depend on how each is produced and used.",
    evidence: "A fair comparison needs boundaries, duration and user behaviour.",
    source: "https://www.iea.org/energy-system/buildings/data-centres-and-data-transmission-networks",
  },
];

export const millProducts = [
  {
    id: "notebook",
    name: "Everyday notebook",
    brief: "Smooth enough to write on, strong enough to erase and turn repeatedly.",
    icon: "✎",
    targets: { recycled: 55, refining: 72, pressing: 66, drying: 60 },
  },
  {
    id: "carton",
    name: "Delivery carton",
    brief: "High recycled content, structural strength and a reliable fold.",
    icon: "□",
    targets: { recycled: 88, refining: 48, pressing: 82, drying: 68 },
  },
  {
    id: "tissue",
    name: "Soft tissue",
    brief: "Light, absorbent and soft without falling apart too soon.",
    icon: "≈",
    targets: { recycled: 32, refining: 38, pressing: 28, drying: 52 },
  },
] as const;

export const millSteps = [
  "Sort fibre",
  "Make pulp",
  "Clean pulp",
  "Refine fibres",
  "Form sheet",
  "Press water",
  "Dry sheet",
  "Finish reel",
];

export type HiddenProduct = {
  name: string;
  image: string;
  clues: string[];
  options: string[];
  whyPaper: string;
  reveal: string;
  source: string;
  credit: string;
};

export const hiddenProducts: HiddenProduct[] = [
  {
    name: "Tea bag",
    image: "/images/games/hidden-paper/tea-bag.jpg",
    clues: [
      "I spend my working life in hot water.",
      "I must let flavour through while holding small particles back.",
      "My sheet needs wet strength and controlled porosity.",
      "A string and a small tag are often attached to me.",
    ],
    options: ["Tea bag", "Coffee cup sleeve", "Medical mask", "Receipt roll"],
    whyPaper: "Porous filter paper allows water and flavour compounds to move through while containing tea leaves.",
    reveal: "A familiar object whose performance depends on a carefully engineered fibre web.",
    source: "https://en.wikipedia.org/wiki/Tea_bag",
    credit: "Jan Mesaros / Wikimedia Commons / CC0",
  },
  {
    name: "Speaker cone",
    image: "/images/games/hidden-paper/speaker-cone.jpg",
    clues: [
      "I move thousands of times, but usually stay in one place.",
      "My stiffness and low mass shape what you hear.",
      "I turn electrical signals into vibrations in the air.",
      "You can find me behind the grille of a loudspeaker.",
    ],
    options: ["Speaker cone", "Lamp shade", "Paper fan", "Camera shutter"],
    whyPaper: "Paper pulp can be formed into a light, stiff cone with useful acoustic damping.",
    reveal: "Paper has been used in loudspeaker diaphragms for generations because it balances mass, stiffness and damping.",
    source: "https://en.wikipedia.org/wiki/Loudspeaker",
    credit: "Public-domain archival photograph / Wikimedia Commons",
  },
  {
    name: "Coffee filter",
    image: "/images/games/hidden-paper/coffee-filter.jpg",
    clues: [
      "I separate a liquid from fine roasted particles.",
      "My pores control clarity and flow speed.",
      "I am folded into a cone or basket before use.",
      "A morning drink passes through me.",
    ],
    options: ["Coffee filter", "Cup coaster", "Baking paper", "Envelope liner"],
    whyPaper: "Filter paper offers controlled porosity, wet strength and a neutral surface for brewing.",
    reveal: "The fibre structure controls extraction speed while trapping grounds.",
    source: "https://en.wikipedia.org/wiki/Coffee_filter",
    credit: "Public domain / Wikimedia Commons",
  },
  {
    name: "Sandpaper",
    image: "/images/games/hidden-paper/sandpaper.jpg",
    clues: [
      "My useful side is intentionally rough.",
      "I remove tiny pieces from wood, paint or metal.",
      "A flexible backing holds thousands of abrasive grains.",
      "Despite my name, modern versions rarely contain actual sand.",
    ],
    options: ["Sandpaper", "Roofing felt", "Carbon paper", "Wallpaper"],
    whyPaper: "Strong paper can act as a flexible backing that carries bonded abrasive particles.",
    reveal: "Paper is not only a printable surface; it can also be an engineered structural backing.",
    source: "https://en.wikipedia.org/wiki/Sandpaper",
    credit: "Public domain / Wikimedia Commons",
  },
  {
    name: "Moulded-fibre egg carton",
    image: "/images/games/hidden-paper/egg-carton.jpg",
    clues: [
      "My shape protects several fragile objects at once.",
      "I am formed wet, then dried into a rigid three-dimensional shape.",
      "My peaks absorb shocks and keep neighbours apart.",
      "You usually meet me in a grocery store.",
    ],
    options: ["Egg carton", "Seed tray", "Drink carrier", "Tool insert"],
    whyPaper: "Recovered fibre pulp can be moulded into protective shapes with cushioning and nesting performance.",
    reveal: "Moulded fibre turns recovered paper into a protective three-dimensional product.",
    source: "https://en.wikipedia.org/wiki/Egg_carton",
    credit: "Public domain / Wikimedia Commons",
  },
];
