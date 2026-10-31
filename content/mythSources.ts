/**
 * Sources attached to each myth in the public catalogue.
 *
 * Each entry points at material that covers the subject of that specific
 * claim, drawn from the same verified pool the articles use. A myth with no
 * entry here is shown to readers as awaiting a citation rather than being
 * presented as though one exists.
 */

export type MythSource = { label: string; url: string };

const FAO_PLANTED: MythSource = {
  label: "FAO guidance on managing planted forests",
  url: "https://www.fao.org/sustainable-forest-management/toolbox/modules/management-of-planted-forests/further-learning/en/",
};
const FAO_FORESTRY: MythSource = { label: "FAO Forestry", url: "https://www.fao.org/forestry/en/" };
const IPMA: MythSource = {
  label: "IPMA, Paper Industry Myths versus Realities",
  url: "https://ipmaindia.org/wp-content/uploads/2023/11/Myths-versus-Realities-Sep23.pdf",
};
const DPIIT: MythSource = {
  label: "DPIIT Annual Report 2025 to 2026",
  url: "https://www.dpiit.gov.in/static/uploads/2026/03/863a5fef349d79a1bba316c4b51eaacb.pdf",
};
const NITI_BAMBOO: MythSource = {
  label: "NITI Aayog, Bamboo for Pulp and Paper",
  url: "https://niti.gov.in/sites/default/files/2022-02/Bamboo_Presentations/Technical_Session_3_Bamboo_for_Pulp_and_Paper_Shri_Sanjeev_Jain.pdf",
};
const BAGASSE: MythSource = { label: "Bagasse, technical reference", url: "https://en.wikipedia.org/wiki/Bagasse" };
const CEPI_RECYCLABILITY: MythSource = {
  label: "CEPI recyclability guidelines",
  url: "https://www.cepi.org/wp-content/uploads/2020/10/Cepi_recyclability-guidelines.pdf",
};
const CEPI_FIBRE_LOOP: MythSource = {
  label: "CEPI position paper on the fibre loop",
  url: "https://www.cepi.org/wp-content/uploads/2022/10/PPCG-MG-22-030_Cepi-position-paper.pdf",
};
const CEPI_RULES: MythSource = {
  label: "European recovered-paper collection rules",
  url: "https://www.cepi.org/simple-paper-recycling-rules-from-the-erpc/",
};
const PAPER_RECYCLING: MythSource = {
  label: "Paper recycling, technical reference",
  url: "https://en.wikipedia.org/wiki/Paper_recycling",
};
const DEINKING: MythSource = { label: "Deinking, technical reference", url: "https://en.wikipedia.org/wiki/Deinking" };
const PAPER_MACHINE: MythSource = {
  label: "Paper machine, technical reference",
  url: "https://en.wikipedia.org/wiki/Paper_machine",
};
const PAPER_REF: MythSource = { label: "Paper, technical reference", url: "https://en.wikipedia.org/wiki/Paper" };
const IEA_DATA: MythSource = {
  label: "IEA on data centres and transmission networks",
  url: "https://www.iea.org/energy-system/buildings/data-centres-and-data-transmission-networks",
};
const CSE: MythSource = {
  label: "CSE study on wastepaper circularity in India",
  url: "https://www.cseindia.org/improving-wastepaper-circularity-for-the-pulp-and-paper-sector-12004",
};

