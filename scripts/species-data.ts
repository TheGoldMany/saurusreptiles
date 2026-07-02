// 450+ collectible reptile/amphibian/invertebrate species for the SaurusCoin
// pack (gacha) system. Each entry: latin name, English + Hungarian common name,
// category and rarity. Ratings are generated deterministically at seed time.

export type Rarity = "common" | "rare" | "epic" | "legendary";
export type SeedSpecies = {
  latinName: string;
  nameEn: string;
  nameHu: string;
  category: string;
  rarity: Rarity;
};

// Categories: snake, lizard, gecko, turtle, amphibian, invertebrate, crocodilian
export const SPECIES: SeedSpecies[] = [
  // ---------------- SNAKES ----------------
  { latinName: "Pantherophis guttatus", nameEn: "Corn Snake", nameHu: "Kukoricasikló", category: "snake", rarity: "common" },
  { latinName: "Lampropeltis triangulum", nameEn: "Milk Snake", nameHu: "Tejsikló", category: "snake", rarity: "common" },
  { latinName: "Lampropeltis getula", nameEn: "Common Kingsnake", nameHu: "Királysikló", category: "snake", rarity: "common" },
  { latinName: "Python regius", nameEn: "Ball Python", nameHu: "Királypiton", category: "snake", rarity: "common" },
  { latinName: "Thamnophis sirtalis", nameEn: "Common Garter Snake", nameHu: "Közönséges harisnyakígyó", category: "snake", rarity: "common" },
  { latinName: "Pantherophis obsoletus", nameEn: "Black Rat Snake", nameHu: "Fekete patkánysikló", category: "snake", rarity: "common" },
  { latinName: "Elaphe schrenckii", nameEn: "Russian Rat Snake", nameHu: "Amuri sikló", category: "snake", rarity: "common" },
  { latinName: "Boaedon fuliginosus", nameEn: "African House Snake", nameHu: "Afrikai házisikló", category: "snake", rarity: "common" },
  { latinName: "Nerodia sipedon", nameEn: "Northern Water Snake", nameHu: "Északi vízisikló", category: "snake", rarity: "common" },
  { latinName: "Storeria dekayi", nameEn: "Dekay's Brown Snake", nameHu: "Dekay barna kígyó", category: "snake", rarity: "common" },
  { latinName: "Coluber constrictor", nameEn: "Eastern Racer", nameHu: "Keleti versenykígyó", category: "snake", rarity: "common" },
  { latinName: "Heterodon nasicus", nameEn: "Western Hognose Snake", nameHu: "Nyugati disznóorrú kígyó", category: "snake", rarity: "rare" },
  { latinName: "Morelia spilota", nameEn: "Carpet Python", nameHu: "Szőnyegpiton", category: "snake", rarity: "rare" },
  { latinName: "Python bivittatus", nameEn: "Burmese Python", nameHu: "Burmai piton", category: "snake", rarity: "rare" },
  { latinName: "Boa constrictor", nameEn: "Boa Constrictor", nameHu: "Óriáskígyó", category: "snake", rarity: "rare" },
  { latinName: "Corallus hortulanus", nameEn: "Amazon Tree Boa", nameHu: "Amazóniai fabóa", category: "snake", rarity: "rare" },
  { latinName: "Epicrates cenchria", nameEn: "Rainbow Boa", nameHu: "Szivárványbóa", category: "snake", rarity: "rare" },
  { latinName: "Gonyosoma oxycephalum", nameEn: "Red-tailed Green Ratsnake", nameHu: "Vörösfarkú zöld sikló", category: "snake", rarity: "rare" },
  { latinName: "Orthriophis taeniurus", nameEn: "Beauty Rat Snake", nameHu: "Szépiasikló", category: "snake", rarity: "rare" },
  { latinName: "Spilotes pullatus", nameEn: "Tiger Rat Snake", nameHu: "Tigrissikló", category: "snake", rarity: "rare" },
  { latinName: "Bothriechis schlegelii", nameEn: "Eyelash Viper", nameHu: "Szempillás lándzsakígyó", category: "snake", rarity: "epic" },
  { latinName: "Morelia viridis", nameEn: "Green Tree Python", nameHu: "Zöld fapiton", category: "snake", rarity: "epic" },
  { latinName: "Corallus caninus", nameEn: "Emerald Tree Boa", nameHu: "Smaragd fabóa", category: "snake", rarity: "epic" },
  { latinName: "Crotalus atrox", nameEn: "Western Diamondback", nameHu: "Nyugati csörgőkígyó", category: "snake", rarity: "epic" },
  { latinName: "Naja naja", nameEn: "Indian Cobra", nameHu: "Indiai kobra", category: "snake", rarity: "epic" },
  { latinName: "Atheris squamigera", nameEn: "Green Bush Viper", nameHu: "Zöld bozótvipera", category: "snake", rarity: "epic" },
  { latinName: "Ahaetulla nasuta", nameEn: "Green Vine Snake", nameHu: "Zöld indakígyó", category: "snake", rarity: "epic" },
  { latinName: "Ophiophagus hannah", nameEn: "King Cobra", nameHu: "Királykobra", category: "snake", rarity: "legendary" },
  { latinName: "Python reticulatus", nameEn: "Reticulated Python", nameHu: "Hálós piton", category: "snake", rarity: "legendary" },
  { latinName: "Eunectes murinus", nameEn: "Green Anaconda", nameHu: "Zöld anakonda", category: "snake", rarity: "legendary" },
  { latinName: "Dendroaspis polylepis", nameEn: "Black Mamba", nameHu: "Fekete mamba", category: "snake", rarity: "legendary" },

  // ---------------- LIZARDS ----------------
  { latinName: "Pogona vitticeps", nameEn: "Bearded Dragon", nameHu: "Szakállas agáma", category: "lizard", rarity: "common" },
  { latinName: "Tiliqua scincoides", nameEn: "Blue-tongued Skink", nameHu: "Kéknyelvű szkink", category: "lizard", rarity: "common" },
  { latinName: "Anolis carolinensis", nameEn: "Green Anole", nameHu: "Zöld anolisz", category: "lizard", rarity: "common" },
  { latinName: "Sceloporus occidentalis", nameEn: "Western Fence Lizard", nameHu: "Nyugati kerítésgyík", category: "lizard", rarity: "common" },
  { latinName: "Zootoca vivipara", nameEn: "Viviparous Lizard", nameHu: "Elevenszülő gyík", category: "lizard", rarity: "common" },
  { latinName: "Lacerta agilis", nameEn: "Sand Lizard", nameHu: "Fürge gyík", category: "lizard", rarity: "common" },
  { latinName: "Podarcis muralis", nameEn: "Common Wall Lizard", nameHu: "Fali gyík", category: "lizard", rarity: "common" },
  { latinName: "Tarentola mauritanica", nameEn: "Moorish Gecko", nameHu: "Mór faligekkó", category: "lizard", rarity: "common" },
  { latinName: "Uromastyx aegyptia", nameEn: "Egyptian Uromastyx", nameHu: "Egyiptomi tüskésfarkú agáma", category: "lizard", rarity: "rare" },
  { latinName: "Chlamydosaurus kingii", nameEn: "Frilled Lizard", nameHu: "Galléros gyík", category: "lizard", rarity: "rare" },
  { latinName: "Physignathus cocincinus", nameEn: "Chinese Water Dragon", nameHu: "Kínai vízi agáma", category: "lizard", rarity: "rare" },
  { latinName: "Iguana iguana", nameEn: "Green Iguana", nameHu: "Zöld leguán", category: "lizard", rarity: "rare" },
  { latinName: "Tribolonotus gracilis", nameEn: "Red-eyed Crocodile Skink", nameHu: "Vörösszemű krokodilszkink", category: "lizard", rarity: "rare" },
  { latinName: "Corucia zebrata", nameEn: "Prehensile-tailed Skink", nameHu: "Fogófarkú szkink", category: "lizard", rarity: "rare" },
  { latinName: "Chamaeleo calyptratus", nameEn: "Veiled Chameleon", nameHu: "Jemeni kaméleon", category: "lizard", rarity: "rare" },
  { latinName: "Furcifer pardalis", nameEn: "Panther Chameleon", nameHu: "Párduc kaméleon", category: "lizard", rarity: "epic" },
  { latinName: "Varanus acanthurus", nameEn: "Ackie Monitor", nameHu: "Tüskésfarkú varánusz", category: "lizard", rarity: "epic" },
  { latinName: "Varanus prasinus", nameEn: "Green Tree Monitor", nameHu: "Zöld favaránusz", category: "lizard", rarity: "epic" },
  { latinName: "Heloderma suspectum", nameEn: "Gila Monster", nameHu: "Gila-szörny", category: "lizard", rarity: "epic" },
  { latinName: "Moloch horridus", nameEn: "Thorny Devil", nameHu: "Tüskés ördög", category: "lizard", rarity: "epic" },
  { latinName: "Brookesia micra", nameEn: "Leaf Chameleon", nameHu: "Levélkaméleon", category: "lizard", rarity: "epic" },
  { latinName: "Varanus komodoensis", nameEn: "Komodo Dragon", nameHu: "Komodói varánusz", category: "lizard", rarity: "legendary" },
  { latinName: "Varanus salvadorii", nameEn: "Crocodile Monitor", nameHu: "Krokodilvaránusz", category: "lizard", rarity: "legendary" },
  { latinName: "Shinisaurus crocodilurus", nameEn: "Chinese Crocodile Lizard", nameHu: "Kínai krokodilgyík", category: "lizard", rarity: "legendary" },

  // ---------------- GECKOS ----------------
  { latinName: "Eublepharis macularius", nameEn: "Leopard Gecko", nameHu: "Leopárdgekkó", category: "gecko", rarity: "common" },
  { latinName: "Correlophus ciliatus", nameEn: "Crested Gecko", nameHu: "Bóbitás gekkó", category: "gecko", rarity: "common" },
  { latinName: "Hemidactylus frenatus", nameEn: "Common House Gecko", nameHu: "Közönséges házigekkó", category: "gecko", rarity: "common" },
  { latinName: "Gekko gecko", nameEn: "Tokay Gecko", nameHu: "Tokéj gekkó", category: "gecko", rarity: "common" },
  { latinName: "Paroedura picta", nameEn: "Madagascar Ground Gecko", nameHu: "Madagaszkári talajgekkó", category: "gecko", rarity: "common" },
  { latinName: "Coleonyx variegatus", nameEn: "Western Banded Gecko", nameHu: "Nyugati sávos gekkó", category: "gecko", rarity: "common" },
  { latinName: "Rhacodactylus auriculatus", nameEn: "Gargoyle Gecko", nameHu: "Vízköpő gekkó", category: "gecko", rarity: "rare" },
  { latinName: "Phelsuma grandis", nameEn: "Giant Day Gecko", nameHu: "Óriás nappaligekkó", category: "gecko", rarity: "rare" },
  { latinName: "Nephrurus levis", nameEn: "Smooth Knob-tailed Gecko", nameHu: "Sima gombfarkú gekkó", category: "gecko", rarity: "rare" },
  { latinName: "Underwoodisaurus milii", nameEn: "Thick-tailed Gecko", nameHu: "Vastagfarkú gekkó", category: "gecko", rarity: "rare" },
  { latinName: "Uroplatus sikorae", nameEn: "Mossy Leaf-tailed Gecko", nameHu: "Mohás levélfarkú gekkó", category: "gecko", rarity: "epic" },
  { latinName: "Uroplatus phantasticus", nameEn: "Satanic Leaf-tailed Gecko", nameHu: "Sátáni levélfarkú gekkó", category: "gecko", rarity: "epic" },
  { latinName: "Rhacodactylus leachianus", nameEn: "Leachianus Gecko", nameHu: "Új-kaledóniai óriásgekkó", category: "gecko", rarity: "epic" },
  { latinName: "Correlophus sarasinorum", nameEn: "Sarasin's Giant Gecko", nameHu: "Sarasin óriásgekkó", category: "gecko", rarity: "epic" },
  { latinName: "Uroplatus giganteus", nameEn: "Giant Leaf-tailed Gecko", nameHu: "Óriás levélfarkú gekkó", category: "gecko", rarity: "legendary" },

  // ---------------- TURTLES ----------------
  { latinName: "Trachemys scripta elegans", nameEn: "Red-eared Slider", nameHu: "Ékszerteknős", category: "turtle", rarity: "common" },
  { latinName: "Testudo hermanni", nameEn: "Hermann's Tortoise", nameHu: "Görög teknős", category: "turtle", rarity: "common" },
  { latinName: "Testudo graeca", nameEn: "Greek Tortoise", nameHu: "Mór teknős", category: "turtle", rarity: "common" },
  { latinName: "Pelodiscus sinensis", nameEn: "Chinese Softshell Turtle", nameHu: "Kínai lágyhéjú teknős", category: "turtle", rarity: "common" },
  { latinName: "Chrysemys picta", nameEn: "Painted Turtle", nameHu: "Díszteknős", category: "turtle", rarity: "common" },
  { latinName: "Sternotherus odoratus", nameEn: "Common Musk Turtle", nameHu: "Pézsmateknős", category: "turtle", rarity: "rare" },
  { latinName: "Geochelone elegans", nameEn: "Indian Star Tortoise", nameHu: "Indiai csillagteknős", category: "turtle", rarity: "rare" },
  { latinName: "Chelydra serpentina", nameEn: "Snapping Turtle", nameHu: "Csattogóteknős", category: "turtle", rarity: "rare" },
  { latinName: "Centrochelys sulcata", nameEn: "African Spurred Tortoise", nameHu: "Sarkantyús teknős", category: "turtle", rarity: "rare" },
  { latinName: "Chelus fimbriata", nameEn: "Mata Mata Turtle", nameHu: "Bojtos teknős", category: "turtle", rarity: "epic" },
  { latinName: "Macrochelys temminckii", nameEn: "Alligator Snapping Turtle", nameHu: "Aligátorteknős", category: "turtle", rarity: "epic" },
  { latinName: "Astrochelys radiata", nameEn: "Radiated Tortoise", nameHu: "Sugaras teknős", category: "turtle", rarity: "epic" },
  { latinName: "Astrochelys yniphora", nameEn: "Ploughshare Tortoise", nameHu: "Angonoka teknős", category: "turtle", rarity: "legendary" },
  { latinName: "Chelonoidis niger", nameEn: "Galápagos Tortoise", nameHu: "Galápagosi óriásteknős", category: "turtle", rarity: "legendary" },

  // ---------------- AMPHIBIANS ----------------
  { latinName: "Ambystoma mexicanum", nameEn: "Axolotl", nameHu: "Axolotl", category: "amphibian", rarity: "common" },
  { latinName: "Dendrobates auratus", nameEn: "Green and Black Poison Frog", nameHu: "Zöld-fekete nyílméregbéka", category: "amphibian", rarity: "common" },
  { latinName: "Xenopus laevis", nameEn: "African Clawed Frog", nameHu: "Karmos béka", category: "amphibian", rarity: "common" },
  { latinName: "Ceratophrys ornata", nameEn: "Pacman Frog", nameHu: "Díszes szarvasbéka", category: "amphibian", rarity: "common" },
  { latinName: "Bombina orientalis", nameEn: "Oriental Fire-bellied Toad", nameHu: "Keleti tűzhasú béka", category: "amphibian", rarity: "common" },
  { latinName: "Litoria caerulea", nameEn: "White's Tree Frog", nameHu: "Korallujjú levelibéka", category: "amphibian", rarity: "common" },
  { latinName: "Cynops orientalis", nameEn: "Chinese Fire-belly Newt", nameHu: "Kínai tűzhasú gőte", category: "amphibian", rarity: "common" },
  { latinName: "Dendrobates tinctorius", nameEn: "Dyeing Poison Frog", nameHu: "Festő nyílméregbéka", category: "amphibian", rarity: "rare" },
  { latinName: "Agalychnis callidryas", nameEn: "Red-eyed Tree Frog", nameHu: "Vörösszemű levelibéka", category: "amphibian", rarity: "rare" },
  { latinName: "Salamandra salamandra", nameEn: "Fire Salamander", nameHu: "Foltos szalamandra", category: "amphibian", rarity: "rare" },
  { latinName: "Phyllobates terribilis", nameEn: "Golden Poison Frog", nameHu: "Rettenetes nyílméregbéka", category: "amphibian", rarity: "epic" },
  { latinName: "Andrias japonicus", nameEn: "Japanese Giant Salamander", nameHu: "Japán óriásszalamandra", category: "amphibian", rarity: "epic" },
  { latinName: "Ceratophrys cornuta", nameEn: "Amazon Horned Frog", nameHu: "Amazóniai szarvasbéka", category: "amphibian", rarity: "epic" },
  { latinName: "Andrias davidianus", nameEn: "Chinese Giant Salamander", nameHu: "Kínai óriásszalamandra", category: "amphibian", rarity: "legendary" },

  // ---------------- INVERTEBRATES ----------------
  { latinName: "Grammostola pulchra", nameEn: "Brazilian Black Tarantula", nameHu: "Brazil fekete madárpók", category: "invertebrate", rarity: "common" },
  { latinName: "Brachypelma hamorii", nameEn: "Mexican Red Knee Tarantula", nameHu: "Mexikói vöröstérdű madárpók", category: "invertebrate", rarity: "common" },
  { latinName: "Grammostola rosea", nameEn: "Chilean Rose Tarantula", nameHu: "Chilei rózsás madárpók", category: "invertebrate", rarity: "common" },
  { latinName: "Tliltocatl albopilosus", nameEn: "Curly Hair Tarantula", nameHu: "Göndörszőrű madárpók", category: "invertebrate", rarity: "common" },
  { latinName: "Pandinus imperator", nameEn: "Emperor Scorpion", nameHu: "Császárskorpió", category: "invertebrate", rarity: "common" },
  { latinName: "Gromphadorhina portentosa", nameEn: "Madagascar Hissing Cockroach", nameHu: "Madagaszkári sziszegő csótány", category: "invertebrate", rarity: "common" },
  { latinName: "Extatosoma tiaratum", nameEn: "Giant Prickly Stick Insect", nameHu: "Ausztrál tüskés botsáska", category: "invertebrate", rarity: "common" },
  { latinName: "Chromatopelma cyaneopubescens", nameEn: "Green Bottle Blue Tarantula", nameHu: "Zöldkékes madárpók", category: "invertebrate", rarity: "rare" },
  { latinName: "Caribena versicolor", nameEn: "Antilles Pinktoe Tarantula", nameHu: "Antillai rózsásujjú madárpók", category: "invertebrate", rarity: "rare" },
  { latinName: "Hierodula membranacea", nameEn: "Giant Asian Mantis", nameHu: "Óriás ázsiai imádkozó sáska", category: "invertebrate", rarity: "rare" },
  { latinName: "Poecilotheria regalis", nameEn: "Indian Ornamental Tarantula", nameHu: "Indiai díszes madárpók", category: "invertebrate", rarity: "epic" },
  { latinName: "Hymenopus coronatus", nameEn: "Orchid Mantis", nameHu: "Orchidea sáska", category: "invertebrate", rarity: "epic" },
  { latinName: "Theraphosa blondi", nameEn: "Goliath Birdeater", nameHu: "Góliát madárpók", category: "invertebrate", rarity: "legendary" },
];

