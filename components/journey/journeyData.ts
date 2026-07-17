export type JourneyImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type JourneySpread = {
  id: number;
  chapter: string;
  eyebrow: string;
  processStep: string;
  title: string;
  body: string[];
  stat?: string;
  statLabel?: string;
  image: string;
  images: JourneyImage[];
  accent: string;
};

/**
 * Editorial model for the Paper Journey book.
 *
 * Each spread explains one real process decision without implying that every
 * paper grade or mill follows an identical recipe. The first image remains as
 * `image` for backwards compatibility; `images` lets the book compose richer
 * right-hand pages when the new spread layout is available.
 */
export const journeySpreads: JourneySpread[] = [
  {
    id: 1,
    chapter: "Opening note",
    eyebrow: "Follow the fibre",
    processStep: "Orientation",
    title: "A sheet begins before the paper machine",
    body: [
      "Paper is made from cellulose fibre, water, energy and carefully chosen process inputs. Its route can begin with responsibly sourced fresh fibre, recovered paper, or a blend selected for the product.",
      "No single recipe describes every sheet. This book follows the main decisions that turn separated fibre into paper—and help useful fibre return.",
    ],
    stat: "LOOK CLOSER",
    statLabel: "Every grade begins with a purpose and a fibre plan",
    image: "/images/journey/spreads-v2/spread1.jpg",
    images: [
      {
        src: "/images/journey/spreads-v2/spread1.jpg",
        alt: "A single sheet of paper revealing a subtle network of cellulose fibres",
        caption: "The visible sheet begins with an invisible fibre structure.",
      },
    ],
    accent: "#c99b4f",
  },
  {
    id: 2,
    chapter: "Chapter I",
    eyebrow: "Fibre enters the story",
    processStep: "Source + recover",
    title: "Two routes bring fibre to the mill",
    body: [
      "Fresh fibre may come from wood grown in responsibly managed forests and plantations, or from suitable non-wood sources such as agricultural residues. Traceability and landscape management matter.",
      "Recovered fibre begins with used paper kept dry, collected and directed to an appropriate recycling stream. Both routes must match the quality and performance the next product needs.",
    ],
    stat: "START WELL",
    statLabel: "Ask where fibre came from and where the used sheet can go",
    image: "/images/journey/spreads-v2/spread5.jpg",
    images: [
      {
        src: "/images/journey/spreads-v2/spread5.jpg",
        alt: "Responsibly managed fibre source beside neatly collected recovered paper",
        caption: "Fresh and recovered fibre can serve different, complementary roles.",
      },
      {
        src: "/images/journey/spreads-v2/spread2.jpg",
        alt: "Clean recovered paper sorted into mill-ready bales",
      },
    ],
    accent: "#6f8f68",
  },
  {
    id: 3,
    chapter: "Chapter II",
    eyebrow: "Quality begins outside the pulper",
    processStep: "Collect + sort",
    title: "Paper grades travel in separate streams",
    body: [
      "Used corrugated boxes, newspapers, office sheets and coated papers contain different fibres and process inputs. Recovery systems collect and grade them so a mill receives material suited to its recipe.",
      "Food residue, liquids, plastic films and other unwanted materials reduce yield and can disrupt production. Clean separation protects both the fibre and the equipment.",
    ],
    stat: "KEEP IT CLEAN",
    statLabel: "Dry, correctly separated paper is easier to recover",
    image: "/images/journey/spreads-v2/spread3.jpg",
    images: [
      {
        src: "/images/journey/spreads-v2/spread3.jpg",
        alt: "Several grades of recovered paper being carefully sorted",
        caption: "A bale is not simply 'waste paper'; its grade guides what it can become.",
      },
      {
        src: "/images/journey/spreads-v2/spread2.jpg",
        alt: "Close views of corrugated, newspaper and office-paper fibre grades",
      },
    ],
    accent: "#a9754f",
  },
  {
    id: 4,
    chapter: "Chapter III",
    eyebrow: "The old sheet lets go",
    processStep: "Pulp",
    title: "Water and motion release the fibres",
    body: [
      "In a pulper, recovered paper is mixed with water and agitated until the old sheet breaks apart into a pumpable fibre suspension. Large unwanted items can be removed during this stage.",
      "Fresh-fibre pulps reach the mill through a different preparation route, then are dispersed and adjusted for the grade being made.",
    ],
    stat: "DISPERSE",
    statLabel: "The sheet disappears; usable fibres remain",
    image: "/images/journey/spreads-v2/spread4.jpg",
    images: [
      {
        src: "/images/journey/spreads-v2/spread4.jpg",
        alt: "Paper fibres swirling in a mill pulper",
        caption: "Mechanical action separates the network without dissolving the fibre.",
      },
      {
        src: "/images/journey/spreads-v2/spread6.jpg",
        alt: "Macro view of cellulose fibres suspended in water",
      },
    ],
    accent: "#c89a55",
  },
  {
    id: 5,
    chapter: "Chapter IV",
    eyebrow: "Remove what does not belong",
    processStep: "Screen + clean",
    title: "The fibre stream is cleaned in stages",
    body: [
      "Screens separate contaminants by size and shape, while cleaners can use differences in density to remove grit, metals, plastics and other unwanted material.",
      "The exact sequence depends on the incoming furnish and the paper grade. Removed material is managed separately; not everything entering a recycling mill becomes new paper.",
    ],
    stat: "PROTECT THE SHEET",
    statLabel: "Cleaner furnish supports stable production and better quality",
    image: "/images/journey/spreads-v2/spread6.jpg",
    images: [
      {
        src: "/images/journey/spreads-v2/spread6.jpg",
        alt: "A clean fibre stream passing through industrial screening equipment",
        caption: "Different separation methods target different contaminants.",
      },
      {
        src: "/images/journey/spreads-v2/spread4.jpg",
        alt: "Detailed view of a pressure screen separating fibre from debris",
      },
      {
        src: "/images/journey/spreads-v2/spread1.jpg",
        alt: "Cleaned paper fibre suspension after screening",
      },
    ],
    accent: "#78938a",
  },
  {
    id: 6,
    chapter: "Chapter V",
    eyebrow: "Only when the grade requires it",
    processStep: "Deink + brighten",
    title: "Printed fibre may need another cleaning route",
    body: [
      "For grades that require cleaner or brighter recovered pulp, ink can be detached from fibres and removed by flotation, washing or a combination of processes.",
      "Not every recycled product needs deinking or high brightness. Avoiding unnecessary treatment can conserve resources when a naturally coloured sheet will do the job.",
    ],
    stat: "FIT FOR PURPOSE",
    statLabel: "Process only as far as the next paper grade requires",
    image: "/images/journey/spreads-v2/spread6.jpg",
    images: [
      {
        src: "/images/journey/spreads-v2/spread6.jpg",
        alt: "Ink particles separating from recovered paper fibre during flotation",
        caption: "Air bubbles can carry detached ink away from the fibre suspension.",
      },
      {
        src: "/images/journey/spreads-v2/spread4.jpg",
        alt: "Recovered pulp shown before and after deinking",
      },
    ],
    accent: "#9b8f72",
  },
  {
    id: 7,
    chapter: "Chapter VI",
    eyebrow: "Build the recipe",
    processStep: "Refine + blend",
    title: "Fibres are prepared to work together",
    body: [
      "Refining changes the fibre surface so fibres can bond more effectively when the sheet dries. Too little or too much refining can alter strength, drainage and formation.",
      "Papermakers blend fibre types and add process or functional ingredients according to the required strength, printability, absorbency, colour and durability.",
    ],
    stat: "BALANCE",
    statLabel: "Performance comes from a controlled furnish—not one fibre alone",
    image: "/images/journey/spreads-v2/spread6.jpg",
    images: [
      {
        src: "/images/journey/spreads-v2/spread6.jpg",
        alt: "Papermaking fibres being refined and blended in a controlled mill process",
        caption: "The furnish is the fibre-and-water recipe prepared for the machine.",
      },
      {
        src: "/images/journey/spreads-v2/spread4.jpg",
        alt: "Scientific macro illustration of refined cellulose fibres bonding",
      },
    ],
    accent: "#8e704f",
  },
  {
    id: 8,
    chapter: "Chapter VII",
    eyebrow: "The sheet appears",
    processStep: "Form",
    title: "A dilute flow becomes a continuous web",
    body: [
      "The prepared furnish is distributed evenly onto a moving forming fabric. Water drains away as fibres settle, overlap and begin to create a continuous wet web.",
      "Flow, drainage and machine conditions shape formation—the evenness that influences how the finished paper looks and performs.",
    ],
    stat: "FORM",
    statLabel: "Distribute · drain · interlock",
    image: "/images/journey/spreads-v2/spread4.jpg",
    images: [
      {
        src: "/images/journey/spreads-v2/spread4.jpg",
        alt: "A wet paper web forming on the moving wire of a paper machine",
        caption: "The first recognisable sheet is still fragile and wet.",
      },
      {
        src: "/images/journey/spreads-v2/spread6.jpg",
        alt: "Close view of water draining through forming fabric beneath paper fibres",
      },
      {
        src: "/images/journey/spreads-v2/spread1.jpg",
        alt: "A continuous wet paper web leaving the forming section",
      },
    ],
    accent: "#6f9287",
  },
  {
    id: 9,
    chapter: "Chapter VIII",
    eyebrow: "Remove water efficiently",
    processStep: "Press + dry",
    title: "Pressure first, controlled heat next",
    body: [
      "Pressing squeezes water from the wet web and strengthens contact between fibres. The sheet then passes through a controlled drying section where the remaining moisture is removed.",
      "Stable moisture and careful tension are essential: the web must travel quickly without losing its shape, surface or strength.",
    ],
    stat: "DRY WITH CARE",
    statLabel: "Mechanical water removal comes before thermal drying",
    image: "/images/journey/spreads-v2/spread6.jpg",
    images: [
      {
        src: "/images/journey/spreads-v2/spread6.jpg",
        alt: "Paper web moving from press rolls toward heated drying cylinders",
        caption: "Pressing and drying turn a delicate wet web into stable paper.",
      },
      {
        src: "/images/journey/spreads-v2/spread4.jpg",
        alt: "Close view of water leaving paper at a press nip",
      },
      {
        src: "/images/journey/spreads-v2/spread1.jpg",
        alt: "Continuous sheet travelling over paper-machine drying cylinders",
      },
    ],
    accent: "#c2834c",
  },
  {
    id: 10,
    chapter: "Chapter IX",
    eyebrow: "Give the sheet its working surface",
    processStep: "Finish + convert",
    title: "A reel becomes a product",
    body: [
      "Depending on the grade, paper may be sized, coated, calendered or otherwise finished to tune its surface, appearance and performance. The continuous sheet is inspected and wound into large reels.",
      "Converters then cut, print, fold, corrugate or shape it into notebooks, cartons, labels, tissues and many other products.",
    ],
    stat: "MAKE IT USEFUL",
    statLabel: "Finish for the function; avoid complexity without purpose",
    image: "/images/journey/spreads-v2/spread8.jpg",
    images: [
      {
        src: "/images/journey/spreads-v2/spread8.jpg",
        alt: "A finished paper reel beside precisely converted paper products",
        caption: "One machine reel can take many carefully designed forms.",
      },
      {
        src: "/images/journey/spreads-v2/spread6.jpg",
        alt: "Paper surface passing through finishing rolls",
      },
      {
        src: "/images/journey/spreads-v2/spread1.jpg",
        alt: "Paper being cut, folded and converted into useful products",
      },
    ],
    accent: "#a87951",
  },
  {
    id: 11,
    chapter: "Chapter X",
    eyebrow: "The reason for the sheet",
    processStep: "Use",
    title: "Paper carries, protects and communicates",
    body: [
      "A paper product should deliver its function with an appropriate amount of material: protecting goods, recording knowledge, enabling hygiene, carrying information or helping ideas travel.",
      "How it is designed and used affects what happens next. Unnecessary mixed materials, heavy contamination and poor disposal choices can make fibre harder to recover.",
    ],
    stat: "USE WELL",
    statLabel: "Value the function, then keep the recovery route open",
    image: "/images/journey/spreads-v2/spread8.jpg",
    images: [
      {
        src: "/images/journey/spreads-v2/spread8.jpg",
        alt: "Paper serving education, packaging, hygiene and communication",
        caption: "Different uses ask different things of the sheet.",
      },
      {
        src: "/images/journey/spreads-v2/spread2.jpg",
        alt: "A thoughtfully designed paper package being flattened for recovery",
      },
    ],
    accent: "#c59a53",
  },
  {
    id: 12,
    chapter: "Chapter XI",
    eyebrow: "The hand-off after use",
    processStep: "Separate + return",
    title: "A useful next life starts at the bin",
    body: [
      "After use, suitable paper needs to stay clean, dry and separate from food, liquids and mixed materials. That everyday decision protects the fibre before collection begins.",
      "Clear local guidance matters because collection systems and accepted grades differ. A well-designed product still needs the right return route to become useful mill furnish.",
    ],
    stat: "RETURN WELL",
    statLabel: "Keep it clean · follow local guidance · protect the fibre",
    image: "/images/journey/spreads-v2/spread2.jpg",
    images: [
      {
        src: "/images/journey/spreads-v2/spread2.jpg",
        alt: "Clean used paper being separated into the correct collection stream",
        caption: "The recovery route begins with a small, deliberate hand-off.",
      },
      {
        src: "/images/journey/spreads-v2/spread5.jpg",
        alt: "Collected paper kept dry and ready for grading",
      },
    ],
    accent: "#688968",
  },
  {
    id: 13,
    chapter: "Finale",
    eyebrow: "Keep useful fibre moving",
    processStep: "Recover + renew",
    title: "The next sheet begins with connected choices",
    body: [
      "Collected paper is graded and prepared to enter another papermaking cycle when its fibre and condition suit the next product. Yield is never absolute: contaminants are removed and fibres gradually shorten through repeated processing.",
      "Circular paper systems therefore connect effective recovery with responsible fresh-fibre inputs. The loop is not a claim on a label—it is the result of sourcing, design, use, collection and mill decisions working together.",
    ],
    stat: "CONTINUE",
    statLabel: "Source responsibly · design intelligently · recover effectively",
    image: "/images/journey/spreads-v2/spread5.jpg",
    images: [
      {
        src: "/images/journey/spreads-v2/spread5.jpg",
        alt: "Recovered fibre and responsible fresh fibre joining a new papermaking cycle",
        caption: "A loop works only when every hand-off works.",
      },
      {
        src: "/images/journey/spreads-v2/spread2.jpg",
        alt: "A finished sheet beside recovered fibre ready for its next useful life",
      },
    ],
    accent: "#537b5b",
  },
];

export const journeyTotal = journeySpreads.length + 1;
