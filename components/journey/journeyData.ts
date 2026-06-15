export type JourneySpread = {
  id: number;
  chapter: string;
  title: string;
  body: string[];
  stat?: string;
  statLabel?: string;
  image: string;
  accent: string;
};

export const journeySpreads: JourneySpread[] = [
  {
    id: 1,
    chapter: "Prologue",
    title: "The blank page",
    body: [
      "Before it carries a sketch, a medicine box, a school lesson or tomorrow's idea, paper begins as possibility.",
      "This is the story inside one sheet—and the many lives that can follow it.",
    ],
    image: "/images/journey/spreads/spread1.jpg",
    accent: "#d7b466",
  },
  {
    id: 2,
    chapter: "Chapter I",
    title: "A sheet returns",
    body: [
      "Used newspapers, cartons, notebooks and office paper do not become waste the moment we finish with them.",
      "Collection gives useful fibre another route forward.",
    ],
    stat: "RECOVER",
    statLabel: "Keep clean paper dry and in the collection loop",
    image: "/images/journey/spreads/spread2.jpg",
    accent: "#8ca879",
  },
  {
    id: 3,
    chapter: "Chapter II",
    title: "Every grade has a destination",
    body: [
      "Recovered paper is separated by fibre quality, colour, coating and contamination.",
      "Corrugated boxes, office sheets and newspapers behave differently in a mill, so careful sorting protects the next sheet.",
    ],
    stat: "SORT",
    statLabel: "Better separation means cleaner recovered fibre",
    image: "/images/journey/spreads/spread3.jpg",
    accent: "#b98a5d",
  },
  {
    id: 4,
    chapter: "Chapter III",
    title: "Back to fibre",
    body: [
      "Water and mechanical action loosen the bonds holding the old sheet together.",
      "Ink and unwanted materials are screened away while cellulose fibres scatter, swirl and wait to become useful again.",
    ],
    stat: "PULP",
    statLabel: "The sheet disappears; its fibres remain",
    image: "/images/journey/spreads/spread4.jpg",
    accent: "#d6a84f",
  },
  {
    id: 5,
    chapter: "Chapter IV",
    title: "Fresh fibre has a role",
    body: [
      "Fibres shorten and some are lost through repeated use and recovery. A working circular system therefore needs responsibly sourced fresh fibre too.",
      "The important question is not simply whether a tree was involved, but where the fibre came from and how the landscape was managed.",
    ],
    stat: "SOURCE",
    statLabel: "Responsible forestry and agricultural residues matter",
    image: "/images/journey/spreads/spread5.jpg",
    accent: "#6f936a",
  },
  {
    id: 6,
    chapter: "Chapter V",
    title: "Where fibres learn teamwork",
    body: [
      "Recovered and fresh fibres are blended for the strength, formation and surface a product needs.",
      "Refining opens the fibre surface so thousands of tiny bonds can hold the new sheet together.",
    ],
    stat: "75 / 25",
    statLabel: "India's broad fibre mix is led by recovered paper",
    image: "/images/journey/spreads/spread6.jpg",
    accent: "#c79352",
  },
  {
    id: 7,
    chapter: "Chapter VI",
    title: "A river becomes a sheet",
    body: [
      "The fibre suspension reaches a moving wire as mostly water. Drainage begins, rollers press, heated cylinders dry and finishing rolls smooth the surface.",
      "What entered as a dilute flow leaves as a continuous reel of paper.",
    ],
    stat: "FORM",
    statLabel: "Drain · press · dry · finish",
    image: "/images/journey/spreads/spread7.jpg",
    accent: "#d6a84f",
  },
  {
    id: 8,
    chapter: "Chapter VII",
    title: "Made for a purpose",
    body: [
      "The same fibre science can produce a notebook, carton, tissue, label, filter or protective package.",
      "Good design uses no more material than the job requires and keeps recovery in mind from the beginning.",
    ],
    stat: "DESIGN",
    statLabel: "Fit for purpose, ready for recovery",
    image: "/images/journey/spreads/spread8.jpg",
    accent: "#8ca879",
  },
  {
    id: 9,
    chapter: "Chapter VIII",
    title: "Knowledge takes form",
    body: [
      "A sheet becomes a place to remember, explain, certify, protect and imagine.",
      "The value of paper is not only in the fibre itself, but in what people are able to do with it.",
    ],
    stat: "USE",
    statLabel: "Ideas become durable, portable and human",
    image: "/images/journey/spreads/spread9.jpg",
    accent: "#d7b466",
  },
  {
    id: 10,
    chapter: "Chapter IX",
    title: "Not every ending is the same",
    body: [
      "Clean, recoverable paper can return to a mill. Contamination, unsuitable combinations and poor collection can break that route.",
      "Circularity is built by decisions made at design, use and disposal—not by a material label alone.",
    ],
    stat: "RETURN",
    statLabel: "Keep useful fibre moving",
    image: "/images/journey/spreads/spread10.jpg",
    accent: "#b98a5d",
  },
  {
    id: 11,
    chapter: "Finale",
    title: "One sheet. Many lives.",
    body: [
      "Paper is not automatically sustainable and it is not automatically harmful.",
      "Source it responsibly. Design it intelligently. Use it well. Recover it whenever the fibre can serve again.",
    ],
    stat: "CONTINUE",
    statLabel: "The next page belongs to all of us",
    image: "/images/journey/spreads/spread11.jpg",
    accent: "#d6a84f",
  },
];

export const journeyTotal = journeySpreads.length + 1;
