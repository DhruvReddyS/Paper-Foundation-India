/**
 * Published article bodies.
 *
 * Written against the source pool below. Every substantive claim should be
 * traceable to one of the attached sources; where a figure is specific to
 * India it carries the Indian source that reports it. Where evidence is
 * genuinely mixed, the article says so rather than resolving it artificially.
 *
 * The renderer in app/(site)/knowledge/[slug]/page.tsx understands a small
 * subset of Markdown: "## " and "### " headings, "> " quotes, "- " and
 * "1. " lists, and blank-line separated paragraphs.
 */

export type ArticleSource = { label: string; url: string };
export type ArticleBody = { body: string; sources: ArticleSource[]; readingMinutes: number };

const CEPI_RECYCLABILITY: ArticleSource = {
  label: "CEPI recyclability guidelines",
  url: "https://www.cepi.org/wp-content/uploads/2020/10/Cepi_recyclability-guidelines.pdf",
};
const CEPI_FIBRE_LOOP: ArticleSource = {
  label: "CEPI position paper on the fibre loop",
  url: "https://www.cepi.org/wp-content/uploads/2022/10/PPCG-MG-22-030_Cepi-position-paper.pdf",
};
const CEPI_RULES: ArticleSource = {
  label: "European recovered-paper collection rules",
  url: "https://www.cepi.org/simple-paper-recycling-rules-from-the-erpc/",
};
const FAO_PLANTED: ArticleSource = {
  label: "FAO guidance on managing planted forests",
  url: "https://www.fao.org/sustainable-forest-management/toolbox/modules/management-of-planted-forests/further-learning/en/",
};
const FAO_FORESTRY: ArticleSource = {
  label: "FAO Forestry",
  url: "https://www.fao.org/forestry/en/",
};
const DPIIT: ArticleSource = {
  label: "DPIIT Annual Report 2025 to 2026",
  url: "https://www.dpiit.gov.in/static/uploads/2026/03/863a5fef349d79a1bba316c4b51eaacb.pdf",
};
const IPMA: ArticleSource = {
  label: "IPMA, Paper Industry Myths versus Realities",
  url: "https://ipmaindia.org/wp-content/uploads/2023/11/Myths-versus-Realities-Sep23.pdf",
};
const CSE: ArticleSource = {
  label: "CSE study on wastepaper circularity in India",
  url: "https://www.cseindia.org/improving-wastepaper-circularity-for-the-pulp-and-paper-sector-12004",
};
const NITI_BAMBOO: ArticleSource = {
  label: "NITI Aayog, Bamboo for Pulp and Paper",
  url: "https://niti.gov.in/sites/default/files/2022-02/Bamboo_Presentations/Technical_Session_3_Bamboo_for_Pulp_and_Paper_Shri_Sanjeev_Jain.pdf",
};
const IBEF: ArticleSource = {
  label: "IBEF, Paper and Packaging industry",
  url: "https://www.ibef.org/industry/paper-packaging",
};
const TRADESTAT: ArticleSource = {
  label: "Department of Commerce, TradeStat",
  url: "https://tradestat.commerce.gov.in/ftspcc/import_commodity_wise",
};
const RBI: ArticleSource = {
  label: "Reserve Bank of India, banknote FAQ",
  url: "https://www.rbi.org.in/commonperson/english/scripts/FAQs.aspx?Id=3158",
};
const PAPER_MACHINE: ArticleSource = {
  label: "Paper machine, technical reference",
  url: "https://en.wikipedia.org/wiki/Paper_machine",
};
const PAPER_RECYCLING: ArticleSource = {
  label: "Paper recycling, technical reference",
  url: "https://en.wikipedia.org/wiki/Paper_recycling",
};
const DEINKING: ArticleSource = {
  label: "Deinking, technical reference",
  url: "https://en.wikipedia.org/wiki/Deinking",
};
const BAGASSE: ArticleSource = {
  label: "Bagasse, technical reference",
  url: "https://en.wikipedia.org/wiki/Bagasse",
};
const GRAMMAGE: ArticleSource = {
  label: "Paper density and grammage, technical reference",
  url: "https://en.wikipedia.org/wiki/Grammage",
};
const IEA_DATA: ArticleSource = {
  label: "IEA on data centres and transmission networks",
  url: "https://www.iea.org/energy-system/buildings/data-centres-and-data-transmission-networks",
};
const PAPER_REF: ArticleSource = {
  label: "Paper, technical reference",
  url: "https://en.wikipedia.org/wiki/Paper",
};

