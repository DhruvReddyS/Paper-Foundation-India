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
  {
    question: "What happens to paper fibres each time they are recycled?",
    answers: [
      "They grow longer and stronger",
      "They shorten and some are lost",
      "They stay exactly the same",
      "They turn into plastic",
    ],
    correct: 1,
    explanation: "Mechanical and chemical handling shortens cellulose fibres and removes fines, which is why a recycling system still needs some fresh fibre entering it.",
    source: "https://www.cepi.org/wp-content/uploads/2022/10/PPCG-MG-22-030_Cepi-position-paper.pdf",
    sourceLabel: "CEPI fibre-loop guidance",
  },
  {
    question: "In a paper machine, what does the forming wire actually do?",
    answers: [
      "It heats the pulp",
      "It drains water so a sheet forms",
      "It prints the final surface",
      "It bleaches the fibre",
    ],
    correct: 1,
    explanation: "The wire is a moving permeable belt. Water drains through it while fibres stay on the surface and begin to bond into a continuous wet web.",
    source: "https://en.wikipedia.org/wiki/Paper_machine",
    sourceLabel: "Paper machine reference",
  },
  {
    question: "What does the recovered-paper grade \"OCC\" refer to?",
    answers: [
      "Office copier card",
      "Old corrugated containers",
      "Oxygen-cleaned cellulose",
      "Overprinted coated card",
    ],
    correct: 1,
    explanation: "OCC is the recovered-paper grade made up of used corrugated boxes. It is one of the most widely traded recovered fibre grades in the world.",
    source: "https://en.wikipedia.org/wiki/Paper_recycling",
    sourceLabel: "Paper recycling reference",
  },
  {
    question: "Why is deinking used when recycling printed paper?",
    answers: [
      "To add colour to the pulp",
      "To separate ink particles from the fibre",
      "To make the fibres longer",
      "To waterproof the sheet",
    ],
    correct: 1,
    explanation: "Deinking detaches and removes ink particles from the pulp so the recovered fibre can be used in grades that need higher brightness.",
    source: "https://en.wikipedia.org/wiki/Deinking",
    sourceLabel: "Deinking reference",
  },
  {
    question: "Which agricultural residue is used as a papermaking raw material?",
    answers: ["Bagasse from sugarcane", "Cement dust", "Crushed glass", "Scrap aluminium"],
    correct: 0,
    explanation: "Bagasse, the fibrous residue left after sugarcane is crushed for juice, is one of several non-wood raw materials used in pulp and paper production.",
    source: "https://en.wikipedia.org/wiki/Bagasse",
    sourceLabel: "Bagasse reference",
  },
  {
    question: "Which of these makes a used paper package harder to recycle?",
    answers: [
      "Being flattened before collection",
      "Being clean and dry",
      "Heavy food residue and grease",
      "Being printed with text",
    ],
    correct: 2,
    explanation: "Food residue and grease contaminate the recovered fibre stream. Printing alone is not the obstacle, because ink can be removed during deinking.",
    source: "https://www.cepi.org/simple-paper-recycling-rules-from-the-erpc/",
    sourceLabel: "European recovered-paper guidance",
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
  {
    claim: "Recycling paper means no new trees are ever needed.",
    verdict: "myth",
    explanation: "Fibres shorten and are lost at every pass, so a recycling system needs a continuing input of fresh fibre to stay viable.",
    repair: "Recycling reduces how much fresh fibre is needed, but it cannot replace it entirely.",
    evidence: "Fibre loss per cycle is a documented constraint of the recovered-paper loop.",
    source: "https://www.cepi.org/wp-content/uploads/2022/10/PPCG-MG-22-030_Cepi-position-paper.pdf",
  },
  {
    claim: "Paper can be recycled an unlimited number of times with no change in quality.",
    verdict: "myth",
    explanation: "Each pass shortens fibres and reduces strength, which is why recovered fibre is directed to grades that suit its condition.",
    repair: "Paper is recyclable many times, and the fibre is graded to what it can still do well.",
    evidence: "Fibre shortening is why recovered grades are matched to end uses.",
    source: "https://en.wikipedia.org/wiki/Paper_recycling",
  },
  {
    claim: "A greasy food box belongs in the paper recycling stream.",
    verdict: "myth",
    explanation: "Oils and food residue contaminate recovered fibre and can spoil a whole batch. Clean, dry board is the recoverable part.",
    repair: "Recover the clean, dry sections and keep heavily soiled board out of the paper stream.",
    evidence: "Contamination limits are set by what mills can process.",
    source: "https://www.cepi.org/simple-paper-recycling-rules-from-the-erpc/",
  },
  {
    claim: "Planting trees for paper always damages biodiversity.",
    verdict: "context",
    explanation: "Outcomes depend on what land was converted, how the forest is managed and what was there before. Planted forests can be managed well or badly.",
    repair: "The land-use history and management practice decide the outcome, not the fact of planting alone.",
    evidence: "FAO maintains management guidance precisely because practice varies.",
    source: "https://www.fao.org/sustainable-forest-management/toolbox/modules/management-of-planted-forests/further-learning/en/",
  },
  {
    claim: "Paper is only used for printing and packaging.",
    verdict: "myth",
    explanation: "Engineered paper and cellulose webs appear in filters, tea bags, loudspeaker cones, abrasives, insulation and medical products.",
    repair: "Paper is a family of engineered fibre materials, and printing is only one of its uses.",
    evidence: "Functional paper grades are designed for strength, porosity and wet performance.",
    source: "https://en.wikipedia.org/wiki/Paper",
  },
];

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
    name: "Egg carton",
    image: "/images/games/hidden-paper/egg-carton.jpg",
    clues: [
      "My shape protects several fragile objects at once.",
      "I am formed wet, then dried into a rigid three-dimensional shape.",
      "My peaks absorb shocks and keep neighbours apart.",
      "You usually meet me in a grocery store.",
    ],
    options: ["Egg carton", "Seed tray", "Drink carrier", "Tool insert"],
    whyPaper: "Recovered fibre pulp can be moulded into protective shapes with cushioning and nesting performance.",
    reveal: "A moulded-fibre carton: recovered paper pulp pressed into a protective three-dimensional shape.",
    source: "https://en.wikipedia.org/wiki/Egg_carton",
    credit: "Public domain / Wikimedia Commons",
  },
  {
    name: "Air filter",
    image: "/images/games/hidden-paper/air-filter.jpg",
    clues: [
      "I am folded many times so I can do more work in a small space.",
      "I must stop particles without stopping the flow.",
      "My pleats are a cellulose sheet treated to resist moisture.",
      "An engine or a room breathes through me.",
    ],
    options: ["Air filter", "Window blind", "Paper fan", "Book spine"],
    whyPaper: "Pleated cellulose media gives a large filtering surface in a small housing while keeping airflow resistance low.",
    reveal: "The folds are the engineering. They multiply surface area without increasing the space the filter occupies.",
    source: "https://en.wikipedia.org/wiki/Air_filter",
    credit: "Wikimedia Commons / CC BY-SA 4.0",
  },
  {
    name: "Paper cone tweeter",
    image: "/images/games/hidden-paper/tweeter.jpg",
    clues: [
      "I am small, and I handle the highest notes you hear.",
      "My job needs the least possible mass and useful damping.",
      "My cone is formed from pulp, not moulded plastic.",
      "I sit next to a larger driver in a loudspeaker cabinet.",
    ],
    options: ["Paper cone tweeter", "Metal whistle", "Camera lens", "Door handle"],
    whyPaper: "Formed pulp is light and stiff, and it damps unwanted resonance in a way many synthetic cones do not.",
    reveal: "High-frequency drivers were built from paper long before synthetic cones, and the material is still chosen for its damping.",
    source: "https://en.wikipedia.org/wiki/Loudspeaker",
    credit: "Wikimedia Commons / CC BY-SA 4.0",
  },
];