// Additional procedurally-named variants (locale/morph variants of well-known
// species) to push the collectible count well over 400. These keep the same
// biology but represent regional locales/morphs collectors chase.
const LOCALE_BASES: {
  latinBase: string;
  enBase: string;
  huBase: string;
  category: string;
}[] = [
  { latinBase: "Python regius", enBase: "Ball Python", huBase: "Királypiton", category: "snake" },
  { latinBase: "Pantherophis guttatus", enBase: "Corn Snake", huBase: "Kukoricasikló", category: "snake" },
  { latinBase: "Eublepharis macularius", enBase: "Leopard Gecko", huBase: "Leopárdgekkó", category: "gecko" },
  { latinBase: "Correlophus ciliatus", enBase: "Crested Gecko", huBase: "Bóbitás gekkó", category: "gecko" },
  { latinBase: "Pogona vitticeps", enBase: "Bearded Dragon", huBase: "Szakállas agáma", category: "lizard" },
  { latinBase: "Boa constrictor", enBase: "Boa", huBase: "Óriáskígyó", category: "snake" },
  { latinBase: "Morelia viridis", enBase: "Green Tree Python", huBase: "Zöld fapiton", category: "snake" },
  { latinBase: "Furcifer pardalis", enBase: "Panther Chameleon", huBase: "Párduc kaméleon", category: "lizard" },
];

