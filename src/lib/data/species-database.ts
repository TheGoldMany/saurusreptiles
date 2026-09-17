/**
 * Husbandry database backing the Vivarium Architect Studio.
 *
 * Every record drives real decisions in the configurator: the Ferguson zone
 * picks the Arcadia ProT5 tube, the behaviour flags gate substrate depth and
 * water modules, and `minVolumeL` / `minFootprintCm` decide whether a chosen
 * enclosure is large enough for the animal.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * IMPORTANT — REVIEW BEFORE THIS GATES REAL ORDERS
 * These figures follow widely published keeper guidance (Ferguson et al. UV
 * zones as adopted by Arcadia, plus mainstream care-sheet consensus) and are
 * deliberately conservative. They are a sane starting point, not veterinary
 * advice, and husbandry opinion genuinely differs between keepers. Have a
 * specialist keeper sign off on the values for any species you actually sell
 * against, and treat `minVolumeL` as an adult minimum, never a target.
 * ────────────────────────────────────────────────────────────────────────────
 */

export type FergusonZone = 1 | 2 | 3 | 4;

export type Diet = "carnivore" | "omnivore" | "herbivore" | "insectivore";

export type SpeciesCategory =
  | "agamid"
  | "gecko"
  | "monitor_tegu"
  | "snake"
  | "skink"
  | "chameleon"
  | "amphibian"
  | "tortoise_turtle"
  | "invertebrate";

/** Drives hard requirements in the configurator. */
export type Behaviour = "digging" | "swimming" | "climbing";

/** Which curated planting list applies to this animal's biome. */
export type FloraSet = "arid" | "tropical" | "temperate" | "aquatic" | "none";

export type HusbandrySpecies = {
  id: string;
  latinName: string;
  nameHu: string;
  nameEn: string;
  category: SpeciesCategory;
  fergusonZone: FergusonZone;
  /** Target basking UVI range for the zone. */
  uviRange: [number, number];
  temps: {
    /** Basking hotspot surface temperature, °C */
    baskingC: number;
    /** Cool-end ambient, °C */
    coolC: number;
    /** Permitted night drop, °C */
    nightC: number;
  };
  /** [min%, max%] relative humidity */
  humidity: [number, number];
  diet: Diet;
  behaviours: Behaviour[];
  /** Adult minimum usable volume, litres */
  minVolumeL: number;
  /** Adult minimum floor footprint [width, depth] in cm */
  minFootprintCm: [number, number];
  floraSet: FloraSet;
};

// ---------------------------------------------------------------------------
// Curated planting lists
// ---------------------------------------------------------------------------

/**
 * Safe / toxic planting per biome. The toxic lists are the ones that matter:
 * every entry here is a plant commonly sold for vivariums that should NOT go
 * in with an animal that grazes or licks surfaces.
 */
export const FLORA: Record<
  Exclude<FloraSet, "none">,
  { safe: string[]; toxic: string[] }
> = {
  arid: {
    safe: [
      "Opuntia spp. (spineless)",
      "Haworthia spp.",
      "Sansevieria spp.",
      "Portulacaria afra",
      "Sedum spp.",
      "Echeveria spp.",
    ],
    toxic: [
      "Euphorbia spp. (caustic latex)",
      "Nerium oleander",
      "Cycas revoluta (sago palm)",
      "Kalanchoe spp.",
      "Aloe vera (purgative if grazed)",
      "Crassula ovata",
    ],
  },
  tropical: {
    safe: [
      "Ficus pumila",
      "Peperomia spp.",
      "Neoregelia spp. (bromeliad)",
      "Tillandsia spp.",
      "Fittonia albivenis",
      "Pilea spp.",
      "Chlorophytum comosum",
      "Hibiscus rosa-sinensis (edible)",
    ],
    toxic: [
      "Epipremnum aureum (pothos)",
      "Philodendron spp.",
      "Monstera deliciosa",
      "Dieffenbachia spp.",
      "Anthurium spp.",
      "Spathiphyllum spp.",
      "Zamioculcas zamiifolia",
      "Schefflera arboricola",
    ],
  },
  temperate: {
    safe: [
      "Carex spp.",
      "Festuca glauca",
      "Thymus serpyllum",
      "Sempervivum spp.",
      "Vaccinium spp.",
      "Hedera-free moss carpet",
    ],
    toxic: [
      "Hedera helix (ivy)",
      "Taxus baccata (yew)",
      "Digitalis purpurea",
      "Convallaria majalis",
      "Rhododendron spp.",
      "Prunus laurocerasus",
    ],
  },
  aquatic: {
    safe: [
      "Anubias barteri",
      "Microsorum pteropus (Java fern)",
      "Vesicularia dubyana (Java moss)",
      "Cryptocoryne spp.",
      "Pistia stratiotes",
      "Echinodorus spp.",
    ],
    toxic: [
      "Dieffenbachia spp.",
      "Caladium spp.",
      "Alocasia spp.",
      "Euphorbia spp.",
      "Nerium oleander",
      "Hedera helix",
    ],
  },
};

export function floraFor(set: FloraSet): { safe: string[]; toxic: string[] } {
  return set === "none" ? { safe: [], toxic: [] } : FLORA[set];
}

// ---------------------------------------------------------------------------
// Record builder — keeps ~170 records readable without losing type safety
// ---------------------------------------------------------------------------

function r(
  id: string,
  latinName: string,
  nameHu: string,
  nameEn: string,
  category: SpeciesCategory,
  fergusonZone: FergusonZone,
  uviRange: [number, number],
  baskingC: number,
  coolC: number,
  nightC: number,
  humidity: [number, number],
  diet: Diet,
  behaviours: Behaviour[],
  minVolumeL: number,
  minFootprintCm: [number, number],
  floraSet: FloraSet
): HusbandrySpecies {
  return {
    id,
    latinName,
    nameHu,
    nameEn,
    category,
    fergusonZone,
    uviRange,
    temps: { baskingC, coolC, nightC },
    humidity,
    diet,
    behaviours,
    minVolumeL,
    minFootprintCm,
    floraSet,
  };
}

/** Nominal UVI band per Ferguson zone, used for the Arcadia tube spec. */
export const ZONE_UVI: Record<FergusonZone, [number, number]> = {
  1: [0.0, 0.7],
  2: [0.7, 1.0],
  3: [1.0, 2.6],
  4: [2.6, 8.0],
};