/** Keyed by the catalogue id, for example "myth-01". */
export const mythSources: Record<string, MythSource[]> = {
  // Forests, land use and fibre origin
  "myth-01": [FAO_PLANTED, IPMA],
  "myth-02": [FAO_FORESTRY, FAO_PLANTED],
  "myth-03": [FAO_PLANTED, FAO_FORESTRY],
  "myth-04": [FAO_PLANTED],
  "myth-05": [FAO_PLANTED, FAO_FORESTRY],
  "myth-06": [FAO_PLANTED, CEPI_FIBRE_LOOP],
  "myth-07": [PAPER_REF, BAGASSE],
  "myth-08": [FAO_FORESTRY, IPMA],
  "myth-09": [FAO_PLANTED, FAO_FORESTRY],
  "myth-10": [FAO_FORESTRY, FAO_PLANTED],
  "myth-11": [FAO_PLANTED, CEPI_FIBRE_LOOP],
  "myth-12": [FAO_PLANTED, IPMA],
  "myth-13": [FAO_PLANTED, FAO_FORESTRY],
  "myth-14": [IPMA, DPIIT],
  "myth-15": [IPMA, FAO_PLANTED],
  "myth-16": [IPMA, FAO_PLANTED],
  "myth-17": [BAGASSE, IPMA],
  "myth-18": [NITI_BAMBOO, FAO_PLANTED],
  "myth-19": [BAGASSE, CEPI_FIBRE_LOOP],

  // Recycling, contamination and collection
  "myth-20": [CEPI_FIBRE_LOOP, PAPER_RECYCLING],
  "myth-21": [PAPER_RECYCLING, CEPI_RULES],
  "myth-22": [DEINKING, PAPER_RECYCLING],
  "myth-23": [CEPI_RECYCLABILITY, PAPER_RECYCLING],
  "myth-24": [CEPI_RECYCLABILITY, CEPI_RULES],
  "myth-25": [CEPI_RULES, CEPI_RECYCLABILITY],
  "myth-26": [CEPI_RULES, PAPER_RECYCLING],
  "myth-27": [CEPI_RECYCLABILITY, PAPER_RECYCLING],
  "myth-28": [CEPI_RULES, CEPI_RECYCLABILITY],
  "myth-29": [CEPI_FIBRE_LOOP, PAPER_RECYCLING],
  "myth-30": [CEPI_RECYCLABILITY, CSE],
  "myth-31": [PAPER_RECYCLING, CSE],
  "myth-32": [CEPI_RECYCLABILITY, PAPER_RECYCLING],

  // Packaging, materials and comparison
  "myth-33": [CEPI_RECYCLABILITY],
  "myth-34": [CEPI_RECYCLABILITY, PAPER_REF],
  "myth-35": [CEPI_RECYCLABILITY, PAPER_REF],
  "myth-36": [CEPI_RECYCLABILITY, PAPER_REF],
  "myth-37": [CEPI_RECYCLABILITY],
  "myth-38": [CEPI_RECYCLABILITY, CEPI_FIBRE_LOOP],

  // Digital and paper
  "myth-39": [IEA_DATA],
  "myth-40": [IEA_DATA, CEPI_RECYCLABILITY],
  "myth-41": [IEA_DATA],
  "myth-42": [IEA_DATA, CEPI_RULES],
  "myth-43": [IEA_DATA, PAPER_MACHINE],
  "myth-44": [IEA_DATA, PAPER_REF],

  // Mill process, water, energy and chemistry
  "myth-45": [PAPER_MACHINE, DPIIT],
  "myth-46": [PAPER_MACHINE, PAPER_REF],
  "myth-47": [PAPER_MACHINE, DPIIT],
  "myth-48": [PAPER_REF, PAPER_MACHINE],
  "myth-49": [PAPER_MACHINE, DPIIT],
  "myth-50": [PAPER_REF, PAPER_MACHINE],
  "myth-51": [PAPER_REF, PAPER_MACHINE],
  "myth-52": [PAPER_MACHINE, CEPI_FIBRE_LOOP],

  // Use, claims and labels
  "myth-53": [PAPER_REF],
  "myth-54": [CEPI_FIBRE_LOOP, IPMA],
  "myth-55": [CEPI_FIBRE_LOOP, CEPI_RECYCLABILITY],
  "myth-56": [PAPER_REF, DEINKING],
  "myth-57": [CEPI_RECYCLABILITY, CSE],
  "myth-58": [FAO_PLANTED, CEPI_RECYCLABILITY],
  "myth-59": [PAPER_RECYCLING, CSE],
  "myth-60": [CEPI_RECYCLABILITY, FAO_PLANTED],
};