const MORPHS: { en: string; hu: string; rarity: Rarity }[] = [
  { en: "Albino", hu: "Albínó", rarity: "rare" },
  { en: "Piebald", hu: "Tarka", rarity: "epic" },
  { en: "Axanthic", hu: "Axantikus", rarity: "rare" },
  { en: "Hypo", hu: "Hipomelanisztikus", rarity: "common" },
  { en: "Pastel", hu: "Pasztell", rarity: "common" },
  { en: "Clown", hu: "Bohóc", rarity: "rare" },
  { en: "Ghost", hu: "Szellem", rarity: "rare" },
  { en: "Lavender Albino", hu: "Levendula albínó", rarity: "epic" },
  { en: "Banana", hu: "Banán", rarity: "rare" },
  { en: "Spider", hu: "Pók", rarity: "common" },
  { en: "Mojave", hu: "Mojave", rarity: "common" },
  { en: "Blue Eyed Leucistic", hu: "Kékszemű leucisztikus", rarity: "legendary" },
  { en: "Enchi", hu: "Enchi", rarity: "common" },
  { en: "Cinnamon", hu: "Fahéj", rarity: "common" },
  { en: "Fire", hu: "Tűz", rarity: "common" },
  { en: "Pinstripe", hu: "Csíkos", rarity: "common" },
  { en: "Champagne", hu: "Pezsgő", rarity: "rare" },
  { en: "Coral Glow", hu: "Korallizzás", rarity: "epic" },
  { en: "Sunset", hu: "Naplemente", rarity: "epic" },
  { en: "Desert Ghost", hu: "Sivatagi szellem", rarity: "rare" },
  { en: "Leopard", hu: "Leopárd", rarity: "common" },
  { en: "Yellow Belly", hu: "Sárgahasú", rarity: "common" },
  { en: "Black Pastel", hu: "Fekete pasztell", rarity: "common" },
  { en: "Mystic", hu: "Misztikus", rarity: "common" },
  { en: "Butter", hu: "Vajszínű", rarity: "common" },
  { en: "Lesser", hu: "Lesser", rarity: "common" },
  { en: "Vanilla", hu: "Vanília", rarity: "common" },
  { en: "Chocolate", hu: "Csokoládé", rarity: "common" },
  { en: "GHI", hu: "GHI", rarity: "rare" },
  { en: "Orange Dream", hu: "Narancsálom", rarity: "common" },
  { en: "Calico", hu: "Kalikó", rarity: "rare" },
  { en: "Gravel", hu: "Kavics", rarity: "common" },
  { en: "Special", hu: "Special", rarity: "rare" },
  { en: "Asphalt", hu: "Aszfalt", rarity: "common" },
  { en: "Red Stripe", hu: "Vöröscsíkos", rarity: "common" },
  { en: "Ivory", hu: "Elefántcsont", rarity: "epic" },
  { en: "Highway", hu: "Highway", rarity: "rare" },
  { en: "Monsoon", hu: "Monszun", rarity: "epic" },
  { en: "Puzzle", hu: "Puzzle", rarity: "epic" },
  { en: "Toffee", hu: "Toffee", rarity: "rare" },
  { en: "Confusion", hu: "Konfúzió", rarity: "rare" },
  { en: "Sunset Ivory", hu: "Naplemente elefántcsont", rarity: "legendary" },
  { en: "Pied Pastel", hu: "Tarka pasztell", rarity: "epic" },
  { en: "Firefly", hu: "Szentjánosbogár", rarity: "common" },
  { en: "Bumblebee", hu: "Poszméh", rarity: "common" },
  { en: "Killer Bee", hu: "Gyilkos méh", rarity: "rare" },
  { en: "Spotnose", hu: "Foltosorrú", rarity: "common" },
  { en: "Blade", hu: "Penge", rarity: "rare" },
  { en: "Acid", hu: "Sav", rarity: "rare" },
  { en: "Leopard Clown", hu: "Leopárd bohóc", rarity: "epic" },
  { en: "Super Pastel", hu: "Szuper pasztell", rarity: "common" },
  { en: "Pewter", hu: "Ónszürke", rarity: "common" },
  { en: "Cypress", hu: "Ciprus", rarity: "epic" },
  { en: "Granite", hu: "Gránit", rarity: "rare" },
];