export const SPECIES_DB: HusbandrySpecies[] = [
  // ------------------------------------------------------------------ AGAMIDS
  r("pogona-vitticeps", "Pogona vitticeps", "Szakállas agáma", "Central Bearded Dragon", "agamid", 4, [3.0, 4.5], 42, 26, 18, [30, 40], "omnivore", ["digging", "climbing"], 550, [120, 60], "arid"),
  r("pogona-henrylawsoni", "Pogona henrylawsoni", "Lawson-agáma", "Rankin's Dragon", "agamid", 4, [2.6, 4.0], 40, 25, 18, [30, 40], "omnivore", ["digging"], 340, [100, 50], "arid"),
  r("pogona-barbata", "Pogona barbata", "Keleti szakállas agáma", "Eastern Bearded Dragon", "agamid", 4, [3.0, 4.5], 42, 25, 17, [30, 45], "omnivore", ["digging", "climbing"], 600, [140, 60], "arid"),
  r("uromastyx-ornata", "Uromastyx ornata", "Díszes tüskésfarkú agáma", "Ornate Uromastyx", "agamid", 4, [4.0, 6.0], 50, 27, 20, [20, 30], "herbivore", ["digging"], 500, [120, 60], "arid"),
  r("uromastyx-geyri", "Uromastyx geyri", "Szahárai tüskésfarkú agáma", "Saharan Uromastyx", "agamid", 4, [4.0, 6.0], 50, 27, 20, [20, 30], "herbivore", ["digging"], 500, [120, 60], "arid"),
  r("uromastyx-aegyptia", "Uromastyx aegyptia", "Egyiptomi tüskésfarkú agáma", "Egyptian Uromastyx", "agamid", 4, [4.5, 7.0], 52, 28, 20, [20, 30], "herbivore", ["digging"], 900, [180, 80], "arid"),
  r("chlamydosaurus-kingii", "Chlamydosaurus kingii", "Galléros gyík", "Frilled Dragon", "agamid", 4, [3.0, 4.5], 40, 26, 21, [50, 70], "insectivore", ["climbing"], 900, [120, 60], "tropical"),
  r("intellagama-lesueurii", "Intellagama lesueurii", "Ausztrál vízi agáma", "Australian Water Dragon", "agamid", 3, [2.0, 3.0], 38, 25, 20, [60, 80], "omnivore", ["swimming", "climbing"], 1000, [150, 70], "tropical"),
  r("physignathus-cocincinus", "Physignathus cocincinus", "Zöld vízi agáma", "Chinese Water Dragon", "agamid", 3, [2.0, 3.0], 35, 26, 22, [70, 85], "omnivore", ["swimming", "climbing"], 900, [120, 60], "tropical"),
  r("agama-agama", "Agama agama", "Szivárványos agáma", "Red-headed Rock Agama", "agamid", 4, [3.0, 4.5], 45, 27, 20, [30, 45], "insectivore", ["climbing"], 400, [120, 50], "arid"),
  r("laudakia-stellio", "Laudakia stellio", "Csillagos agáma", "Roughtail Rock Agama", "agamid", 4, [3.0, 4.5], 45, 26, 18, [30, 45], "insectivore", ["climbing"], 400, [120, 50], "arid"),
  r("moloch-horridus", "Moloch horridus", "Tövises ördög", "Thorny Devil", "agamid", 4, [4.0, 6.0], 40, 25, 15, [20, 30], "insectivore", ["digging"], 400, [120, 60], "arid"),
  r("ctenophorus-nuchalis", "Ctenophorus nuchalis", "Központi katonaagáma", "Central Netted Dragon", "agamid", 4, [3.5, 5.0], 45, 26, 18, [20, 35], "insectivore", ["digging"], 340, [100, 50], "arid"),
  r("hydrosaurus-amboinensis", "Hydrosaurus amboinensis", "Vitorlásgyík", "Sailfin Dragon", "agamid", 3, [2.0, 3.0], 35, 26, 23, [70, 90], "omnivore", ["swimming", "climbing"], 2000, [200, 90], "tropical"),
  r("leiolepis-belliana", "Leiolepis belliana", "Pillangóagáma", "Butterfly Lizard", "agamid", 4, [3.0, 4.5], 45, 27, 20, [40, 60], "omnivore", ["digging"], 500, [120, 60], "arid"),
  r("acanthosaura-capra", "Acanthosaura capra", "Hegyi tövisagáma", "Mountain Horned Dragon", "agamid", 2, [1.0, 2.0], 28, 22, 18, [70, 90], "insectivore", ["climbing"], 400, [90, 50], "tropical"),
  r("calotes-versicolor", "Calotes versicolor", "Változó agáma", "Oriental Garden Lizard", "agamid", 3, [2.0, 3.0], 35, 25, 21, [60, 75], "insectivore", ["climbing"], 300, [90, 45], "tropical"),
  r("draco-volans", "Draco volans", "Repülő sárkány", "Flying Dragon", "agamid", 3, [2.0, 3.0], 33, 25, 22, [70, 85], "insectivore", ["climbing"], 400, [80, 50], "tropical"),
  r("japalura-splendida", "Diploderma splendidum", "Pompás hegyiagáma", "Banded Mountain Dragon", "agamid", 2, [1.0, 2.0], 30, 22, 17, [60, 80], "insectivore", ["climbing"], 250, [80, 45], "temperate"),
  r("trapelus-mutabilis", "Trapelus mutabilis", "Sivatagi agáma", "Desert Agama", "agamid", 4, [3.5, 5.0], 45, 27, 19, [20, 35], "insectivore", ["digging"], 340, [100, 50], "arid"),

  // ------------------------------------------------------------------- GECKOS
  r("correlophus-ciliatus", "Correlophus ciliatus", "Koronás gekkó", "Crested Gecko", "gecko", 1, [0.4, 0.7], 26, 21, 18, [60, 80], "omnivore", ["climbing"], 180, [45, 45], "tropical"),
  r("rhacodactylus-leachianus", "Rhacodactylus leachianus", "Új-kaledóniai óriásgekkó", "Leachianus Gecko", "gecko", 1, [0.5, 0.9], 28, 22, 19, [60, 80], "omnivore", ["climbing"], 400, [60, 60], "tropical"),
  r("rhacodactylus-auriculatus", "Rhacodactylus auriculatus", "Szemölcsös gekkó", "Gargoyle Gecko", "gecko", 1, [0.4, 0.7], 27, 21, 18, [55, 75], "omnivore", ["climbing"], 180, [45, 45], "tropical"),
  r("mniarogekko-chahoua", "Mniarogekko chahoua", "Mohagekkó", "Mossy Prehensile-tailed Gecko", "gecko", 1, [0.5, 0.9], 27, 22, 19, [60, 80], "omnivore", ["climbing"], 250, [50, 50], "tropical"),
  r("eublepharis-macularius", "Eublepharis macularius", "Leopárdgekkó", "Leopard Gecko", "gecko", 2, [0.8, 1.4], 34, 24, 20, [30, 45], "insectivore", ["digging"], 220, [90, 45], "arid"),
  r("hemitheconyx-caudicinctus", "Hemitheconyx caudicinctus", "Afrikai zsírfarkú gekkó", "African Fat-tailed Gecko", "gecko", 2, [0.7, 1.2], 33, 24, 21, [50, 70], "insectivore", ["digging"], 200, [90, 45], "arid"),
  r("phelsuma-grandis", "Phelsuma grandis", "Madagaszkári óriás nappaligekkó", "Giant Day Gecko", "gecko", 3, [2.0, 3.0], 30, 24, 21, [60, 80], "omnivore", ["climbing"], 250, [50, 50], "tropical"),
  r("phelsuma-laticauda", "Phelsuma laticauda", "Aranyporos nappaligekkó", "Gold Dust Day Gecko", "gecko", 3, [1.8, 2.6], 30, 24, 21, [60, 80], "omnivore", ["climbing"], 120, [45, 45], "tropical"),
  r("phelsuma-klemmeri", "Phelsuma klemmeri", "Sárganyakú nappaligekkó", "Neon Day Gecko", "gecko", 3, [1.8, 2.6], 29, 24, 21, [65, 85], "omnivore", ["climbing"], 90, [40, 40], "tropical"),
  r("lygodactylus-williamsi", "Lygodactylus williamsi", "Elektromosblue törpegekkó", "Electric Blue Gecko", "gecko", 3, [1.5, 2.4], 29, 24, 21, [60, 80], "insectivore", ["climbing"], 90, [40, 40], "tropical"),
  r("gekko-gecko", "Gekko gecko", "Tokegekkó", "Tokay Gecko", "gecko", 1, [0.6, 1.0], 30, 24, 22, [60, 80], "insectivore", ["climbing"], 250, [60, 45], "tropical"),
  r("gekko-vittatus", "Gekko vittatus", "Fehérvonalas gekkó", "White-lined Gecko", "gecko", 1, [0.6, 1.0], 30, 24, 22, [65, 85], "insectivore", ["climbing"], 200, [50, 45], "tropical"),
  r("nephrurus-levis", "Nephrurus levis", "Sima bütykösfarkú gekkó", "Smooth Knob-tailed Gecko", "gecko", 1, [0.5, 0.9], 32, 24, 19, [30, 50], "insectivore", ["digging"], 120, [60, 40], "arid"),
  r("underwoodisaurus-milii", "Underwoodisaurus milii", "Ausztrál sörtefarkú gekkó", "Thick-tailed Gecko", "gecko", 1, [0.5, 0.9], 32, 23, 18, [40, 60], "insectivore", ["digging"], 120, [60, 40], "arid"),
  r("coleonyx-variegatus", "Coleonyx variegatus", "Nyugati szalagos gekkó", "Western Banded Gecko", "gecko", 2, [0.7, 1.2], 32, 23, 19, [30, 50], "insectivore", ["digging"], 90, [60, 40], "arid"),
  r("paroedura-pictus", "Paroedura pictus", "Madagaszkári talajgekkó", "Panther Gecko", "gecko", 1, [0.5, 0.9], 30, 23, 20, [50, 70], "insectivore", ["digging"], 90, [60, 40], "tropical"),
  r("uroplatus-sikorae", "Uroplatus sikorae", "Mohaszerű levélfarkú gekkó", "Mossy Leaf-tailed Gecko", "gecko", 1, [0.4, 0.8], 26, 21, 18, [75, 95], "insectivore", ["climbing"], 250, [50, 50], "tropical"),
  r("uroplatus-fimbriatus", "Uroplatus fimbriatus", "Óriás levélfarkú gekkó", "Giant Leaf-tailed Gecko", "gecko", 1, [0.4, 0.8], 27, 22, 19, [75, 95], "insectivore", ["climbing"], 340, [60, 60], "tropical"),
  r("ptychozoon-kuhli", "Ptychozoon kuhli", "Repülő gekkó", "Kuhl's Flying Gecko", "gecko", 1, [0.5, 0.9], 29, 24, 22, [70, 90], "insectivore", ["climbing"], 180, [45, 45], "tropical"),
  r("hemidactylus-frenatus", "Hemidactylus frenatus", "Ázsiai házigekkó", "Common House Gecko", "gecko", 1, [0.5, 0.9], 30, 24, 21, [60, 80], "insectivore", ["climbing"], 90, [45, 40], "tropical"),
  r("teratoscincus-scincus", "Teratoscincus scincus", "Halpikkelyes gekkó", "Wonder Gecko", "gecko", 2, [0.7, 1.2], 34, 24, 19, [25, 40], "insectivore", ["digging"], 120, [60, 40], "arid"),
  r("chondrodactylus-turneri", "Chondrodactylus turneri", "Turner-gekkó", "Turner's Thick-toed Gecko", "gecko", 2, [0.7, 1.2], 33, 24, 20, [40, 60], "insectivore", ["climbing"], 120, [60, 40], "arid"),
  r("goniurosaurus-luii", "Goniurosaurus luii", "Kínai leopárdgekkó", "Chinese Cave Gecko", "gecko", 1, [0.4, 0.8], 26, 21, 18, [70, 90], "insectivore", ["climbing"], 120, [45, 45], "tropical"),
  r("tarentola-mauritanica", "Tarentola mauritanica", "Falikó gekkó", "Moorish Gecko", "gecko", 3, [1.5, 2.4], 35, 24, 18, [40, 60], "insectivore", ["climbing"], 120, [60, 45], "temperate"),
  r("pachydactylus-rangei", "Pachydactylus rangei", "Namíb hálóstalpú gekkó", "Web-footed Gecko", "gecko", 2, [0.7, 1.2], 32, 23, 17, [20, 40], "insectivore", ["digging"], 90, [60, 40], "arid"),
  r("eurydactylodes-agricolae", "Eurydactylodes agricolae", "Bambuszgekkó", "Bauer's Chameleon Gecko", "gecko", 1, [0.4, 0.8], 26, 21, 18, [60, 80], "omnivore", ["climbing"], 90, [40, 40], "tropical"),
  r("strophurus-ciliaris", "Strophurus ciliaris", "Tüskésfarkú gekkó", "Spiny-tailed Gecko", "gecko", 2, [0.8, 1.4], 34, 24, 19, [30, 50], "insectivore", ["climbing"], 120, [60, 45], "arid"),
  r("oedura-castelnaui", "Oedura castelnaui", "Északi bársonygekkó", "Northern Velvet Gecko", "gecko", 2, [0.7, 1.2], 32, 24, 20, [40, 60], "insectivore", ["climbing"], 120, [60, 45], "arid"),

  // ------------------------------------------------------ MONITORS & TEGUS
  r("salvator-merianae", "Salvator merianae", "Argentin tegu", "Argentine Black & White Tegu", "monitor_tegu", 4, [3.0, 5.0], 45, 26, 21, [60, 80], "omnivore", ["digging", "swimming"], 2400, [200, 90], "temperate"),
  r("salvator-rufescens", "Salvator rufescens", "Vörös tegu", "Red Tegu", "monitor_tegu", 4, [3.0, 5.0], 45, 26, 21, [60, 80], "omnivore", ["digging", "swimming"], 2400, [200, 90], "temperate"),
  r("tupinambis-teguixin", "Tupinambis teguixin", "Aranytegu", "Gold Tegu", "monitor_tegu", 4, [3.0, 5.0], 45, 27, 22, [70, 85], "omnivore", ["digging", "swimming"], 2000, [180, 80], "tropical"),
  r("varanus-exanthematicus", "Varanus exanthematicus", "Szavannavarán", "Savannah Monitor", "monitor_tegu", 4, [3.0, 5.0], 50, 27, 22, [60, 80], "carnivore", ["digging"], 2400, [200, 90], "arid"),
  r("varanus-niloticus", "Varanus niloticus", "Nílusi varánusz", "Nile Monitor", "monitor_tegu", 4, [3.0, 5.0], 48, 28, 23, [70, 90], "carnivore", ["swimming", "climbing"], 4000, [250, 100], "aquatic"),
  r("varanus-acanthurus", "Varanus acanthurus", "Tüskésfarkú varánusz", "Ackie Monitor", "monitor_tegu", 4, [3.5, 5.5], 50, 26, 21, [60, 80], "carnivore", ["digging", "climbing"], 1200, [150, 80], "arid"),
  r("varanus-storri", "Varanus storri", "Storr-varánusz", "Storr's Monitor", "monitor_tegu", 4, [3.5, 5.5], 48, 26, 21, [50, 70], "carnivore", ["digging"], 700, [120, 60], "arid"),
  r("varanus-tristis", "Varanus tristis", "Feketefejű varánusz", "Black-headed Monitor", "monitor_tegu", 4, [3.5, 5.5], 48, 27, 21, [50, 70], "carnivore", ["climbing", "digging"], 1200, [150, 80], "arid"),
  r("varanus-prasinus", "Varanus prasinus", "Zöld favarán", "Emerald Tree Monitor", "monitor_tegu", 3, [2.0, 3.5], 35, 26, 23, [70, 90], "carnivore", ["climbing"], 1000, [120, 70], "tropical"),
  r("varanus-macraei", "Varanus macraei", "Kékfarkú favarán", "Blue Tree Monitor", "monitor_tegu", 3, [2.0, 3.5], 35, 26, 23, [70, 90], "carnivore", ["climbing"], 1000, [120, 70], "tropical"),
  r("varanus-salvadorii", "Varanus salvadorii", "Krokodilvarán", "Crocodile Monitor", "monitor_tegu", 4, [3.0, 5.0], 42, 27, 23, [70, 90], "carnivore", ["climbing", "swimming"], 6000, [300, 120], "tropical"),
  r("varanus-salvator", "Varanus salvator", "Ázsiai vízivarán", "Asian Water Monitor", "monitor_tegu", 4, [3.0, 5.0], 45, 28, 23, [70, 90], "carnivore", ["swimming", "climbing"], 5000, [280, 110], "aquatic"),
  r("varanus-gilleni", "Varanus gilleni", "Pygmy mulga varánusz", "Pygmy Mulga Monitor", "monitor_tegu", 4, [3.5, 5.5], 48, 26, 21, [50, 70], "carnivore", ["climbing"], 600, [120, 60], "arid"),
  r("varanus-kingorum", "Varanus kingorum", "King törpevaránusz", "King's Dwarf Monitor", "monitor_tegu", 4, [3.5, 5.5], 48, 26, 21, [50, 70], "carnivore", ["digging", "climbing"], 500, [100, 50], "arid"),
  r("varanus-timorensis", "Varanus timorensis", "Timori favarán", "Timor Monitor", "monitor_tegu", 4, [3.0, 5.0], 45, 27, 22, [60, 80], "carnivore", ["climbing"], 800, [120, 60], "tropical"),
  r("varanus-albigularis", "Varanus albigularis", "Fehértorkú varánusz", "White-throated Monitor", "monitor_tegu", 4, [3.0, 5.0], 50, 27, 22, [50, 70], "carnivore", ["digging"], 3000, [220, 100], "arid"),

  // ------------------------------------------------------------------- SNAKES
  r("python-regius", "Python regius", "Királypiton", "Ball Python", "snake", 2, [0.7, 1.2], 32, 25, 22, [55, 75], "carnivore", ["digging"], 340, [120, 60], "none"),
  r("pantherophis-guttatus", "Pantherophis guttatus", "Kukoricasikló", "Corn Snake", "snake", 2, [0.8, 1.4], 32, 22, 19, [40, 60], "carnivore", ["climbing"], 250, [120, 45], "temperate"),
  r("lampropeltis-getula", "Lampropeltis getula", "Királysikló", "Common Kingsnake", "snake", 2, [0.8, 1.4], 32, 23, 20, [40, 60], "carnivore", ["climbing"], 250, [120, 45], "temperate"),
  r("lampropeltis-triangulum", "Lampropeltis triangulum", "Tejsikló", "Milk Snake", "snake", 2, [0.8, 1.4], 30, 22, 19, [50, 65], "carnivore", ["digging"], 220, [100, 45], "temperate"),
  r("boa-constrictor", "Boa constrictor", "Óriáskígyó", "Boa Constrictor", "snake", 2, [0.8, 1.4], 33, 26, 23, [60, 75], "carnivore", ["climbing"], 900, [180, 80], "tropical"),
  r("morelia-viridis", "Morelia viridis", "Zöld fapiton", "Green Tree Python", "snake", 2, [0.7, 1.2], 31, 25, 23, [70, 90], "carnivore", ["climbing"], 340, [90, 60], "tropical"),
  r("morelia-spilota", "Morelia spilota", "Szőnyegpiton", "Carpet Python", "snake", 2, [0.8, 1.4], 33, 25, 21, [50, 70], "carnivore", ["climbing"], 700, [150, 70], "tropical"),
  r("python-bivittatus", "Python bivittatus", "Burmai piton", "Burmese Python", "snake", 2, [0.8, 1.4], 33, 26, 23, [60, 80], "carnivore", ["swimming", "climbing"], 3000, [250, 100], "tropical"),
  r("python-brongersmai", "Python brongersmai", "Vérpiton", "Blood Python", "snake", 2, [0.7, 1.2], 31, 25, 23, [65, 80], "carnivore", ["digging"], 500, [150, 70], "tropical"),
  r("corallus-caninus", "Corallus caninus", "Smaragd fabóa", "Emerald Tree Boa", "snake", 2, [0.7, 1.2], 30, 24, 22, [70, 90], "carnivore", ["climbing"], 400, [90, 60], "tropical"),
  r("corallus-hortulanus", "Corallus hortulanus", "Amazóniai fabóa", "Amazon Tree Boa", "snake", 2, [0.7, 1.2], 31, 25, 23, [70, 85], "carnivore", ["climbing"], 340, [90, 60], "tropical"),
  r("epicrates-cenchria", "Epicrates cenchria", "Szivárványbóa", "Brazilian Rainbow Boa", "snake", 2, [0.7, 1.2], 30, 25, 22, [75, 90], "carnivore", ["climbing"], 400, [120, 60], "tropical"),
  r("heterodon-nasicus", "Heterodon nasicus", "Nyugati disznóorrú kígyó", "Western Hognose", "snake", 2, [0.8, 1.4], 33, 23, 20, [30, 50], "carnivore", ["digging"], 180, [90, 45], "arid"),
  r("thamnophis-sirtalis", "Thamnophis sirtalis", "Közönséges harisnyakígyó", "Common Garter Snake", "snake", 3, [1.2, 2.0], 30, 22, 18, [50, 70], "carnivore", ["swimming", "climbing"], 220, [100, 45], "temperate"),
  r("eryx-colubrinus", "Eryx colubrinus", "Kenyai homokbóa", "Kenyan Sand Boa", "snake", 2, [0.7, 1.2], 35, 25, 22, [30, 45], "carnivore", ["digging"], 150, [90, 45], "arid"),
  r("gonyosoma-oxycephalum", "Gonyosoma oxycephalum", "Vörösfarkú zöld sikló", "Red-tailed Green Ratsnake", "snake", 2, [0.8, 1.4], 30, 25, 22, [70, 85], "carnivore", ["climbing"], 500, [120, 60], "tropical"),
  r("orthriophis-taeniurus", "Orthriophis taeniurus", "Szépiasikló", "Beauty Rat Snake", "snake", 2, [0.8, 1.4], 30, 24, 20, [60, 75], "carnivore", ["climbing"], 500, [150, 60], "tropical"),
  r("elaphe-schrenckii", "Elaphe schrenckii", "Amuri sikló", "Russian Rat Snake", "snake", 2, [0.8, 1.4], 29, 22, 18, [50, 70], "carnivore", ["climbing"], 400, [120, 60], "temperate"),
  r("pantherophis-obsoletus", "Pantherophis obsoletus", "Fekete patkánysikló", "Black Rat Snake", "snake", 2, [0.8, 1.4], 31, 23, 19, [45, 65], "carnivore", ["climbing"], 400, [150, 60], "temperate"),
  r("boaedon-fuliginosus", "Boaedon fuliginosus", "Afrikai házisikló", "African House Snake", "snake", 2, [0.8, 1.4], 32, 24, 21, [45, 65], "carnivore", ["digging"], 220, [100, 45], "arid"),
  r("aspidites-melanocephalus", "Aspidites melanocephalus", "Feketefejű piton", "Black-headed Python", "snake", 2, [0.8, 1.4], 35, 26, 22, [40, 60], "carnivore", ["digging"], 900, [180, 80], "arid"),
  r("antaresia-childreni", "Antaresia childreni", "Children-piton", "Children's Python", "snake", 2, [0.7, 1.2], 32, 25, 22, [50, 70], "carnivore", ["climbing"], 220, [100, 45], "arid"),
  r("liasis-olivaceus", "Liasis olivaceus", "Olívpiton", "Olive Python", "snake", 2, [0.8, 1.4], 34, 26, 22, [50, 70], "carnivore", ["swimming"], 2000, [220, 90], "arid"),
  r("nerodia-sipedon", "Nerodia sipedon", "Északi vízisikló", "Northern Water Snake", "snake", 3, [1.2, 2.0], 30, 22, 19, [60, 80], "carnivore", ["swimming"], 250, [100, 50], "aquatic"),
  r("xenopeltis-unicolor", "Xenopeltis unicolor", "Napfénypiton", "Sunbeam Snake", "snake", 1, [0.4, 0.8], 29, 24, 22, [75, 90], "carnivore", ["digging"], 250, [100, 50], "tropical"),
  r("candoia-aspera", "Candoia aspera", "Új-guineai földibóa", "New Guinea Ground Boa", "snake", 1, [0.5, 0.9], 30, 25, 23, [70, 85], "carnivore", ["digging"], 220, [90, 45], "tropical"),
  r("acrantophis-dumerili", "Acrantophis dumerili", "Dumeril-bóa", "Dumeril's Boa", "snake", 2, [0.8, 1.4], 32, 25, 21, [50, 70], "carnivore", ["digging"], 900, [180, 80], "tropical"),
  r("sanzinia-madagascariensis", "Sanzinia madagascariensis", "Madagaszkári fabóa", "Madagascar Tree Boa", "snake", 2, [0.7, 1.2], 30, 24, 21, [65, 85], "carnivore", ["climbing"], 500, [120, 60], "tropical"),
  r("spilotes-pullatus", "Spilotes pullatus", "Tigrissikló", "Tiger Rat Snake", "snake", 2, [0.8, 1.4], 32, 25, 22, [65, 80], "carnivore", ["climbing"], 900, [180, 70], "tropical"),
  r("coluber-constrictor", "Coluber constrictor", "Keleti versenykígyó", "Eastern Racer", "snake", 3, [1.2, 2.0], 32, 23, 19, [45, 65], "carnivore", ["climbing"], 400, [150, 60], "temperate"),

  // ------------------------------------------------------------------- SKINKS
  r("tiliqua-scincoides", "Tiliqua scincoides", "Kéknyelvű szkink", "Blue-tongued Skink", "skink", 4, [3.0, 4.5], 40, 24, 19, [40, 60], "omnivore", ["digging"], 700, [150, 60], "temperate"),
  r("tiliqua-rugosa", "Tiliqua rugosa", "Tobozgyík", "Shingleback Skink", "skink", 4, [3.0, 4.5], 40, 24, 18, [30, 50], "omnivore", ["digging"], 600, [140, 60], "arid"),
  r("tiliqua-gigas", "Tiliqua gigas", "Indonéz kéknyelvű szkink", "Indonesian Blue-tongue", "skink", 4, [2.6, 4.0], 38, 26, 22, [60, 80], "omnivore", ["digging"], 700, [150, 60], "tropical"),
  r("corucia-zebrata", "Corucia zebrata", "Salamon-szigeteki óriásszkink", "Prehensile-tailed Skink", "skink", 2, [1.0, 1.8], 30, 25, 22, [70, 90], "herbivore", ["climbing"], 900, [120, 70], "tropical"),
  r("egernia-cunninghami", "Egernia cunninghami", "Cunningham-szkink", "Cunningham's Skink", "skink", 4, [3.0, 4.5], 40, 24, 18, [40, 60], "omnivore", ["climbing"], 600, [140, 60], "temperate"),
  r("egernia-stokesii", "Egernia stokesii", "Tüskésfarkú szkink", "Gidgee Skink", "skink", 4, [3.0, 4.5], 42, 25, 19, [30, 50], "omnivore", ["climbing"], 500, [120, 60], "arid"),
  r("eutropis-multifasciata", "Eutropis multifasciata", "Keleti napszkink", "East Indian Brown Skink", "skink", 3, [2.0, 3.0], 35, 25, 22, [60, 80], "insectivore", ["digging"], 250, [90, 45], "tropical"),
  r("trachylepis-quinquetaeniata", "Trachylepis quinquetaeniata", "Ötcsíkos mabuja", "Rainbow Mabuya", "skink", 4, [2.6, 4.0], 38, 26, 21, [50, 70], "insectivore", ["climbing"], 250, [90, 45], "arid"),
  r("chalcides-ocellatus", "Chalcides ocellatus", "Szemfoltos szkink", "Ocellated Skink", "skink", 3, [2.0, 3.0], 35, 24, 19, [40, 60], "insectivore", ["digging"], 150, [80, 40], "arid"),
  r("scincus-scincus", "Scincus scincus", "Homokhal szkink", "Sandfish Skink", "skink", 3, [2.0, 3.2], 38, 25, 20, [20, 35], "insectivore", ["digging"], 180, [90, 45], "arid"),
  r("plestiodon-fasciatus", "Plestiodon fasciatus", "Ötcsíkos szkink", "Five-lined Skink", "skink", 3, [1.5, 2.6], 33, 22, 18, [50, 70], "insectivore", ["climbing"], 150, [80, 40], "temperate"),
  r("lepidothyris-fernandi", "Lepidothyris fernandi", "Tűzhasú szkink", "Fire Skink", "skink", 2, [1.0, 1.8], 32, 24, 21, [65, 85], "insectivore", ["digging"], 250, [90, 45], "tropical"),

  // --------------------------------------------------------------- CHAMELEONS
  r("chamaeleo-calyptratus", "Chamaeleo calyptratus", "Jemeni kaméleon", "Veiled Chameleon", "chameleon", 3, [2.0, 3.0], 32, 24, 18, [40, 60], "insectivore", ["climbing"], 340, [60, 60], "tropical"),
  r("furcifer-pardalis", "Furcifer pardalis", "Párduckaméleon", "Panther Chameleon", "chameleon", 3, [2.0, 3.0], 31, 24, 19, [60, 80], "insectivore", ["climbing"], 340, [60, 60], "tropical"),
  r("trioceros-jacksonii", "Trioceros jacksonii", "Jackson-kaméleon", "Jackson's Chameleon", "chameleon", 2, [1.2, 2.0], 27, 21, 16, [60, 80], "insectivore", ["climbing"], 250, [60, 60], "tropical"),
  r("trioceros-quadricornis", "Trioceros quadricornis", "Négyszarvú kaméleon", "Four-horned Chameleon", "chameleon", 2, [1.2, 2.0], 26, 20, 15, [70, 90], "insectivore", ["climbing"], 250, [60, 60], "tropical"),
  r("trioceros-melleri", "Trioceros melleri", "Meller-kaméleon", "Meller's Chameleon", "chameleon", 3, [2.0, 3.0], 30, 23, 18, [60, 80], "insectivore", ["climbing"], 700, [90, 70], "tropical"),
  r("furcifer-lateralis", "Furcifer lateralis", "Karcsú kaméleon", "Carpet Chameleon", "chameleon", 3, [1.8, 2.8], 29, 22, 17, [60, 80], "insectivore", ["climbing"], 180, [50, 50], "tropical"),
  r("furcifer-verrucosus", "Furcifer verrucosus", "Bibircses kaméleon", "Warty Chameleon", "chameleon", 3, [2.0, 3.0], 32, 24, 18, [40, 60], "insectivore", ["climbing"], 340, [60, 60], "tropical"),
  r("rieppeleon-brevicaudatus", "Rieppeleon brevicaudatus", "Rövidfarkú törpekaméleon", "Pygmy Chameleon", "chameleon", 1, [0.5, 0.9], 25, 21, 18, [70, 90], "insectivore", ["climbing"], 60, [40, 40], "tropical"),
  r("brookesia-superciliaris", "Brookesia superciliaris", "Levélkaméleon", "Brown Leaf Chameleon", "chameleon", 1, [0.4, 0.8], 24, 20, 17, [75, 95], "insectivore", ["climbing"], 45, [35, 35], "tropical"),
  r("chamaeleo-dilepis", "Chamaeleo dilepis", "Lapátorrú kaméleon", "Flap-necked Chameleon", "chameleon", 3, [2.0, 3.0], 31, 23, 18, [50, 70], "insectivore", ["climbing"], 340, [60, 60], "tropical"),
  r("kinyongia-multituberculata", "Kinyongia multituberculata", "Usambara szarvaskaméleon", "Usambara Two-horned Chameleon", "chameleon", 2, [1.2, 2.0], 26, 20, 16, [70, 90], "insectivore", ["climbing"], 250, [60, 60], "tropical"),
  r("trioceros-hoehnelii", "Trioceros hoehnelii", "Von Höhnel-kaméleon", "Helmeted Chameleon", "chameleon", 2, [1.2, 2.0], 26, 20, 15, [65, 85], "insectivore", ["climbing"], 180, [50, 50], "tropical"),

  // --------------------------------------------------------------- AMPHIBIANS
  r("dendrobates-tinctorius", "Dendrobates tinctorius", "Festőnyilasbéka", "Dyeing Poison Frog", "amphibian", 1, [0.4, 0.8], 25, 21, 19, [80, 100], "insectivore", ["climbing"], 90, [45, 45], "tropical"),
  r("dendrobates-leucomelas", "Dendrobates leucomelas", "Sárgaszalagos nyilasbéka", "Yellow-banded Poison Frog", "amphibian", 1, [0.4, 0.8], 25, 21, 19, [80, 100], "insectivore", ["climbing"], 90, [45, 45], "tropical"),
  r("dendrobates-auratus", "Dendrobates auratus", "Aranyos nyilasbéka", "Green & Black Poison Frog", "amphibian", 1, [0.4, 0.8], 25, 21, 19, [80, 100], "insectivore", ["climbing"], 90, [45, 45], "tropical"),
  r("phyllobates-terribilis", "Phyllobates terribilis", "Aranyos rettenetbéka", "Golden Poison Frog", "amphibian", 1, [0.4, 0.8], 26, 22, 20, [80, 100], "insectivore", ["climbing"], 90, [45, 45], "tropical"),
  r("ranitomeya-imitator", "Ranitomeya imitator", "Utánzó nyilasbéka", "Mimic Poison Frog", "amphibian", 1, [0.4, 0.8], 25, 21, 19, [85, 100], "insectivore", ["climbing"], 45, [30, 30], "tropical"),
  r("agalychnis-callidryas", "Agalychnis callidryas", "Vörösszemű levelibéka", "Red-eyed Tree Frog", "amphibian", 1, [0.5, 0.9], 27, 22, 20, [70, 95], "insectivore", ["climbing"], 120, [45, 45], "tropical"),
  r("litoria-caerulea", "Litoria caerulea", "Ausztrál kék levelibéka", "White's Tree Frog", "amphibian", 1, [0.5, 0.9], 28, 23, 21, [50, 70], "insectivore", ["climbing"], 180, [45, 45], "tropical"),
  r("hyla-cinerea", "Hyla cinerea", "Amerikai zöld levelibéka", "American Green Tree Frog", "amphibian", 1, [0.5, 0.9], 27, 22, 19, [60, 80], "insectivore", ["climbing"], 120, [45, 45], "temperate"),
  r("ceratophrys-cranwelli", "Ceratophrys cranwelli", "Cranwell-szarvasbéka", "Cranwell's Horned Frog", "amphibian", 1, [0.4, 0.8], 27, 23, 21, [60, 80], "carnivore", ["digging"], 60, [45, 45], "tropical"),
  r("theloderma-corticale", "Theloderma corticale", "Mohabéka", "Vietnamese Mossy Frog", "amphibian", 1, [0.4, 0.8], 23, 19, 17, [80, 100], "insectivore", ["climbing", "swimming"], 90, [45, 45], "aquatic"),
  r("phyllomedusa-sauvagii", "Phyllomedusa sauvagii", "Viaszos majombéka", "Waxy Monkey Frog", "amphibian", 2, [1.0, 1.8], 30, 24, 20, [50, 70], "insectivore", ["climbing"], 180, [45, 45], "tropical"),
  r("trachycephalus-resinifictrix", "Trachycephalus resinifictrix", "Amazóniai lombbéka", "Amazon Milk Frog", "amphibian", 1, [0.5, 0.9], 27, 23, 21, [70, 90], "insectivore", ["climbing"], 180, [45, 45], "tropical"),
  r("ambystoma-mexicanum", "Ambystoma mexicanum", "Axolotl", "Axolotl", "amphibian", 1, [0.0, 0.3], 18, 15, 14, [95, 100], "carnivore", ["swimming"], 150, [80, 40], "aquatic"),
  r("cynops-orientalis", "Cynops orientalis", "Kínai tűzhasú gőte", "Chinese Fire-bellied Newt", "amphibian", 1, [0.0, 0.3], 20, 16, 15, [90, 100], "carnivore", ["swimming"], 60, [60, 30], "aquatic"),
  r("triturus-carnifex", "Triturus carnifex", "Alpesi tarajosgőte", "Italian Crested Newt", "amphibian", 1, [0.0, 0.3], 19, 15, 13, [90, 100], "carnivore", ["swimming"], 80, [60, 35], "aquatic"),
  r("bombina-orientalis", "Bombina orientalis", "Keleti tűzhasú unka", "Oriental Fire-bellied Toad", "amphibian", 2, [0.7, 1.2], 24, 20, 18, [70, 90], "insectivore", ["swimming"], 80, [60, 35], "aquatic"),
  r("dyscophus-guineti", "Dyscophus guineti", "Hamis paradicsombéka", "False Tomato Frog", "amphibian", 1, [0.4, 0.8], 26, 22, 20, [70, 90], "insectivore", ["digging"], 90, [60, 40], "tropical"),
  r("kaloula-pulchra", "Kaloula pulchra", "Ázsiai sárgacsíkos béka", "Chubby Frog", "amphibian", 1, [0.4, 0.8], 27, 23, 21, [60, 80], "insectivore", ["digging"], 60, [45, 45], "tropical"),
  r("pyxicephalus-adspersus", "Pyxicephalus adspersus", "Afrikai bikabéka", "African Bullfrog", "amphibian", 2, [0.7, 1.2], 28, 24, 21, [60, 80], "carnivore", ["digging", "swimming"], 150, [80, 50], "tropical"),
  r("salamandra-salamandra", "Salamandra salamandra", "Foltos szalamandra", "Fire Salamander", "amphibian", 1, [0.0, 0.4], 18, 14, 12, [80, 95], "carnivore", ["digging"], 90, [60, 40], "temperate"),

  // ---------------------------------------------------------- TORTOISES/TURTLES
  r("testudo-hermanni", "Testudo hermanni", "Görög teknős", "Hermann's Tortoise", "tortoise_turtle", 4, [3.0, 5.0], 38, 22, 16, [40, 60], "herbivore", ["digging"], 900, [150, 80], "temperate"),
  r("testudo-graeca", "Testudo graeca", "Mór teknős", "Spur-thighed Tortoise", "tortoise_turtle", 4, [3.0, 5.0], 38, 23, 17, [40, 60], "herbivore", ["digging"], 900, [150, 80], "temperate"),
  r("testudo-horsfieldii", "Testudo horsfieldii", "Négyujjú teknős", "Russian Tortoise", "tortoise_turtle", 4, [3.5, 5.5], 38, 22, 15, [30, 50], "herbivore", ["digging"], 800, [150, 80], "arid"),
  r("centrochelys-sulcata", "Centrochelys sulcata", "Sarkantyús teknős", "African Spurred Tortoise", "tortoise_turtle", 4, [4.0, 6.0], 40, 26, 20, [40, 60], "herbivore", ["digging"], 6000, [300, 150], "arid"),
  r("stigmochelys-pardalis", "Stigmochelys pardalis", "Leopárdteknős", "Leopard Tortoise", "tortoise_turtle", 4, [4.0, 6.0], 38, 25, 20, [40, 60], "herbivore", ["digging"], 3000, [240, 120], "arid"),
  r("chelonoidis-carbonarius", "Chelonoidis carbonarius", "Vöröslábú teknős", "Red-footed Tortoise", "tortoise_turtle", 3, [2.0, 3.5], 33, 25, 22, [70, 85], "omnivore", ["digging"], 2000, [200, 100], "tropical"),
  r("kinixys-belliana", "Kinixys belliana", "Bell-csuklyásteknős", "Bell's Hinge-back Tortoise", "tortoise_turtle", 3, [2.0, 3.5], 32, 25, 21, [70, 90], "omnivore", ["digging"], 900, [150, 80], "tropical"),
  r("indotestudo-elongata", "Indotestudo elongata", "Elongata teknős", "Elongated Tortoise", "tortoise_turtle", 3, [2.0, 3.5], 33, 25, 21, [70, 85], "omnivore", ["digging"], 1500, [180, 90], "tropical"),
  r("trachemys-scripta-elegans", "Trachemys scripta elegans", "Ékszerteknős", "Red-eared Slider", "tortoise_turtle", 3, [2.0, 3.5], 32, 24, 20, [90, 100], "omnivore", ["swimming"], 400, [150, 60], "aquatic"),
  r("graptemys-pseudogeographica", "Graptemys pseudogeographica", "Hamis térképteknős", "False Map Turtle", "tortoise_turtle", 3, [2.0, 3.5], 32, 24, 20, [90, 100], "omnivore", ["swimming"], 400, [150, 60], "aquatic"),
  r("sternotherus-odoratus", "Sternotherus odoratus", "Pézsmateknős", "Common Musk Turtle", "tortoise_turtle", 2, [1.0, 1.8], 29, 23, 20, [90, 100], "carnivore", ["swimming"], 150, [90, 45], "aquatic"),
  r("pelomedusa-subrufa", "Pelomedusa subrufa", "Afrikai mocsáriteknős", "African Helmeted Turtle", "tortoise_turtle", 3, [2.0, 3.0], 30, 24, 21, [90, 100], "carnivore", ["swimming"], 250, [120, 50], "aquatic"),
  r("mauremys-sinensis", "Mauremys sinensis", "Kínai csíkosnyakú teknős", "Chinese Stripe-necked Turtle", "tortoise_turtle", 3, [2.0, 3.0], 31, 24, 20, [90, 100], "omnivore", ["swimming"], 300, [120, 50], "aquatic"),
  r("cuora-amboinensis", "Cuora amboinensis", "Maláj ládateknős", "Southeast Asian Box Turtle", "tortoise_turtle", 2, [1.2, 2.0], 30, 25, 22, [80, 95], "omnivore", ["swimming"], 250, [120, 60], "aquatic"),
  r("terrapene-carolina", "Terrapene carolina", "Karolinai ládateknős", "Eastern Box Turtle", "tortoise_turtle", 3, [2.0, 3.0], 30, 22, 18, [70, 90], "omnivore", ["digging"], 600, [150, 80], "temperate"),
  r("chelodina-longicollis", "Chelodina longicollis", "Kígyónyakú teknős", "Eastern Snake-necked Turtle", "tortoise_turtle", 2, [1.2, 2.0], 28, 23, 20, [90, 100], "carnivore", ["swimming"], 400, [150, 60], "aquatic"),

  // ------------------------------------------------------------ INVERTEBRATES
  r("brachypelma-hamorii", "Brachypelma hamorii", "Mexikói vörösbokájú tarantula", "Mexican Red-knee Tarantula", "invertebrate", 1, [0.0, 0.3], 26, 22, 20, [60, 70], "carnivore", ["digging"], 30, [30, 30], "arid"),
  r("grammostola-pulchra", "Grammostola pulchra", "Brazil fekete tarantula", "Brazilian Black Tarantula", "invertebrate", 1, [0.0, 0.3], 25, 22, 20, [60, 70], "carnivore", ["digging"], 30, [30, 30], "arid"),
  r("caribena-versicolor", "Caribena versicolor", "Antillai fadíszes tarantula", "Antilles Pinktoe Tarantula", "invertebrate", 1, [0.0, 0.3], 26, 23, 21, [70, 85], "carnivore", ["climbing"], 20, [20, 20], "tropical"),
  r("poecilotheria-metallica", "Poecilotheria metallica", "Gooty zafír tarantula", "Gooty Sapphire Ornamental", "invertebrate", 1, [0.0, 0.3], 27, 23, 21, [70, 80], "carnivore", ["climbing"], 30, [25, 25], "tropical"),
  r("tliltocatl-albopilosus", "Tliltocatl albopilosus", "Bozontos tarantula", "Curly Hair Tarantula", "invertebrate", 1, [0.0, 0.3], 26, 22, 20, [65, 75], "carnivore", ["digging"], 30, [30, 30], "tropical"),
  r("theraphosa-blondi", "Theraphosa blondi", "Goliát madárpók", "Goliath Birdeater", "invertebrate", 1, [0.0, 0.3], 27, 24, 22, [80, 90], "carnivore", ["digging"], 60, [45, 45], "tropical"),
  r("heterometrus-spinifer", "Heterometrus spinifer", "Ázsiai erdei skorpió", "Asian Forest Scorpion", "invertebrate", 1, [0.0, 0.3], 28, 24, 22, [70, 85], "carnivore", ["digging"], 30, [30, 30], "tropical"),
  r("pandinus-imperator", "Pandinus imperator", "Császárskorpió", "Emperor Scorpion", "invertebrate", 1, [0.0, 0.3], 28, 24, 22, [75, 85], "carnivore", ["digging"], 45, [40, 30], "tropical"),
  r("hadrurus-arizonensis", "Hadrurus arizonensis", "Arizonai óriásskorpió", "Desert Hairy Scorpion", "invertebrate", 1, [0.0, 0.4], 32, 25, 20, [20, 40], "carnivore", ["digging"], 30, [30, 30], "arid"),
  r("archispirostreptus-gigas", "Archispirostreptus gigas", "Afrikai óriás ezerlábú", "Giant African Millipede", "invertebrate", 1, [0.0, 0.3], 26, 23, 21, [75, 90], "herbivore", ["digging"], 45, [45, 30], "tropical"),
  r("gromphadorhina-portentosa", "Gromphadorhina portentosa", "Madagaszkári sziszegő csótány", "Madagascar Hissing Cockroach", "invertebrate", 1, [0.0, 0.3], 28, 24, 22, [60, 80], "omnivore", ["climbing"], 20, [30, 20], "tropical"),
  r("extatosoma-tiaratum", "Extatosoma tiaratum", "Ausztrál levéltoló botsáska", "Macleay's Spectre Stick Insect", "invertebrate", 1, [0.0, 0.4], 26, 22, 19, [60, 80], "herbivore", ["climbing"], 45, [30, 30], "tropical"),
  r("phyllium-philippinicum", "Phyllium philippinicum", "Fülöp-szigeteki levélsáska", "Philippine Leaf Insect", "invertebrate", 1, [0.0, 0.4], 26, 22, 20, [70, 85], "herbivore", ["climbing"], 30, [30, 30], "tropical"),
  r("hierodula-membranacea", "Hierodula membranacea", "Óriás ázsiai imádkozó sáska", "Giant Asian Mantis", "invertebrate", 1, [0.0, 0.4], 28, 24, 21, [60, 75], "carnivore", ["climbing"], 20, [20, 20], "tropical"),
  r("damon-diadema", "Damon diadema", "Tanzániai ostorpók", "Tanzanian Whip Spider", "invertebrate", 1, [0.0, 0.3], 26, 23, 21, [75, 90], "carnivore", ["climbing"], 30, [30, 30], "tropical"),
  r("coenobita-clypeatus", "Coenobita clypeatus", "Karib szárazföldi rák", "Caribbean Hermit Crab", "invertebrate", 2, [0.7, 1.2], 28, 24, 22, [75, 90], "omnivore", ["digging", "swimming"], 90, [60, 40], "tropical"),
];

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