export const articleBodies: Record<string, ArticleBody> = {
  "paper-isnt-the-problem-waste-is": {
    readingMinutes: 9,
    sources: [CEPI_RECYCLABILITY, CEPI_FIBRE_LOOP, CEPI_RULES, DPIIT, CSE],
    body: `Ask most people whether paper is good or bad for the environment and you will get an answer within a second. That speed is the problem. Paper is not one material with one footprint. It is a family of products made from different fibres, in mills of very different efficiency, for uses that last anywhere from a minute to a century. The useful question is not whether paper is good. It is where, in a particular chain, value is being destroyed.

## Waste is a decision, not a property

A sheet of paper does not become waste on its own. It becomes waste when a decision upstream makes recovery impossible or uneconomic. A laminate that cannot be separated, a coating that contaminates a batch, a box that gets soaked because it was left in the rain, a bin that mixes food with fibre. Each of these is a choice made by a designer, a buyer, a collector or a user.

This matters because it tells you where to intervene. If paper were inherently wasteful, the only fix would be to use less of it. Because waste is produced by decisions, the fix is to make better decisions at the points where they are actually taken.

> The material did not fail. A decision in the chain did, and decisions can be changed.

## Three places value leaks

**Design.** Barrier layers, metallised films and strong adhesives are added for a reason, usually to protect what is inside. They also decide whether the fibre can be recovered afterwards. Recyclability guidelines exist precisely because the answer depends on the construction, not on the word "paper" printed on the pack.

**Use.** A sheet printed on one side and discarded has delivered half the service its fibre was made for. A box used once and crushed wet has delivered less than a box used twice and kept dry. Nothing about the material forced either outcome.

**Collection.** Fibre that is clean, dry and separated has a market. Fibre that is mixed with food waste often does not. The difference is a few seconds of handling, repeated at scale.

## What the Indian picture adds

India's mills already run substantially on recovered fibre rather than fresh pulp, and the sector reports a large base of operating mills and significant direct employment. That shape of industry changes the argument. The constraint is less often the availability of trees than the availability of clean, well-sorted recovered paper at a price a mill can work with.

Studies of wastepaper circularity in India point at the same bottleneck from the other direction: collection and sorting infrastructure, not demand from mills, is what limits how much domestic fibre returns to production.

## A better question to carry

Instead of asking whether paper is sustainable, ask four things about the specific product in front of you.

1. Where did this fibre come from, and can that be checked?
2. What job does this product have to do, and is it designed for that job without excess?
3. Will it be used fully before it is discarded?
4. Does a real route exist, here, to recover it?

Those four questions can be answered with evidence. "Is paper good?" cannot.`,
  },

  "why-paper-can-be-sustainable": {
    readingMinutes: 7,
    sources: [FAO_PLANTED, CEPI_FIBRE_LOOP, CEPI_RECYCLABILITY, IPMA],
    body: `Paper has an unusual property among common materials: its raw material can be grown again, and the material itself can be returned to production several times. Neither of those facts makes any particular paper product sustainable. They make it *capable* of being sustainable, which is a different and more useful claim.

## Renewable describes the input, not the outcome

Cellulose fibre comes from plants. Plants regrow. That is what renewable means, and it genuinely distinguishes paper from materials drawn from finite deposits.

It does not tell you whether a given sheet was responsibly produced. A renewable input can still be sourced from badly managed land, processed in an inefficient mill, used once and sent somewhere with no recovery route. Renewability is the opening condition, not the verdict.

> Renewable is a fact about the fibre. Sustainable is a conclusion about the whole chain, and it has to be earned at every step.

## The four things that decide the answer

**Fibre source.** Recovered paper, residues from sawmilling, agricultural residues, farm forestry and managed plantations all feed mills. Each carries different evidence requirements. FAO maintains guidance on planted-forest management because outcomes vary so widely with practice.

**Mill efficiency.** Energy source, water circuits, chemical recovery and heat integration vary enormously between mills. Two sheets of identical paper from different mills can carry very different footprints.

**Product design.** A pack that protects its contents prevents the much larger waste of the thing inside. A pack with an unnecessary barrier layer may prevent its own recovery. Design decides both.

**Recovery.** Fibre only stays in the economy if it comes back. That depends on collection systems, cleanliness and whether a mill nearby can use that grade.

## Why the loop needs fresh fibre too

A recycling system cannot run on recovered fibre alone. Cellulose fibres shorten and some are lost at every pass through pulping, screening and cleaning. Without a continuing input of fresh fibre, the average fibre length in the system would fall until the material could no longer perform.

This is the point most often missed in public argument. Responsibly sourced fresh fibre is not the enemy of recycling. It is what keeps recycling viable over time.

## What to look for

- A named fibre source, not a general reassurance.
- A design you can see is intended for recovery.
- A product sized for the job rather than for shelf presence.
- A local route that actually accepts it.

Paper can be one of the better-behaved materials in a circular system. Whether a specific product is depends on decisions you can inspect.`,
  },

  "every-sheet-deserves-a-second-life": {
    readingMinutes: 7,
    sources: [CEPI_RULES, CEPI_FIBRE_LOOP, PAPER_RECYCLING, CSE],
    body: `By the time a sheet of paper reaches your hands, most of its environmental cost has already been paid. The land, the water, the energy, the transport: all spent. What happens next decides whether that investment produces one unit of service or several.

## The cheapest fibre is the fibre already made

Recovering a sheet avoids the need to produce an equivalent amount of new fibre for the next product. That is why recovered paper is traded internationally as a commodity with published grades, and why mills compete for clean supply.

For a reader, this reframes the daily decision. Putting paper into recovery is not a disposal choice. It is a supply decision for somebody else's production line.

## What a second life actually requires

Three conditions, in order of how often they fail.

**Clean.** Oils and food residue contaminate fibre and can spoil an entire batch. This is the single most common reason paper that was collected does not become paper again.

**Dry.** Wet fibre loses strength and value, and wet loads are heavier to move for no useful gain.

**Separated.** Paper mixed with other materials has to be sorted again, and some of it will be lost in the process.

> A clean, dry, separated sheet is a raw material. The same sheet, greasy and wet, is a disposal cost.

## Use the first life fully

Before recovery there is a step that is easier and often skipped: using the sheet completely.

- Print on both sides by default rather than by exception.
- Keep single-sided prints as note paper rather than filing them away unread.
- Reuse packaging that is still structurally sound instead of flattening it immediately.
- Order the quantity you need rather than the quantity that is cheapest per unit.

None of this is dramatic. At the scale of an office or a campus it is the difference between a fibre doing one job and doing two.

## Where the Indian system is tight

Analysis of wastepaper circularity in India consistently identifies collection and sorting as the constraint rather than mill demand. Informal collection networks already recover a great deal of material, and the gains available are mostly in how cleanly it arrives and how well it is graded, rather than in whether anybody wants it.

That is encouraging, because cleanliness and separation are exactly the parts an ordinary household or office controls.`,
  },

  "forests-grow-because-they-are-managed": {
    readingMinutes: 7,
    sources: [FAO_PLANTED, FAO_FORESTRY, IPMA, NITI_BAMBOO],
    body: `There is a persistent assumption that every tree harvested for paper is a tree subtracted from a forest. The reality in most paper supply chains is closer to agriculture than to extraction, and the distinction decides whether the outcome is good or bad.

## Harvesting is not deforestation

Deforestation means converting forest land to another use permanently: to cropland, to pasture, to buildings. Harvesting within a managed cycle, where the land stays forest and is replanted or regenerated, is a different thing with a different outcome.

This is not a technicality. The two can be told apart by looking at land-use records over time, which is precisely why serious forestry assessment looks at land cover across years rather than at single harvest events.

> The question is not whether a tree was cut. It is whether the land is still forest afterwards, and whether it was forest to begin with.

## Why management produces more forest, not less

Where wood has a dependable market, landowners have a reason to keep land under trees rather than convert it to something more immediately profitable. Where that market disappears, the pressure to convert goes up.

This is the economic argument for responsible demand, and it is why the Indian industry has invested in farm forestry: trees grown as a crop on farmland, outside natural forest, with the farmer as the producer.

## What has to be checked anyway

None of the above makes any particular supply chain acceptable. Poorly governed sourcing can and does damage natural forests. The things worth asking for are specific.

1. Where did this fibre grow, at the level of a region rather than a country?
2. Is the land still forest after harvest?
3. Was it natural forest converted to plantation, and when?
4. Is there a credible third-party audit, and what exactly does it cover?

## India's own route

India's fibre comes substantially from agro-residues, recovered paper and farm forestry rather than from large natural-forest harvesting. Work on bamboo as a pulp input adds another fast-growing, largely farm-grown option.

That mix is worth understanding, because arguments imported from other countries' forestry debates often do not describe how Indian mills are actually supplied.`,
  },

  "recycling-paper-giving-fibres-another-chance": {
    readingMinutes: 7,
    sources: [PAPER_RECYCLING, DEINKING, CEPI_FIBRE_LOOP, CEPI_RECYCLABILITY],
    body: `Recycling paper is often pictured as melting something down and pouring it into a new shape. What actually happens is gentler and more interesting: the sheet is taken apart back into the fibres it was made from, cleaned, and re-laid.

## Water does the first job

Recovered paper enters a pulper with a large volume of water and is agitated until the bonds between fibres release and the sheet becomes a slurry. No heat is needed to break a paper sheet apart, because the bonds holding it together are hydrogen bonds formed as the original sheet dried. Water undoes what drying did.

## Then everything that is not fibre has to leave

The slurry contains more than fibre: staples, tape, plastic windows, adhesive from bindings, sand, and ink.

- **Coarse screening** removes large contaminants by size.
- **Cleaning** uses density differences to spin out grit and metal.
- **Fine screening** catches smaller plastics and adhesive fragments, known in the trade as stickies, which cause trouble later if they survive.
- **Deinking**, where brightness matters, uses surfactants and air bubbles to lift ink particles to the surface so they can be skimmed away.

Not every grade needs every step. Brown packaging made from recovered boxes does not need deinking. Printing paper does.

> Recycling is a separation problem, not a melting problem. Almost everything difficult about it is about removing what is not fibre.

## Each pass costs something

Mechanical handling shortens fibres and removes fines. Shorter fibres bond differently and produce a weaker sheet, which is why recovered fibre is directed to grades that suit its condition rather than used interchangeably.

The practical consequence is that a recycling system needs a continuing input of fresh fibre to maintain average fibre quality. Recycling extends the working life of fibre. It does not make fibre immortal.

## What this means for the person with the bin

Every contaminant you keep out is a separation step the mill does not have to pay for, and a quantity of fibre that is not lost with the rejects. The leverage available at the bin is larger than it looks.`,
  },

  "paper-vs-plastic-beyond-headlines": {
    readingMinutes: 9,
    sources: [CEPI_RECYCLABILITY, CEPI_FIBRE_LOOP, FAO_PLANTED, IEA_DATA],
    body: `"Paper or plastic" is a question that sounds answerable and is not, at least not in the abstract. Change the product, the geography, the duration of use or the end-of-life route, and the answer changes with it. This is not evasion. It is what every serious comparison finds.

## A comparison needs a boundary before it needs a winner

Four things have to be fixed before two materials can be compared at all.

1. **The functional unit.** Not "a bag" but "carrying four kilograms of shopping once a week for a year". Materials that look different per item often look different again per unit of service.
2. **The geography.** Electricity carbon intensity, transport distance and recovery infrastructure vary enormously. A result from one country frequently does not transfer.
3. **The time horizon.** A product used once and a product used two hundred times are not the same case.
4. **The end-of-life route.** What is actually available where the product is discarded, not what is theoretically possible.

> Most published comparisons disagree because they answer different questions, not because one of them is lying.

## Where paper tends to do well

Short-lived products with a dependable collection route and no barrier requirement. Paper has an established separate-collection system in many places and a liquid market for recovered fibre, so the recovery assumption is usually realistic rather than aspirational.

## Where plastic tends to do well

Applications needing low weight, high barrier performance or long service life. Weight matters in transport, and barrier performance matters because a pack that fails spoils its contents, which is usually a far larger loss than the pack.

## Where both arguments go wrong

**Ignoring the contents.** The packaging is almost never the biggest footprint in the system. Food that spoils because it was underpacked outweighs the pack that would have protected it.

**Assuming recovery.** Both materials are recyclable in principle. What matters is whether a route exists at the point of discard.

**Comparing a material to a material.** There is no general answer. There are only answers about specific products in specific places.

## A fair way to decide

Name the product and the job. Name the place. Name what happens afterwards. Then compare. If a claim does not do those three things first, it is not a comparison, it is a preference.`,
  },

  "circular-journey-of-a-sheet": {
    readingMinutes: 7,
    sources: [PAPER_RECYCLING, PAPER_MACHINE, CEPI_RULES, CSE],
    body: `Follow one sheet of office paper from the moment it leaves the printer and the whole system becomes visible, including the places where it most often breaks.

## Use

The sheet carries information for as long as it is needed. Its first opportunity to do more work is the reverse side, which is unused in most offices. Nothing in the system recovers this value later; it is available only here.

## Separation

The sheet goes into a paper stream or a mixed stream. This is the single highest-leverage moment in the journey. In the paper stream it is a raw material with a buyer. In a mixed stream it may be contaminated beyond use within minutes.

## Collection and aggregation

Collectors consolidate material because transporting small quantities does not pay. Flattened, dry material packs densely, which is why flattening a box matters far more than it appears: the saving is in journeys, not in bin space.

> Nobody collects paper as a favour. It moves because, graded and baled, it is worth moving.

## Grading and baling

Recovered paper is sorted into grades, because a newsprint fibre and a corrugated fibre behave differently in a mill. Grading is what converts a mixed pile into a specified input a mill can price.

## Repulping

At the mill the bale is broken into water and agitated until it returns to fibre. Screens and cleaners remove staples, tapes, plastics and grit, and deinking removes ink where brightness is required.

## Forming a new sheet

The cleaned stock is diluted heavily, then spread across a moving permeable wire where water drains and fibres begin to bond. Pressing removes more water mechanically, drying removes the rest with heat, and the finished web is wound into a reel.

## Where the loop leaks

- Contamination at separation, which removes material from the loop entirely.
- Wet storage, which destroys strength before collection.
- Constructions that cannot be separated, which arrive as a problem rather than a feedstock.
- Fibre losses with rejects, which are unavoidable but can be reduced by cleaner input.

The journey is not a circle so much as a spiral: each pass returns most of the fibre, not all of it, which is why fresh fibre continues to enter the system.`,
  },

  "responsible-paper-use-supports-forestry": {
    readingMinutes: 7,
    sources: [FAO_PLANTED, FAO_FORESTRY, IPMA, DPIIT],
    body: `It sounds like a contradiction: buying paper can support forests. It is not, but the mechanism is specific and it does not work automatically.

## The mechanism

Land is used for whatever gives the person holding it a reason to keep holding it that way. Where wood has a dependable market, keeping land under trees has value. Where that market collapses, the pressure to convert land to a more immediately profitable use increases.

Responsible demand, demand that is traceable and prefers audited supply, strengthens the reason to keep land forested and to manage it properly rather than mine it once.

> Demand is a signal. The question is only whether it is pointed at traceable supply or at the cheapest fibre available with no questions asked.

## Where it fails

The mechanism depends on the demand being discriminating. Undifferentiated demand rewards whoever is cheapest, and the cheapest supply is often cheapest because something has been skipped. Demand only supports good forestry when it can tell the difference.

## Farm forestry, which changes the Indian picture

A great deal of Indian pulpwood is grown as a farm crop, on agricultural land, by farmers who chose trees over an alternative crop. In that model the buyer is not reaching into a natural forest at all. They are buying from a grower, and the grower's decision next season depends on whether this season paid.

This makes the demand signal unusually direct, and it makes reliability matter as much as price.

## What responsible use looks like in practice

1. Buy for the job rather than for appearance, and avoid specifying more material than the task needs.
2. Prefer suppliers who can say where fibre came from, at a useful level of detail.
3. Treat certification as evidence about specific practices, and read what it covers.
4. Use the product fully, then return it cleanly, so less new fibre is needed next time.

Responsible use is not the same as minimal use. It is use that gives the chain a reason to behave well.`,
  },
  "zero-paper-waste-campuses": {
    readingMinutes: 7,
    sources: [CEPI_RULES, CSE, CEPI_FIBRE_LOOP],
    body: `Campus paper programmes usually start with a poster and end with a bin nobody empties. The ones that work start somewhere less exciting: finding out how much paper the campus actually buys.

## Measure before you target

A target set without a baseline cannot be evaluated. Purchasing records give the baseline almost immediately, because paper arrives through a small number of orders even when it leaves through thousands of hands.

Record reams purchased per month, by department, for one term. That single table usually reveals where effort is worth spending, and it is often not where people assume.

## Reduce without reducing learning

The aim is not less learning. It is less waste per unit of learning.

- Make double-sided the default on every device, so single-sided requires a deliberate choice.
- Set duplex and multiple-pages-per-sheet as defaults for drafts.
- Replace printed circulars with a noticeboard where the content is genuinely transient.
- Keep a shared tray of single-sided paper for rough work.

> A default is worth more than a campaign. Campaigns end; defaults keep working after everyone has stopped paying attention.

## Design the collection, not just the bin

A bin is only useful if what comes out of it has a buyer.

1. Place paper bins where paper is generated: beside printers, in staff rooms, in classrooms. Not only in corridors.
2. Keep them away from food waste, which is what most often ruins a collection.
3. Agree a collector before you start, and ask what they will and will not accept.
4. Give somebody named responsibility for the handover.

## Measure what the collector accepts

The honest metric is not what was put in the bin. It is what the collector took and paid for. Rejected loads tell you precisely where the system is leaking, and that information is more useful than a total weight.

## Make it survive a change of students

Write the defaults into the IT configuration, the procurement rules and the facilities contract. Anything that depends on a particular enthusiastic person lasts exactly as long as that person does.`,
  },

  "after-the-paper-bin": {
    readingMinutes: 7,
    sources: [PAPER_RECYCLING, CEPI_RULES, CSE, CEPI_RECYCLABILITY],
    body: `Putting paper in the recycling bin feels like the end of the story. It is closer to the beginning, and what happens next is decided by people who will never meet you.

## A collector sees material, not intention

The first person to handle your paper is assessing it commercially. Is it dry? Is it contaminated? What grade is it, and is there enough of it in one place to be worth a journey?

Nothing about your intention travels with the material. Only its condition does.

## Aggregation comes before anything else

Small quantities scattered widely cannot be moved economically. Collection networks exist to consolidate material into loads large enough to transport, which is why density matters so much and why flattening is not a cosmetic request.

> The economics of recovery are mostly the economics of transport. Anything that makes a load denser makes recovery more likely.

## Grading decides where it goes

Recovered paper is sorted into grades with published definitions. Old corrugated containers are one of the most widely traded. Mixed paper is worth less, because the mill has more work to do and more to reject.

Grading is the step that turns a heap into a specified input. A load that cannot be graded confidently gets priced as if it were the worst thing it might contain.

## Mills have specifications, and they enforce them

A mill buys to a specification because its process depends on it. Loads outside specification are rejected or discounted, and rejection is expensive for everyone in the chain back to the bin.

## Where it ends

Most of the fibre becomes new product. Some is lost: short fibres that pass through screens, material rejected as contamination, and moisture. The losses are real, which is why the system still needs fresh fibre entering it.

## What this makes worth doing

Keep it dry. Keep food away from it. Flatten what you can. Separate obvious non-paper such as plastic windows and tape where it is easy. These sound trivial individually and they are the whole difference at scale.`,
  },

  "not-every-paper-recycles-the-same": {
    readingMinutes: 7,
    sources: [CEPI_RECYCLABILITY, PAPER_RECYCLING, CEPI_RULES],
    body: `"Recyclable" on a pack is a claim about possibility, not about what will happen to the object in your hand. Three things decide the real outcome: what the product is made of, what has happened to it, and what exists where you are.

## Grades are not interchangeable

Paper products are built from different fibres for different jobs. A long-fibre sack kraft, a short-fibre tissue and a filled, coated printing paper behave differently in a pulper and suit different end uses afterwards.

This is why recovered paper is traded by grade. It is not bureaucracy. It is the mill telling you what it can actually process.

## Construction can rule recovery out

Some additions are easy to deal with and some are not.

- **Printing ink**: routine, removed by deinking where brightness matters.
- **Light mineral coating**: usually manageable.
- **Adhesives**: variable. Some disperse into fragments that survive screening and cause defects.
- **Plastic or metallised laminates**: often the hard case, because the layers have to be separated before the fibre is usable.

> A pack is recyclable in the way a door is openable: only if you have the key that fits this particular lock.

## Contamination is usually the deciding factor

Food, oil and moisture do more damage in practice than construction does, because they affect far more material. A greasy box is not a recycling problem because of the board. It is a problem because of what is on it.

## Local reality beats the label

A product recyclable in one city may have no route in another, because the determining factor is what the nearby mills and collectors can handle. The honest instruction is always local.

## How to read a pack

1. Is it mostly fibre, or fibre bonded to something else?
2. Is it clean and dry?
3. Does your local collection accept this type?
4. If not, is part of it separable and worth separating?

That is a more useful sequence than looking for a symbol.`,
  },

  "science-behind-paper-recycling": {
    readingMinutes: 9,
    sources: [PAPER_RECYCLING, DEINKING, PAPER_MACHINE, CEPI_FIBRE_LOOP],
    body: `Paper holds together without glue. Understanding why explains almost everything about how recycling works, and why it cannot go on forever.

## Why a sheet is a sheet

As a dilute suspension of cellulose fibres dries, the fibres draw together and form hydrogen bonds where their surfaces meet. No adhesive is involved in an ordinary sheet. The bonds are a consequence of water leaving.

That is the key to recycling: adding water back lets the bonds release, and the sheet returns to the fibres it was made from.

## Repulping

Recovered paper is agitated in water until it disperses into a slurry. The energy required is modest compared with reducing wood to pulp, because the work of separating fibres from lignin was done the first time.

## Removing what is not fibre

The slurry is cleaned in stages, each tuned to a different property.

- **Coarse screens** reject by size: staples, large plastics, string.
- **Centrifugal cleaners** reject by density: grit, sand, metal fragments.
- **Fine screens and slotted screens** target small adhesive particles, the stickies, which are the most troublesome contaminant because they are deformable and can squeeze through openings that would stop a rigid particle.
- **Flotation deinking** injects air into a surfactant-treated stock. Ink particles attach to bubbles, rise, and are skimmed as froth.

> Nearly every difficult problem in recycling is a separation problem. The fibre is rarely the hard part.

## Refining, and the trade-off at the centre

Refining mechanically works fibre surfaces so they bond better, raising strength. It also shortens fibres and generates fines. Refine too little and the sheet is weak; refine too much and drainage suffers and the sheet becomes dense and brittle.

Recovered fibre arrives already shortened by previous cycles, so the operating window is narrower than with fresh pulp.

## Why fibre has a working life

Each pass shortens fibres, removes fines with the rejects, and reduces the ability of the surface to bond. A commonly cited working range is several cycles before fibre is no longer suitable for most paper grades, with the exact number depending on the grade, the process and how the fibre was treated.

This is why fresh fibre keeps entering the system. It is not a failure of recycling; it is the arithmetic of a material that degrades slightly each time it is reused.

## Where the losses go

Rejects, fines and sludge. Modern mills recover energy or materials from some of this, but the fibre that leaves as sludge has left the loop. Cleaner input at the bin is the cheapest way to reduce it.`,
  },

  "cardboard-unsung-recycling-hero": {
    readingMinutes: 7,
    sources: [PAPER_RECYCLING, CEPI_RULES, CSE, IBEF],
    body: `Corrugated board does not attract much attention. It is brown, it is ordinary, and it is probably the most successful recovered material in the economy.

## Why it works so well

**It arrives in bulk at predictable places.** Shops, warehouses and distribution centres generate large quantities of the same grade in one location, which makes collection economic in a way that scattered household material is not.

**It is mostly one material.** Three layers of paperboard and a starch adhesive. Nothing exotic to separate.

**It has long, strong fibres.** Board is built for compression strength, so its fibres have performance left even after several cycles.

**There is a standing market.** Old corrugated containers are a recognised, internationally traded grade with a published specification and a consistent buyer base.

> Corrugated board is the closest thing in everyday life to a material that routinely returns as itself.

## What wrecks it

- **Water.** Wet board loses strength immediately, and the fibre value falls with it.
- **Grease and food.** The classic pizza-box problem, and the reason the clean sections are worth separating from the soaked ones.
- **Heavy tape and labels.** Manageable in small amounts, a cost in large ones.
- **Wax coating.** Historically used for cold chains, and difficult for standard recovery.

## The India context

Packaging demand has grown with organised retail and e-commerce, which has increased both the amount of board in circulation and the number of points where it can be captured cleanly. The constraint on recovery is less about demand from mills than about getting material to them dry, flat and graded.

## Three things worth doing

1. Keep board dry. Everything else is secondary to this.
2. Flatten it, because transport density is what makes collection pay.
3. Tear off and discard the soaked or greasy section rather than condemning the whole box.`,
  },

  "recycled-paper-all-around-you": {
    readingMinutes: 7,
    sources: [PAPER_RECYCLING, PAPER_REF, IBEF, CEPI_FIBRE_LOOP],
    body: `Recycled fibre is usually pictured as grey, rough paper for noticeboards. In practice it is in a great deal of ordinary material, often invisibly, because it has been matched to jobs where its properties are an advantage.

## Where it turns up

**Corrugated boxes.** The largest single destination. Recovered board returns as new board repeatedly.

**Cartonboard.** Many folding cartons carry recycled plies, often sandwiched between fresh-fibre outer layers that take the print.

**Moulded fibre.** Egg trays, protective inserts and drink carriers are formed from recovered pulp. The shape, not the surface, does the work.

**Core board and tubes.** The cores inside tape rolls, films and textiles.

**Plasterboard liner and construction papers.** High volume, low visibility.

**Tissue and towel.** Depending on grade and market.

> The best use of recovered fibre is usually the one where nobody notices it is recovered.

## Why it is not in everything

Fibre shortens with each pass, so recovered stock suits products where bulk, stiffness and compression strength matter more than smoothness and brightness. Pushing it into applications that need long, bright fibre produces a poor product and wastes good material.

Matching fibre to job is not a compromise. It is the whole skill.

## Reading a recycled-content claim

1. **What percentage**, and of what: the whole product or one ply?
2. **Pre-consumer or post-consumer?** Post-consumer means material that completed a use. Pre-consumer is often manufacturing trim, which is useful but less significant.
3. **Does the product still do its job?** A pack that fails because content was pushed too high wastes far more than it saved.

## The useful conclusion

A high recycled percentage is not automatically better, and a low one is not automatically worse. What matters is whether the fibre is well matched to the job and whether the product will be recovered again.`,
  },

  "can-we-go-completely-paperless": {
    readingMinutes: 7,
    sources: [IEA_DATA, CEPI_RECYCLABILITY, RBI, PAPER_REF],
    body: `Going paperless is usually presented as the obviously green option. It is sometimes the right choice and sometimes not, and the honest answer depends on specifics that the slogan skips.

## Digital has a physical footprint

Digital services run on devices, networks and data centres, all of which are manufactured, powered and eventually disposed of. The IEA tracks data-centre and network energy demand precisely because it is material at system scale.

This does not make digital worse. It means the comparison is between two physical systems, not between a physical one and a weightless one.

> Replacing paper with a screen moves the footprint. Whether it reduces it depends on the device, its lifetime and what it replaced.

## Where going paperless clearly helps

- Documents that are read once, by one person, and then never needed again.
- Material that would be printed in bulk and distributed speculatively.
- Records that benefit from search, versioning and backup.
- Anything where a physical copy is produced only because a process was never updated.

## Where paper still earns its place

- **Resilience.** Paper needs no power, no login and no compatible reader.
- **Long archival life** under reasonable conditions, without migration between formats.
- **Legal and identity documents**, where a physical artefact carries status. Indian banknotes, for instance, are produced on paper made from cotton, chosen for durability and security.
- **Reading comprehension and annotation** in study contexts, where many readers work better on paper.
- **Low-connectivity settings**, where assuming a device excludes people.

## The question worth asking

Not "can we eliminate paper" but "is this specific use of paper doing work that something else would do better".

That question has different answers for a disposable internal memo and for a textbook used by a student without reliable electricity. Answering them the same way is the actual mistake.`,
  },

  "why-using-both-sides-matters": {
    readingMinutes: 7,
    sources: [CEPI_RULES, CEPI_FIBRE_LOOP, CSE],
    body: `Printing on both sides is the least glamorous environmental action available and one of the few with no trade-off at all. It costs nothing, requires no new equipment and halves the material for the same output.

## The arithmetic

A sheet printed on one side has delivered half the service its fibre was manufactured to provide. All of the land, water, energy and transport behind that sheet were spent to make a two-sided surface, and half of it has been discarded unused.

At an office printing a few hundred sheets a day, default duplex removes a meaningful share of annual paper purchasing without anyone changing their behaviour.

> This is the rare case where the better choice is also the cheaper one and requires nobody to remember anything.

## Why it does not happen by itself

Because the default is wrong. People accept whatever the print dialog offers, and in most organisations that is single-sided.

The fix is administrative rather than motivational.

1. Set duplex as the device and driver default, centrally.
2. Make single-sided an available choice, not a forbidden one. Some documents need it.
3. Set draft quality as the default for internal work.
4. Keep a tray of single-sided paper beside the printer for notes.

## After both sides are used

The sheet still has value as fibre. Keep it dry, keep food away, and put it into the paper stream rather than a mixed bin. Both-sided use and clean recovery are complementary: the first gets more service from the fibre, the second returns it for another round.

## A note on proportion

Nobody should pretend duplex printing solves a large environmental problem. It is worth doing because it is free, immediate and entirely within your control, which is true of very few things.`,
  },

  "sustainable-forestry-makes-paper-renewable": {
    readingMinutes: 9,
    sources: [FAO_PLANTED, FAO_FORESTRY, IPMA, NITI_BAMBOO, DPIIT],
    body: `Renewability is the property most often claimed for paper and least often examined. A material is renewable if its source can regenerate on a human timescale. Whether that potential is realised depends entirely on how the land is managed.

## What managed forestry actually involves

A managed forest is a production system with a planned cycle: establishment, tending, thinning and harvest, followed by regeneration. The land remains forest throughout.

This differs from both unmanaged natural forest and from conversion, where forest becomes something else permanently. FAO maintains detailed guidance on planted-forest management because practice, not the existence of a plantation, determines the outcome.

> Renewable is a claim about the land, and land can be managed well or badly. The word alone settles nothing.

## What separates good practice from bad

**Land-use history.** Was this plantation established on degraded farmland, or on cleared natural forest? The two have opposite implications and look identical in a photograph of the current stand.

**Species and rotation.** Fast-growing species produce fibre quickly. Short rotations on poor soils can deplete nutrients if not managed.

**Biodiversity provision.** Whether set-asides, corridors and native vegetation are retained.

**Water.** Fast-growing plantations use water, which matters where water is already contested.

**Rights.** Whether existing land users were recognised and compensated.

## India's distinctive route

A large share of Indian pulpwood is grown through farm forestry: trees as an agricultural crop, grown by farmers on farmland, outside natural forest. Agro-residues such as bagasse and straw contribute further, and work continues on bamboo, which grows rapidly and is largely farm-grown.

This matters for how claims should be read here. A debate framed around industrial logging of natural forest describes a system that is not the main Indian supply route.

## Reading a sustainability claim

1. Which landscape, at regional rather than national level?
2. Is the land still forest after harvest, and was it forest before planting?
3. What does the certification actually audit, and when was it last checked?
4. Who else uses this land, and were they consulted?

Renewable is the starting condition. These questions are how you find out whether it was honoured.`,
  },

  "tree-to-notebook-to-new-notebook": {
    readingMinutes: 7,
    sources: [PAPER_MACHINE, PAPER_RECYCLING, FAO_PLANTED, CEPI_FIBRE_LOOP],
    body: `Follow a notebook from the field it grew in to the field it returns to, and the whole industry fits into a single story.

## Growing

Fibre begins as a crop. In India, much of it is grown on farmland through farm forestry, alongside agricultural residues such as bagasse and recovered paper from the existing stock in circulation. The farmer's decision to plant depends on whether the previous harvest paid.

## Pulping

Wood is reduced to fibre by separating cellulose from lignin, the substance that stiffens a tree. Chemical pulping dissolves lignin and produces strong fibre; mechanical pulping grinds the wood and keeps more of its mass but yields weaker, less stable fibre. Which is used depends on the product.

## Forming

Pulp is diluted until it is overwhelmingly water, then spread across a moving permeable wire. Water drains, fibres settle and begin to bond. This is where a suspension becomes a sheet.

## Pressing and drying

Rollers squeeze out water mechanically, which is far cheaper than evaporating it. Heated cylinders remove the rest. As the last water leaves, hydrogen bonds form between fibre surfaces and the sheet gains its strength.

> Nothing is glued. The sheet holds together because of what happens as it dries, which is also why water can take it apart again.

## Finishing and converting

The web is smoothed, trimmed and wound, then cut, printed, folded and bound into a notebook.

## Use

The notebook carries handwriting, which it does with no power and no compatibility problem. Its useful life is however long the pages last and the notes stay wanted.

## Return

Kept clean and dry, the notebook goes into paper collection, is graded and baled, and returns to a mill as feedstock. Staples and any plastic cover are removed during cleaning.

## Round again

Repulped, screened, cleaned and reformed, the fibre becomes another product. It will be slightly shorter than it was, so it is matched to a job that suits its condition. After several rounds it will be too short for most grades and will leave the system with the rejects.

Which is why the first step, growing, never stops being necessary.`,
  },

  "smart-paper-choices-homes-offices": {
    readingMinutes: 7,
    sources: [CEPI_RULES, CEPI_RECYCLABILITY, CEPI_FIBRE_LOOP],
    body: `Most advice about paper is either moralising or trivial. The decisions that actually matter are few, and they are mostly about buying and handling rather than about using less.

## Buying

**Match the grammage to the job.** Heavier paper is not better paper; it is more material. A 70 to 80 gsm sheet is right for ordinary printing. Specifying heavier stock for internal documents is cost and material with no return.

**Buy the quantity you will use.** Bulk pricing encourages over-ordering, and paper stored badly degrades.

**Ask where the fibre came from.** A supplier who can answer at the level of a region is telling you something. One who answers with a slogan is not.

**Prefer designs you can see are recoverable.** Fibre bonded to film is a harder case than fibre alone.

## Using

- Make duplex the default on every device rather than a choice people have to remember.
- Use draft quality for internal work.
- Print when you will actually mark up or carry the document, not reflexively.
- Keep a tray of single-sided sheets for notes.

> Defaults beat intentions. Set the machine correctly once and the saving continues without anyone thinking about it.

## Handling

This is the part most often skipped and it decides whether the fibre has a second life.

1. **Keep paper dry.** Water destroys value faster than anything else.
2. **Keep it away from food.** Grease contaminates and can spoil a batch.
3. **Flatten boxes.** The gain is in transport density.
4. **Separate obvious non-paper.** Plastic windows, heavy tape, plastic bindings.
5. **Tear off the soaked part** of an otherwise good box instead of discarding all of it.

## What not to worry about

Staples and ordinary printing ink. Both are routinely dealt with at the mill. Energy spent removing staples is better spent keeping the paper dry.`,
  },

  "future-of-paper-circular-economy": {
    readingMinutes: 9,
    sources: [CEPI_RECYCLABILITY, CEPI_FIBRE_LOOP, CSE, DPIIT, IBEF],
    body: `Paper already behaves more circularly than most materials: an established separate collection, published grades and a liquid market for recovered fibre. The interesting question is what limits it from here, and the answers are mostly not about the material.

## Limit one: design

Products are designed for the shelf and the supply chain, and recovery is considered last if at all. Barrier layers, metallised films and aggressive adhesives are added for real reasons and then make the fibre hard to recover.

The shift that matters is treating recoverability as a design requirement with the same standing as protection and print quality. Recyclability guidelines exist to make that a technical conversation rather than an argument.

## Limit two: collection

Fibre only circulates if it comes back clean. In India, analysis of wastepaper circularity repeatedly identifies collection and sorting capacity, not mill appetite, as the binding constraint.

That is an infrastructure and livelihoods question as much as an environmental one, because a large part of the collection system is informal and already doing the work.

> The ceiling on paper circularity is not set by chemistry. It is set by logistics, design decisions and who gets paid for sorting.

## Limit three: fibre arithmetic

Fibres shorten each cycle. A closed loop with no fresh input degrades until it cannot perform. Any credible circular model includes responsibly sourced new fibre entering continuously.

Accepting this openly is more useful than implying perfect circularity, because it directs attention to the real goal: maximising the number of useful cycles rather than pretending there are infinite ones.

## What progress would look like

1. **Design rules applied before launch**, not recyclability assessed afterwards.
2. **Collection that pays for cleanliness**, so grading quality is rewarded rather than only tonnage.
3. **Grade-matched products**, where recovered fibre goes where its properties fit.
4. **Honest measurement**, reporting what mills actually accepted rather than what was collected.
5. **Fresh fibre from traceable sources**, treated as part of the circular system rather than an embarrassment.

## The Indian opportunity

An industry already running substantially on recovered fibre, with a large mill base and growing packaging demand, is unusually well placed. The gains available are in the quality of what reaches the mill. That is an organisational problem, which is the kind that can actually be solved.`,
  },
  "fibre-isnt-one-thing": {
    readingMinutes: 7,
    sources: [PAPER_REF, CEPI_FIBRE_LOOP, NITI_BAMBOO, BAGASSE],
    body: `"Fibre" is used as though it names a single substance. It names a category with members that behave so differently that substituting one for another can ruin a product.

## Length decides most of it

Softwood fibres are long, typically a few millimetres, and produce strong, tear-resistant sheets. They are what a sack or a shipping sack needs.

Hardwood fibres are shorter and more numerous for the same mass, giving a smoother, more uniform, better-printing surface. They are what a book page needs.

Most papers are a blend, because the two properties are wanted together in different proportions.

> Asking whether a fibre is good is like asking whether a tool is good. Good for what?

## Non-wood fibres

**Bagasse**, the residue left after sugarcane is crushed, is a significant pulp input where cane is processed at scale.

**Straw and other agro-residues** are used similarly, with the seasonality of the harvest as the main operational constraint.

**Bamboo** grows quickly, is largely farm-grown, and has long been a pulp input in India.

**Cotton** fibre is long and pure, and is used where durability matters most. Indian banknote paper is made using cotton.

## Recovered fibre is its own category

Recovered fibre is not a fourth species but a condition. It has been pulped, pressed, dried and pulped again, and each cycle shortens it and removes fines. It is excellent where bulk and compression strength matter, and poorly suited to applications demanding long fibres and high brightness.

## Why this matters to a reader

Claims about "paper" that do not say which fibre are usually too general to check. A statement about long-fibre sack kraft from softwood and a statement about moulded trays from recovered fibre are statements about different industries.

The first question for any claim is simple: which fibre, and for what job?`,
  },

  "clean-separation-protects-fibre": {
    readingMinutes: 7,
    sources: [CEPI_RULES, CEPI_RECYCLABILITY, PAPER_RECYCLING, CSE],
    body: `Separation is the least technical step in the recovery chain and the one that destroys the most value when it goes wrong. It takes seconds, needs no equipment, and determines whether a mill can use the material at all.

## What contamination actually does

**Food and oil.** Grease migrates through board and cannot be screened out, because it is not a particle. Contaminated material is downgraded or rejected, and a small quantity can affect a much larger batch.

**Water.** Wet fibre loses strength and gains weight, so a wet load costs more to move and delivers less.

**Plastics and foils.** Removable, but every removal step costs energy and carries some fibre away with the rejects.

**Adhesives.** The hardest case. Stickies deform and can pass through screens that would stop a rigid particle, then cause defects downstream.

> Screening removes particles. It cannot remove grease, and it cannot undo water.

## Why one person's bin matters at scale

Recovered paper moves in bulk. One contaminated contribution mixes with many clean ones and the whole load is assessed as a unit. That is why collectors are strict about what they accept: they are protecting the value of everyone else's material.

## The short version

1. **Dry** matters most. Keep paper under cover.
2. **No food.** Separate the greasy part and recover the clean part.
3. **Flatten** boxes so transport pays.
4. **Remove obvious plastic**: windows, heavy tape, ring binders.
5. **Do not worry** about staples or ordinary printing ink.

## The part that is easy to miss

Separation is not about tidiness. It is a quality-control step in someone else's manufacturing process, performed by the public, unpaid, at the point where it is cheapest to do.`,
  },

  "bagasse-agricultural-residue-paper": {
    readingMinutes: 7,
    sources: [BAGASSE, NITI_BAMBOO, DPIIT, IPMA],
    body: `Not all paper fibre comes from trees. A meaningful share of Indian paper begins as the residue of a food crop, which changes both the land-use argument and the operational one.

## What bagasse is

When sugarcane is crushed for juice, a fibrous residue remains. That residue is bagasse. It is produced in large quantities at sugar mills, concentrated in one place, and already harvested, so it carries no additional land demand of its own.

Traditionally much of it was burned for process heat. Where the fibre can be used for pulp instead, it becomes a material input rather than fuel.

## Why it suits paper

- The fibre length sits usefully between hardwood and softwood for many grades.
- It arrives concentrated at the sugar mill rather than dispersed across a landscape.
- It is a by-product, so it does not compete with food production for land.

> The strongest argument for agro-residue pulp is not the fibre. It is that the land was already farmed for something else.

## The real constraints

**Seasonality.** Cane is crushed in a season. A paper mill runs all year. Bridging that gap means storing large volumes of a material that degrades if stored badly.

**Depithing.** Bagasse contains pith, which is short, absorbs chemicals and harms drainage. It has to be removed before pulping, which is an extra step with its own cost.

**Competing use.** Bagasse burned for energy displaces other fuel at the sugar mill. Using it for pulp means the mill needs another heat source, so the comparison is not fibre against nothing.

**Silica.** Agro-residues carry more silica than wood, which complicates chemical recovery.

## Where it sits in the Indian mix

Indian mills draw on recovered paper, wood from farm forestry and agro-residues including bagasse and straw, alongside continuing work on bamboo. That diversity is a genuine feature of the Indian industry and it is why forestry arguments imported from other countries often describe the wrong system.`,
  },

  "what-paper-grammage-means": {
    readingMinutes: 6,
    sources: [GRAMMAGE, PAPER_REF, CEPI_RECYCLABILITY],
    body: `Grammage is the number printed on every ream and understood by almost nobody who buys one. It is worth two minutes, because it is the main lever on how much material a paper decision consumes.

## The definition

Grammage is mass per unit area, expressed in grams per square metre. An 80 gsm paper weighs 80 grams for every square metre of it, regardless of sheet size.

This is why gsm is comparable across formats in a way that "weight per ream" is not. A ream of A3 weighs twice a ream of A4 at identical gsm, because there is twice the area.

## What it does and does not tell you

Grammage is not thickness. Two papers at the same gsm can differ in caliper depending on how bulky the sheet is, which is controlled by fibre type, filler content and pressing.

It is also not quality. A heavier sheet is not automatically better. It is more material, and sometimes that material does nothing except make a document feel substantial.

> Specifying heavier paper than the job needs is the most common way an office spends money and fibre on nothing.

## Rough working ranges

- **45 to 60 gsm**: newsprint and lightweight publication papers.
- **70 to 90 gsm**: ordinary office and printing paper. 70 to 80 covers almost all internal use.
- **100 to 170 gsm**: brochures, covers, heavier publication work.
- **Above about 200 gsm**: generally described as board rather than paper, used for cards and cartons.
- **Corrugated board** is quoted differently, by the grammage of each liner and the flute profile.

## The practical decision

Ask what the sheet has to survive. A document read once at a desk needs less than a form that will be handled for a year. Matching grammage to the real requirement is a single decision, taken at purchasing, that quietly governs material use for everything printed afterwards.`,
  },

  "choosing-paper-food-contact": {
    readingMinutes: 7,
    sources: [CEPI_RECYCLABILITY, PAPER_REF, CEPI_RULES],
    body: `Paper that touches food has to do two jobs that pull against each other: keep the food safe and intact, and remain recoverable afterwards. Understanding the tension explains why food packaging is the hardest category in paper recycling.

## What food contact demands

**A barrier.** Most food needs protection from grease, moisture or oxygen. Uncoated paper provides almost none of this.

**Safety of what migrates.** Anything that can move from the packaging into the food is regulated, which constrains what recovered fibre can be used for directly in food contact without a barrier between.

**Strength when wet or warm**, for anything hot or damp.

## How barriers are achieved

- **Polymer coatings**, effective and historically the hardest to separate in recovery.
- **Dispersion coatings**, water-based and designed to be more compatible with repulping.
- **Greaseproof papers**, where the barrier comes from how the fibre itself was refined rather than from an added layer.
- **Aluminium layers**, used where oxygen barrier requirements are high, and difficult for fibre recovery.

> Every barrier that protects the food is also a thing the mill has to deal with later. The craft is finding the lightest barrier that still does the job.

## The contamination problem after use

Even a perfectly recoverable construction arrives covered in food. Grease cannot be screened out, so the realistic instruction is to recover the clean portion and discard the soaked one.

## Choosing well

1. Ask what barrier the food genuinely needs, rather than specifying the strongest available.
2. Prefer dispersion coatings or refined greaseproof where they will do.
3. Avoid metallised layers unless the oxygen barrier is truly required.
4. Tell the customer what to do with it, specifically, on the pack.
5. Remember that packaging failure wastes the food, which is usually the larger loss by a wide margin.`,
  },

  "epr-paper-packaging-explained": {
    readingMinutes: 7,
    sources: [CSE, CEPI_RECYCLABILITY, IBEF, DPIIT],
    body: `Extended producer responsibility is a simple idea with complicated execution: the business that puts packaging on the market carries responsibility for what happens to it afterwards, rather than leaving that entirely to municipalities and the public.

## What the idea is trying to fix

Packaging decisions are made by one party and their consequences are paid for by another. A designer choosing a construction that cannot be recovered imposes a cost on a collection system they do not fund.

EPR connects those two, so that the cost of recovery appears in the decision that creates it.

> EPR does not make packaging recyclable. It makes somebody accountable for whether it is.

## How schemes generally work

1. **Registration** of businesses placing packaging on the market.
2. **Reporting** of quantities and material types.
3. **Targets** for collection and recycling.
4. **Payment**, either into a scheme or through contracted collection.
5. **Verification**, which is where schemes succeed or fail.

## Where paper sits

In India, extended producer responsibility is most developed and most explicit for plastic packaging. The treatment of paper and fibre-based packaging varies, and anyone with a compliance question should check the current rules for their own category rather than assume the plastic framework applies unchanged.

What is consistent is the direction of travel: more reporting, more traceability, and more attention to whether material actually reached a recycler.

## Why paper is an unusual case

Paper already has something most materials lack: an established collection network and a market that pays for recovered fibre. A large part of Indian collection is informal and already functioning.

That changes the design question. For paper, the goal is less about creating a system and more about improving the quality of what the existing system delivers, and about whether the people doing the collecting are recognised in the formal scheme.

## What a business should actually do

- Know which categories your packaging falls into, by material.
- Keep records good enough to report, before you are asked.
- Design for the recovery route that exists where your product is sold.
- Treat the collector as a stakeholder, because they decide what is practical.`,
  },

  "libraries-extend-book-life": {
    readingMinutes: 6,
    sources: [PAPER_REF, CEPI_FIBRE_LOOP, FAO_PLANTED],
    body: `A library is a piece of environmental infrastructure that nobody describes that way. Its function, materially speaking, is to raise the number of readings per book by a very large factor.

## The arithmetic of shared reading

A book bought and read once by one person delivers one reading for its entire material cost. The same book in a library may deliver dozens or hundreds.

No change to the paper, printing or binding comes close to that ratio. Sharing is the most effective intervention available for printed matter, and it requires no new technology.

> The greenest book is almost always the one that already exists and is being read again.

## Why books last

Books are built for it. Sewn or well-glued bindings, boards that protect the text block, and paper chosen for longevity rather than minimum cost. Libraries add repair, rebinding and controlled storage.

Paper kept dry and out of strong light is a remarkably durable medium. Degradation comes mostly from moisture, acidity and handling, and all three can be managed.

## What libraries do beyond lending

- **Repair** rather than replace.
- **Store** under conditions that slow degradation.
- **Redistribute** withdrawn stock to other collections or sales rather than discarding it.
- **Provide access without ownership**, which removes the need for many copies.
- **Serve readers without devices or connectivity**, which no digital substitute does.

## The honest limits

Not everything should be a shared physical copy. A reference work consulted for thirty seconds by thousands of people is better served digitally. Textbooks that change annually are a difficult case, and the annual change is often the real problem.

## The practical point

For an institution thinking about paper, the highest-leverage question is not which paper to buy. It is whether the copies already bought are circulating or sitting on shelves in individual offices.`,
  },

  "water-in-paper-mills": {
    readingMinutes: 7,
    sources: [PAPER_MACHINE, PAPER_REF, CEPI_RECYCLABILITY, DPIIT],
    body: `Papermaking is often described as water-intensive. The more accurate description is water-dependent: a mill moves enormous volumes of water, and the environmental question is how much of it is consumed rather than circulated.

## Why so much water is needed

To form an even sheet, fibres must be suspended far apart. The stock arriving at the forming section is overwhelmingly water, with only a small fraction of solids. Without that dilution, fibres clump and the sheet is uneven.

Almost all of that water is removed again within seconds and metres.

## How water leaves, in order of cost

1. **Drainage** through the forming wire, driven by gravity and suction. Cheapest by a wide margin.
2. **Pressing** between rollers, squeezing water out mechanically. Still relatively cheap.
3. **Drying** with heated cylinders, evaporating what remains. By far the most energy-intensive step.

Mill engineering is largely about removing as much water as possible at stages one and two, because every kilogram left for stage three costs heat.

> The art of a paper machine is getting water out before the dryers have to.

## Circulated, not consumed

Most of the water drained at the wire is captured and reused within the mill. It returns to dilute incoming stock, carrying fines and fillers with it, which also recovers material that would otherwise be lost.

A mill's water performance is therefore measured by fresh intake per tonne produced, not by how much water passes through the machine.

## Where water is genuinely lost

- Evaporation in the dryers.
- Moisture retained in the finished product.
- Effluent discharged after treatment.
- Losses with sludge and rejects.

## Why it matters in India

Water availability is contested in many Indian regions, which makes fresh intake per tonne a locally significant figure rather than a general one. Mills that run tighter water circuits reduce both their intake and their effluent load, and the two improve together.

A useful question for any mill claim is simple: how much fresh water per tonne, and how is the effluent treated?`,
  },

  "coatings-adhesives-recovery": {
    readingMinutes: 7,
    sources: [CEPI_RECYCLABILITY, PAPER_RECYCLING, DEINKING],
    body: `Coatings and adhesives are added because a product needs them. They are also the main reason a fibre-based product can turn out not to be recoverable. Both things are true, and the useful work is in the trade-off.

## Why they are there

A coating provides a barrier, a printing surface or a gloss. An adhesive holds a box, a label or a binding together. Remove them and many products stop functioning.

The question is never whether to allow them. It is which version, how much, and whether the recovery system can cope.

## How recovery handles each

**Mineral coatings** such as clay or calcium carbonate generally disperse in the pulper. They end up in the fines and are partly recovered with fillers, partly lost with sludge. Usually manageable.

**Dispersion coatings** are water-based and designed to repulp. These are the cooperative case.

**Polymer film laminates** do not disperse. The fibre has to be separated from the film, which needs capability that is not present everywhere.

**Metallised layers** are the hardest, because the barrier that makes them useful is exactly what makes separation difficult.

**Adhesives** are the most troublesome category overall, not because there is a lot of them but because of how they behave.

## The stickies problem

Pressure-sensitive adhesives, from labels and tapes, break into soft, deformable particles. A rigid particle of a given size is stopped by a screen slot narrower than itself. A sticky one can deform and pass through, then redeposit on equipment or appear as a defect in the finished sheet.

> Screens sort by size and shape. Stickies are a problem precisely because they refuse to keep either.

## What good design looks like

1. Use the lightest barrier that meets the real requirement.
2. Prefer dispersion coatings where performance allows.
3. Choose adhesives designed to be screenable, and use less of them.
4. Keep removable elements removable, so a user can separate them.
5. Check the construction against recyclability guidelines before launch, not after complaints.

None of this requires abandoning function. It requires treating recovery as a design input alongside protection and appearance.`,
  },

  "credible-paper-claims-checklist": {
    readingMinutes: 7,
    sources: [CEPI_RECYCLABILITY, FAO_PLANTED, IPMA, CSE],
    body: `Most misleading paper claims are not lies. They are true statements with the conditions removed. This is a checklist for putting the conditions back.

## 1. What exactly is being claimed?

"Eco-friendly" and "sustainable" are not claims; they are moods. A claim has a subject and a property: this board contains this proportion of post-consumer fibre, this pack is accepted by this collection system.

If you cannot restate it as something that could be false, it is not yet a claim.

## 2. What is the boundary?

Which product, which place, which time period, which use? A recyclability statement true in one city may be false in another because the determining factor is local capability.

## 3. Who says so, and can you read it?

A named source with a date and a method is evidence. A logo, a colour scheme or a phrase like "studies show" is not. Ask what the certification actually audits, and when it was last checked.

> A number without a method is decoration.

## 4. Is the comparison fair?

If something is "better", better than what, measured how, over what service? Comparisons that change the functional unit between the two options are the most common way to produce any desired answer.

## 5. Does the part stand in for the whole?

Recycled content refers to material, not to the footprint of making it. A certification covers sourcing, not mill efficiency. Each is useful and none is a summary of the rest.

## 6. What would change the conclusion?

A credible claim can say what evidence would overturn it. One that cannot is not being held to anything.

## Applying it

Take a pack from your desk and run the six questions. Most claims survive two or three and fail the rest, which does not make the product bad. It means you now know what the label told you and what it did not, which is the whole point.`,
  },

  "india-fibre-basket": {
    readingMinutes: 9,
    sources: [DPIIT, IPMA, NITI_BAMBOO, BAGASSE, CSE, TRADESTAT],
    body: `Arguments about paper and forests are usually imported, and usually describe industrial logging of natural forest in temperate countries. That is not how Indian mills are mainly supplied, and the difference matters for almost every conclusion drawn from it.

## Four streams, not one

**Recovered paper.** The largest single input. Indian production leans heavily on recovered fibre, drawn from domestic collection and supplemented by imports where domestic supply falls short of mill demand.

**Farm forestry.** Pulpwood grown as an agricultural crop by farmers on farmland, outside natural forest, often under arrangements with mills that provide planting material and a purchase commitment.

**Agro-residues.** Bagasse from sugar processing and straw from cereal harvests, already produced as by-products of food production.

**Bamboo.** Fast-growing, largely farm-grown, and a long-standing pulp input with continuing work on expanding its role.

> The Indian question is rarely whether there are enough trees. It is whether enough clean recovered paper reaches the mills.

## What this changes

Three common arguments land differently here.

**"Paper destroys forests."** When the fibre is a sugar by-product, a farmer's crop or last month's cartons, the chain being described does not exist in the usual form.

**"Recycling is the answer."** Indian mills already run substantially on recovered fibre. The marginal gain is in collection quality and sorting, not in persuading mills to accept recycled material.

**"Imports are a failure."** Recovered paper is traded internationally like any commodity. Imports fill a gap between domestic collection and mill demand, and that gap is a collection-infrastructure fact.

## The real constraint

Studies of Indian wastepaper circularity identify collection and sorting capacity as the binding limitation. Material exists; it arrives contaminated, mixed, or not at all. A large informal network already does much of this work.

So the productive questions are about systems and livelihoods: how material is captured, how cleanly it is sorted, who is paid for that sorting, and whether they are recognised in formal schemes.

## What to ask about an Indian paper product

1. Which of the four streams does this fibre come from?
2. If farm forestry, which region, and what is the arrangement with growers?
3. If recovered, domestic or imported, and at what grade?
4. If agro-residue, what does the sugar or grain mill do for heat instead?

Those questions have answers. "Is Indian paper sustainable?" does not.`,
  },

  "hidden-infrastructure-waste-paper": {
    readingMinutes: 9,
    sources: [CSE, CEPI_RULES, PAPER_RECYCLING, IBEF],
    body: `Between the bin and the mill there is an entire industry that most people never see and few policies account for properly. In India it is substantially informal, and it recovers a great deal of material.

## The chain

**Collection** at the point of discard: households, shops, offices, institutions. Often by individual collectors buying material directly, which is why the material is already separated when it moves.

**Aggregation** by small dealers who buy from collectors and accumulate enough volume to be worth transporting.

**Grading and baling** by larger traders, sorting mixed material into specified grades and compressing it into bales a mill can price.

**Transport** to mills, where density decides whether the journey pays.

> Recovered paper does not flow because people are virtuous. It flows because at every step somebody can buy it for less than they can sell it for.

## Why this system works well

It is responsive, low-capital and already everywhere. It captures material at the point of discard, before contamination, which is the single biggest determinant of value. Buying rather than merely collecting creates an incentive for households to keep paper clean and separate.

## Where it is fragile

**Price exposure.** Recovered paper prices move with global commodity markets. When they fall, collection becomes unprofitable and material that was being recovered goes to waste instead.

**No recognition.** Workers who are not part of a formal scheme are usually excluded from its protections, and sometimes from its payments, while doing the work the scheme is designed to produce.

**Quality ceiling.** Hand sorting is good at obvious separations and limited for fine grading, which caps the value of the output.

**Working conditions.** Handling mixed waste without equipment carries real health risks.

## What improvement looks like

1. Recognise existing collectors within formal schemes rather than building parallel systems that compete with them.
2. Pay for grade, not only for tonnage, so cleanliness is rewarded where it is produced.
3. Invest in sorting capacity at aggregation points, which is where the quality ceiling sits.
4. Provide cover against price collapse, because recovery stopping during a downturn is a system failure.
5. Improve conditions for the people doing the handling.

## Why it should matter to a reader

The decision at the bin enters this chain immediately. Clean, dry, separated paper raises the value of the first transaction, and that value travels along the whole chain. It is a small act with a surprisingly direct economic consequence for someone.`,
  },

  "paper-carbon-and-time": {
    readingMinutes: 9,
    sources: [FAO_PLANTED, FAO_FORESTRY, CEPI_FIBRE_LOOP, CEPI_RECYCLABILITY, IEA_DATA],
    body: `Carbon arguments about paper tend to go wrong in the same way: they compare quantities without comparing timescales. A tonne of carbon released now and a tonne released over forty years are not the same thing, and most disagreements about paper and climate are really disagreements about time.

## Growing stores carbon, slowly

A growing tree takes up carbon dioxide and holds carbon in wood, roots and soil. A managed stand does this on a cycle: accumulation, harvest, regrowth, accumulation again.

Across a well-managed estate harvested in rotation, some stands are always growing while others are harvested. The stock at landscape level can be stable even though individual stands change constantly.

> Looking at one harvested stand and concluding carbon was lost is like looking at one withdrawal and concluding a bank is empty.

## Products store carbon while they exist

Carbon in a paper product stays there while the product exists. For a newspaper that is days. For a book, decades. For board in long-term storage, years.

This is a genuine but modest effect, and its size depends entirely on the lifetime of the product, which is why duration belongs in every claim.

## Where emissions actually occur

- **Harvest and transport**, usually modest.
- **Pulping and papermaking**, dominated by heat for drying. This is where most of it is, and where mill efficiency and energy source dominate.
- **Converting and distribution.**
- **End of life.** This is the one most often mishandled in argument.

## Why landfill is the bad outcome

Paper that decomposes in an anaerobic landfill releases methane, a greenhouse gas considerably more potent than carbon dioxide over the periods that matter for policy. Diverting paper away from landfill into recovery avoids that pathway entirely.

That makes recovery a climate measure, not only a materials one, and it is the strongest climate argument for keeping paper out of mixed waste.

## Why recycling helps, and why it is not unlimited

Recovering fibre avoids producing an equivalent quantity of new fibre, with the energy that would have required. But fibres shorten each cycle, so the loop needs fresh input. The honest framing is that recycling extends the period over which a given quantity of fibre keeps doing work.

## Comparing with digital

Digital alternatives have their own footprint in devices, networks and data centres, which the IEA tracks because it is material at scale. A fair comparison names the device, its lifetime and how much is read on it. Comparing a single printed page with an abstract notion of weightless digital delivery is not a comparison.

## The question that does the work

For any paper claim about carbon: over what period, at what scale, and compared with what alternative at the end of life? Most confident claims are missing at least two of the three.`,
  },

  "designing-packaging-for-circularity": {
    readingMinutes: 9,
    sources: [CEPI_RECYCLABILITY, PAPER_RECYCLING, CEPI_RULES, IBEF],
    body: `Most packaging that cannot be recycled was designed by people who never asked whether it could be. Not from carelessness: recovery simply was not on the brief alongside protection, print quality, line speed and cost.

Putting it on the brief is most of the work.

## Protection comes first, and that is correct

A pack that fails has wasted everything inside it, which almost always exceeds the footprint of the pack. Any circularity proposal that increases product damage is a net loss.

So the design question is not how to minimise packaging. It is how to achieve the required protection with a construction that can be recovered.

> Under-packaging is not an environmental strategy. It moves the waste from the pack to the product and makes it bigger.

## The decisions that decide recoverability

**Material count.** Every additional material is a separation step. Fibre alone is easiest; fibre plus a dispersion coating is usually manageable; fibre plus polymer film plus metallised layer is the hard case.

**Adhesive choice and quantity.** Screenable adhesives used sparingly are the difference between a routine load and a stickies problem.

**Separability.** If a non-fibre component cannot be eliminated, can a user remove it in one obvious action? A window that pulls out is better than one bonded across the whole face.

**Ink coverage.** Heavy coverage increases the deinking load for grades that need brightness.

**Size and fit.** Over-sized packs waste material in the pack and space in transport, which is often the larger effect.

## Design for the system that exists

Recyclability is local. A construction recoverable where there is advanced separation capacity may have no route where there is not.

For products sold across very different systems, the honest choices are to design for the least capable one, or to say plainly on the pack what is required where. Either is better than a general symbol that means nothing in particular.

## A workable sequence

1. Define the protection requirement from the product, not from convention.
2. Specify the minimum construction that meets it.
3. Check it against recyclability guidelines before tooling, not after launch.
4. Confirm a route exists in the main markets where it will be discarded.
5. Put specific instructions on the pack.
6. Re-check when the product, the route or the regulation changes.

## Why this is worth the effort

A pack is designed once and discarded millions of times. Few decisions in a business have that ratio between the effort of deciding well and the consequence of deciding badly.`,
  },

  "next-indian-paper-mill": {
    readingMinutes: 9,
    sources: [DPIIT, IBEF, CSE, IPMA, NITI_BAMBOO, TRADESTAT],
    body: `Think about what the next Indian paper mill would have to be, and the industry's real constraints become concrete in a way that general discussion never manages.

## It would be built for recovered fibre

Indian production already leans heavily on recovered fibre, and packaging demand has grown with organised retail and e-commerce. A new mill is far more likely to be a recycled-containerboard line than a fresh-pulp operation.

That decides much of the rest: the pulping line, the cleaning stages, the effluent treatment and the location.

## Location follows fibre and water

A recovered-fibre mill wants to be near where recovered paper is generated and aggregated, which means near urban concentrations rather than near forests.

It also needs water, and water availability is contested in many Indian regions. Fresh intake per tonne is therefore a siting constraint, not only an operating metric.

> A modern mill is designed around two flows: where the fibre comes from and where the water goes.

## It would have to handle dirtier input than it would like

This is the operational heart of the matter. Collection quality is the binding constraint identified repeatedly in Indian wastepaper studies, so a new mill must assume variable, contaminated input and invest in cleaning accordingly.

Every additional cleaning stage costs capital and energy and takes some fibre with the rejects. Cleaner input at the source is cheaper than any equipment that compensates for dirty input, which is why mills increasingly care about what happens at the bin.

## Energy would be the defining choice

Drying dominates energy use in papermaking. The heat source therefore dominates the mill's footprint, and it is the decision with the longest consequence, because a mill built now will run for decades.

## It would need a fibre strategy, not a fibre supplier

Recovered paper prices move with global markets. Agro-residues are seasonal. Farm forestry depends on growers continuing to plant, which depends on previous harvests having paid.

A mill planned around a single input is exposed. A mill planned around a mix, with the flexibility to shift between them, is not.

## What would make it genuinely good

1. Fresh water intake per tonne low enough to be defensible where it is sited.
2. A heat source chosen for the next twenty years, not the next two.
3. Cleaning capacity matched to realistic input quality rather than optimistic assumptions.
4. Procurement that pays for grade, so cleanliness is rewarded upstream.
5. Relationships with growers and collectors that survive a price downturn.

None of this is exotic. It is the ordinary discipline of building for the system that exists rather than the one in the brochure.`,
  },
};
