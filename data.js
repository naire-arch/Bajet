const DEFAULT_MEALS = [
  {
    id: "ugali-sukuma",
    name: { en: "Ugali, Sukuma Wiki & Eggs", sw: "Ugali, Sukuma Wiki na Mayai" },
    region: "Kenya",
    tags: ["protein", "student"],
    fuelMins: 25,
    ingredients: [
      { id: "maize-flour", en: "Maize Flour (Unga 1kg)", sw: "Unga wa Mahindi (1kg)", cat: "staple", market: 130, supermarket: 165 },
      { id: "sukuma", en: "Sukuma Wiki (1 bunch)", sw: "Sukuma Wiki (Fungu 1)", cat: "produce", market: 30, supermarket: 55 },
      { id: "eggs", en: "Eggs (4 pcs)", sw: "Mayai (4)", cat: "protein", market: 65, supermarket: 80 },
      { id: "tomato-onion", en: "Tomatoes & Onions", sw: "Nyanya na Vitunguu", cat: "produce", market: 40, supermarket: 65 }
    ]
  },
  {
    id: "githeri",
    name: { en: "Githeri Special (Beans & Maize)", sw: "Githeri ya Maharagwe na Mahindi" },
    region: "Kenya",
    tags: ["veg", "protein", "student"],
    fuelMins: 55,
    ingredients: [
      { id: "githeri-mix", en: "Pre-boiled Maize & Beans (1kg)", sw: "Mahindi na Maharagwe (1kg)", cat: "protein", market: 140, supermarket: 190 },
      { id: "potatoes", en: "Irish Potatoes (1kg)", sw: "Viazi Mviringo (1kg)", cat: "produce", market: 60, supermarket: 95 },
      { id: "tomato-onion", en: "Tomatoes & Onions", sw: "Nyanya na Vitunguu", cat: "produce", market: 40, supermarket: 65 }
    ]
  },
  {
    id: "chapati-ndengu",
    name: { en: "Chapati & Ndengu (Green Grams)", sw: "Chapati na Ndengu" },
    region: "Kenya",
    tags: ["veg", "protein"],
    fuelMins: 45,
    ingredients: [
      { id: "wheat-flour", en: "Wheat Flour (1kg)", sw: "Unga wa Ngano (1kg)", cat: "staple", market: 145, supermarket: 175 },
      { id: "ndengu", en: "Green Grams / Ndengu (500g)", sw: "Ndengu (500g)", cat: "protein", market: 95, supermarket: 130 },
      { id: "cooking-oil", en: "Cooking Oil (250ml)", sw: "Mafuta ya Kupikia (250ml)", cat: "staple", market: 75, supermarket: 95 }
    ]
  },
  {
    id: "pilau-beef",
    name: { en: "Swahili Beef Pilau & Kachumbari", sw: "Pilau ya Nyama na Kachumbari" },
    region: "Tanzania",
    tags: ["protein"],
    fuelMins: 45,
    ingredients: [
      { id: "rice", en: "Pishori / Basmati Rice (1kg)", sw: "Mchele wa Pishori (1kg)", cat: "staple", market: 180, supermarket: 230 },
      { id: "beef", en: "Beef (500g)", sw: "Nyama ya Ng'ombe (500g)", cat: "protein", market: 320, supermarket: 390 },
      { id: "tomato-onion", en: "Tomatoes, Onions & Pilau Masala", sw: "Nyanya, Vitunguu na Viungo", cat: "produce", market: 60, supermarket: 90 }
    ]
  },
  {
    id: "chips-mayai",
    name: { en: "Chips Mayai (Zanzibar Omelette)", sw: "Chips Mayai" },
    region: "Tanzania",
    tags: ["student", "protein"],
    fuelMins: 25,
    ingredients: [
      { id: "potatoes", en: "Irish Potatoes (1kg)", sw: "Viazi Mviringo (1kg)", cat: "produce", market: 60, supermarket: 95 },
      { id: "eggs", en: "Eggs (4 pcs)", sw: "Mayai (4)", cat: "protein", market: 65, supermarket: 80 },
      { id: "cooking-oil", en: "Cooking Oil (250ml)", sw: "Mafuta ya Kupikia (250ml)", cat: "staple", market: 75, supermarket: 95 }
    ]
  },
  {
    id: "matoke-gnuts",
    name: { en: "Matoke in Groundnut Sauce", sw: "Matoke ya Karanga" },
    region: "Uganda",
    tags: ["veg"],
    fuelMins: 35,
    ingredients: [
      { id: "matoke", en: "Green Bananas / Matoke (1 bunch)", sw: "Ndizi Mbichi / Matoke", cat: "produce", market: 150, supermarket: 220 },
      { id: "gnut-paste", en: "Groundnut Paste / Binyebwa (250g)", sw: "Unga wa Karanga (250g)", cat: "protein", market: 110, supermarket: 150 },
      { id: "tomato-onion", en: "Tomatoes & Onions", sw: "Nyanya na Vitunguu", cat: "produce", market: 40, supermarket: 65 }
    ]
  },
  {
    id: "shiro-wat",
    name: { en: "Shiro Wat & Injera / Rice", sw: "Shiro Wat na Wali" },
    region: "Ethiopia",
    tags: ["veg", "protein", "student"],
    fuelMins: 30,
    ingredients: [
      { id: "shiro", en: "Spiced Chickpea Flour / Shiro (250g)", sw: "Unga wa Dengu / Shiro (250g)", cat: "protein", market: 120, supermarket: 160 },
      { id: "rice", en: "Rice or Injera Pack", sw: "Mchele au Injera", cat: "staple", market: 160, supermarket: 210 },
      { id: "tomato-onion", en: "Garlic, Ginger & Onions", sw: "Kitunguu Saumu na Tangawizi", cat: "produce", market: 45, supermarket: 70 }
    ]
  },
  {
    id: "mukimo-maharagwe",
    name: { en: "Mukimo & Maharagwe (Bean Stew)", sw: "Mukimo na Maharagwe" },
    region: "Kenya",
    tags: ["veg", "protein"],
    fuelMins: 40,
    ingredients: [
      { id: "potatoes", en: "Irish Potatoes (1kg)", sw: "Viazi Mviringo (1kg)", cat: "produce", market: 60, supermarket: 95 },
      { id: "githeri-mix", en: "Beans & Green Maize (500g)", sw: "Maharagwe na Mahindi Mabichi", cat: "protein", market: 90, supermarket: 130 },
      { id: "sukuma", en: "Pumpkin Leaves / Kahurura", sw: "Majani ya Malenge", cat: "produce", market: 30, supermarket: 55 }
    ]
  },
  {
    id: "mandazi-chai",
    name: { en: "Swahili Mandazi & Masala Chai", sw: "Mandazi na Chai ya Viungo" },
    region: "Kenya",
    tags: ["veg", "student"],
    fuelMins: 20,
    ingredients: [
      { id: "wheat-flour", en: "Wheat Flour (1kg)", sw: "Unga wa Ngano (1kg)", cat: "staple", market: 145, supermarket: 175 },
      { id: "milk-sugar", en: "Milk (500ml), Sugar & Tea Leaves", sw: "Maziwa (500ml), Sukari na Majani", cat: "staple", market: 95, supermarket: 120 }
    ]
  }
];

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
