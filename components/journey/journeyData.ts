export type JourneyStep = {
  id: number;
  phase: "Source" | "Prepare" | "Make" | "Finish";
  process: string;
  title: string;
  body: string[];
  insight: string;
  image: string;
  alt: string;
  tone: string;
};

export const journeySteps: JourneyStep[] = [
  {
    id: 1,
    phase: "Source",
    process: "Collect recovered paper",
    title: "The urban harvest",
    body: [
      "Used corrugated boxes, office sheets, newspapers and notebooks are collected from homes, institutions and businesses. Keeping them clean and dry preserves fibre quality.",
      "Recovered paper is not one material. Sorting by grade helps a mill direct each fibre stream toward a product it can make well.",
    ],
    insight: "Collection quality determines how much usable fibre reaches the next sheet.",
    image: "/images/journey/process-2026/01-urban-harvest.jpg",
    alt: "Workers sorting dry recovered paper and cardboard into mill-ready grades",
    tone: "#b1744d",
  },
  {
    id: 2,
    phase: "Source",
    process: "Grow fresh fibre",
    title: "Cultivating strength",
    body: [
      "Fresh cellulose can supply the long fibres needed for strength and for grades that cannot rely only on recycled furnish. In India, industry-supported farm forestry is an important wood route.",
      "These planted crops are managed on farms and marginal land. They are different from natural forests, which carry wider ecological functions and require protection.",
    ],
    insight: "IPMA reports that more than 90% of sector wood demand is met through agro and farm forestry.",
    image: "/images/journey/process-2026/02-farm-forestry.jpg",
    alt: "Farmer inspecting orderly pulpwood trees and new saplings on agricultural land",
    tone: "#597b52",
  },
  {
    id: 3,
    phase: "Prepare",
    process: "Repulp recovered fibre",
    title: "Hydrapulping the past",
    body: [
      "Bales of recovered paper enter a hydrapulper with water. Mechanical motion breaks the old sheets apart and releases their cellulose fibres into a pumpable suspension.",
      "The paper structure disappears, but the fibre remains. Large contaminants can begin leaving the stream at this stage.",
    ],
    insight: "The goal is separation, not dissolving the fibre.",
    image: "/images/journey/process-2026/03-hydrapulping.jpg",
    alt: "Recovered paper entering a large hydrapulper filled with moving fibre slurry",
    tone: "#647c78",
  },
  {
    id: 4,
    phase: "Prepare",
    process: "Screen and clean",
    title: "Remove what does not belong",
    body: [
      "Pressure screens separate by size and shape. Centrifugal cleaners use density differences to remove grit, metal, plastic and other unwanted material.",
      "Cleaning happens in stages because no single device can remove every contaminant. Rejects are collected and managed separately.",
    ],
    insight: "Clean incoming paper improves yield and protects mill equipment.",
    image: "/images/journey/process-2026/04-screening.jpg",
    alt: "Paper fibre passing through industrial screens with contaminants collected separately",
    tone: "#527785",
  },
  {
    id: 5,
    phase: "Prepare",
    process: "Deink when needed",
    title: "Ink rises away",
    body: [
      "For brighter grades, chemicals help release ink particles from recovered fibre. Fine air bubbles carry the detached ink upward as a dark foam that can be skimmed away.",
      "Not every paper grade needs deinking. Brown packaging papers can avoid processing that adds no useful performance.",
    ],
    insight: "Good papermaking processes only as far as the intended grade requires.",
    image: "/images/journey/process-2026/05-deinking.jpg",
    alt: "Dark ink foam separating from pale recovered fibre in a flotation deinking tank",
    tone: "#686f72",
  },
  {
    id: 6,
    phase: "Prepare",
    process: "Pulp fresh fibre",
    title: "Release long cellulose fibres",
    body: [
      "Along the fresh-fibre route, prepared wood chips enter a controlled digester. Heat and cooking chemistry separate cellulose from lignin, the natural material binding the wood structure.",
      "The resulting long fibres are washed and prepared before they join the paper recipe. Mills recover chemicals and energy where their process design permits.",
    ],
    insight: "Fresh fibre and recovered fibre reach the mixing stage through different preparation systems.",
    image: "/images/journey/process-2026/06-digester.jpg",
    alt: "Uniform wood chips travelling toward a large pulp digester inside a mill",
    tone: "#9a704a",
  },
  {
    id: 7,
    phase: "Make",
    process: "Build the furnish",
    title: "The streams meet",
    body: [
      "Prepared fibre streams enter a blending chest. Papermakers choose the furnish according to the strength, surface, absorbency, colour and useful life the product requires.",
      "There is no universal 80 to 20 recipe for every sheet. The responsible choice is the highest suitable recovered content while maintaining the required performance.",
    ],
    insight: "Furnish means the complete fibre and water recipe supplied to the paper machine.",
    image: "/images/journey/process-2026/07-blending.jpg",
    alt: "Two clean pulp streams entering a stainless steel blending chest",
    tone: "#607d67",
  },
  {
    id: 8,
    phase: "Make",
    process: "Refine the fibres",
    title: "Prepare fibres to bond",
    body: [
      "Refining changes the fibre surface so the fibres can flex, overlap and form stronger bonds as the sheet dries. It is a controlled mechanical treatment, not simple chopping.",
      "Too little or too much refining changes drainage, strength and formation. Operators tune it for the grade and machine.",
    ],
    insight: "Microscopic fibre preparation shapes the performance of the visible sheet.",
    image: "/images/journey/process-2026/08-refining.jpg",
    alt: "Pulp flowing from a stainless steel disc refiner in a paper mill",
    tone: "#77735b",
  },
  {
    id: 9,
    phase: "Make",
    process: "Form the wet web",
    title: "The sheet first appears",
    body: [
      "A very dilute furnish flows evenly from the headbox onto a moving forming fabric. Water drains through the mesh while fibres settle, overlap and become a continuous wet web.",
      "Flow and drainage must remain even across the machine. This formation influences the sheet's appearance, print behaviour and strength.",
    ],
    insight: "At this point the sheet is recognisable, continuous and still mostly water.",
    image: "/images/journey/process-2026/09-formation.jpg",
    alt: "Dilute pulp forming a continuous wet paper web on moving wire mesh",
    tone: "#4f7a72",
  },
  {
    id: 10,
    phase: "Make",
    process: "Press out water",
    title: "Pressure builds the bond",
    body: [
      "The fragile web travels between absorbent felts and heavy press rolls. Mechanical pressure removes more water and brings fibres into closer contact.",
      "Removing water by pressing is more energy efficient than evaporating all of it later. The sheet also gains enough strength to continue through the machine.",
    ],
    insight: "The press section saves drying energy while consolidating the sheet.",
    image: "/images/journey/process-2026/10-pressing.jpg",
    alt: "Wet paper web passing through felt-covered press rolls",
    tone: "#5a6665",
  },
  {
    id: 11,
    phase: "Finish",
    process: "Dry and size",
    title: "Heat completes the sheet",
    body: [
      "The paper weaves through steam-heated cylinders that remove its remaining moisture under controlled tension. Stable drying prevents wrinkles, breaks and uneven properties.",
      "Some grades receive surface sizing, often based on starch, to adjust strength, liquid resistance and the way ink sits on the sheet.",
    ],
    insight: "Moisture is controlled, not simply removed.",
    image: "/images/journey/process-2026/11-drying.jpg",
    alt: "Paper moving through a long row of steam-heated drying cylinders",
    tone: "#a06c42",
  },
  {
    id: 12,
    phase: "Finish",
    process: "Calender and reel",
    title: "Ready for the next chapter",
    body: [
      "Calender rolls adjust smoothness and thickness before the finished web is wound onto a jumbo reel. The reel can then be slit, sheeted, coated or converted into the product people use.",
      "Its journey is not finished at sale. Good design, clean use and correct separation decide whether suitable fibre can return to the mill.",
    ],
    insight: "The final reel is both an ending and the start of another recovery decision.",
    image: "/images/journey/process-2026/12-final-reel.jpg",
    alt: "Finished paper winding onto a jumbo reel at the end of a paper machine",
    tone: "#8b6b4c",
  },
];