export function buildFullSpeciesList(): SeedSpecies[] {
  const list: SeedSpecies[] = [...SPECIES];
  const seen = new Set(list.map((s) => s.latinName));

  for (const base of LOCALE_BASES) {
    for (const morph of MORPHS) {
      const latinName = `${base.latinBase} '${morph.en}'`;
      if (seen.has(latinName)) continue;
      seen.add(latinName);
      list.push({
        latinName,
        nameEn: `${morph.en} ${base.enBase}`,
        nameHu: `${morph.hu} ${base.huBase}`,
        category: base.category,
        rarity: morph.rarity,
      });
    }
  }

  return list;
}

// Deterministic rating (1-100) derived from the latin name + rarity floor so
// each species has a stable "unique rating".
export function ratingFor(sp: SeedSpecies): number {
  let hash = 0;
  for (let i = 0; i < sp.latinName.length; i++) {
    hash = (hash * 31 + sp.latinName.charCodeAt(i)) >>> 0;
  }
  const floor: Record<Rarity, number> = {
    common: 20,
    rare: 45,
    epic: 68,
    legendary: 88,
  };
  const span: Record<Rarity, number> = {
    common: 40,
    rare: 30,
    epic: 22,
    legendary: 12,
  };
  return floor[sp.rarity] + (hash % span[sp.rarity]);
}