export const SPECIES_BY_ID = new Map(SPECIES_DB.map((s) => [s.id, s]));

export function getSpecies(id: string | null | undefined) {
  return id ? SPECIES_BY_ID.get(id) ?? null : null;
}

export const CATEGORY_LABELS: Record<SpeciesCategory, { hu: string; en: string }> = {
  agamid: { hu: "Agámák", en: "Agamids" },
  gecko: { hu: "Gekkók", en: "Geckos" },
  monitor_tegu: { hu: "Varánuszok & teguk", en: "Monitors & Tegus" },
  snake: { hu: "Kígyók", en: "Snakes" },
  skink: { hu: "Szkinkek", en: "Skinks" },
  chameleon: { hu: "Kaméleonok", en: "Chameleons" },
  amphibian: { hu: "Kétéltűek", en: "Amphibians" },
  tortoise_turtle: { hu: "Teknősök", en: "Tortoises & Turtles" },
  invertebrate: { hu: "Gerinctelenek", en: "Invertebrates" },
};

export const DIET_LABELS: Record<Diet, { hu: string; en: string }> = {
  carnivore: { hu: "Ragadozó", en: "Carnivore" },
  omnivore: { hu: "Mindenevő", en: "Omnivore" },
  herbivore: { hu: "Növényevő", en: "Herbivore" },
  insectivore: { hu: "Rovarevő", en: "Insectivore" },
};

