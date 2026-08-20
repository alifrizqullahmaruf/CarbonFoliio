/**
 * A small, hand-picked sample of real, retired carbon credit projects,
 * sourced from CarbonPlan's OffsetsDB (https://carbonplan.org/research/offsets-db),
 * a free, open snapshot of Verra, Gold Standard, ACR, CAR and other registries.
 * Shown for reference only — these are not the tokens tracked by MockCarbonCredit.
 */
export interface ReferenceCredit {
  projectId: string;
  name: string;
  country: string;
  registry: string;
  projectType: string;
  retired: number;
  projectUrl: string;
}

export const REFERENCE_CREDITS: ReferenceCredit[] = [
  {
    projectId: "VCS487",
    name: "210 MW Musi Hydro Power Plant, Bengkulu",
    country: "Indonesia",
    registry: "Verra VCS",
    projectType: "Hydropower",
    retired: 5850891,
    projectUrl: "https://registry.verra.org/app/projectDetail/VCS/487",
  },
  {
    projectId: "VCS488",
    name: "82 MW Lau Renun Hydro Power Plant, North Sumatra",
    country: "Indonesia",
    registry: "Verra VCS",
    projectType: "Hydropower",
    retired: 2146823,
    projectUrl: "https://registry.verra.org/app/projectDetail/VCS/488",
  },
  {
    projectId: "ACR114",
    name: "GreenTrees ACRE (Advanced Carbon Restored Ecosystem)",
    country: "United States",
    registry: "American Carbon Registry",
    projectType: "Afforestation + Reforestation",
    retired: 4379615,
    projectUrl: "https://acr2.apx.com/mymodule/reg/prjView.asp?id1=114",
  },
  {
    projectId: "ACR212",
    name: "UPM Blandin Native American Hardwoods Conservation & Carbon Sequestration Project",
    country: "United States",
    registry: "American Carbon Registry",
    projectType: "Improved Forest Management",
    retired: 1538225,
    projectUrl: "https://acr2.apx.com/mymodule/reg/prjView.asp?id1=212",
  },
  {
    projectId: "CAR639",
    name: "El Dorado Nitrogen, LP – Nitrous Oxide Abatement Project",
    country: "United States",
    registry: "Climate Action Reserve",
    projectType: "N₂O Destruction (Nitric Acid)",
    retired: 9933833,
    projectUrl: "https://thereserve2.apx.com/mymodule/reg/prjView.asp?id1=639",
  },
  {
    projectId: "CAR1480",
    name: "Phlogiston Phase I",
    country: "United States",
    registry: "Climate Action Reserve",
    projectType: "N₂O Destruction (Adipic Acid)",
    retired: 9543751,
    projectUrl: "https://thereserve2.apx.com/mymodule/reg/prjView.asp?id1=1480",
  },
  {
    projectId: "VCS1742",
    name: "Hydroelectric Project in Kinnaur District, Himachal Pradesh",
    country: "India",
    registry: "Verra VCS",
    projectType: "Hydropower",
    retired: 13646221,
    projectUrl: "https://registry.verra.org/app/projectDetail/VCS/1742",
  },
  {
    projectId: "VCS10",
    name: "BAESA Project",
    country: "Brazil",
    registry: "Verra VCS",
    projectType: "Hydropower",
    retired: 5691917,
    projectUrl: "https://registry.verra.org/app/projectDetail/VCS/10",
  },
  {
    projectId: "VCS612",
    name: "The Kasigau Corridor REDD Project – Phase II, The Community Ranches",
    country: "Kenya",
    registry: "Verra VCS",
    projectType: "REDD+",
    retired: 8992884,
    projectUrl: "https://registry.verra.org/app/projectDetail/VCS/612",
  },
];