export const BEHAVIOUR_LABELS: Record<Behaviour, { hu: string; en: string }> = {
  digging: { hu: "Ásó", en: "Digging" },
  swimming: { hu: "Úszó", en: "Swimming" },
  climbing: { hu: "Mászó", en: "Climbing" },
};

/** Recommended Arcadia ProT5 tube for a Ferguson zone. */
export const ARCADIA_SPEC: Record<FergusonZone, { tube: string; note: { hu: string; en: string } }> = {
  1: {
    tube: "Arcadia ShadeDweller ProT5 2.4%",
    note: {
      hu: "Árnyékkedvelő — alacsony UVI, sűrű beültetéssel árnyékos zónákkal.",
      en: "Shade dweller — low UVI with dense planting for shaded retreats.",
    },
  },
  2: {
    tube: "Arcadia ShadeDweller ProT5 2.4% / ProT5 6%",
    note: {
      hu: "Részleges napozó — gradiens szükséges, árnyékos visszavonulóval.",
      en: "Partial sun — needs a gradient with a shaded retreat.",
    },
  },
  3: {
    tube: "Arcadia ProT5 6% Forest",
    note: {
      hu: "Nyílt napozó — határozott UV-gradiens, napozó pont és árnyék.",
      en: "Open basker — a clear UV gradient with basking spot and shade.",
    },
  },
  4: {
    tube: "Arcadia ProT5 12% Desert / D3+ 14%",
    note: {
      hu: "Erős napozó — magas UVI a napozó ponton, mért Ferguson-zónával.",
      en: "Strong basker — high UVI over the basking spot, Ferguson-zone metered.",
    },
  },
};
