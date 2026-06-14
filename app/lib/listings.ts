export type PickupKind = "porch" | "hub";

// Ripe shares more than the harvest: produce today, plus the land, tools,
// and hands to grow it. Same map, same pin, same verify — different type.
export type ListingType = "produce" | "land" | "tool" | "help";

export type Listing = {
  id: string;
  type: ListingType;
  grower: string;
  initial: string;
  title: string;
  distance: string; // fuzzed location shown while browsing
  pickupKind: PickupKind;
  pickupLabel: string; // browse-safe label
  exactPickup: string; // revealed only after claim + verify
  price: string; // display string (produce: "$3"; commons: "Free to borrow")
  suggestedAmount: number; // numeric default for pay / deep-link (0 = free)
  payNote: string;
  image: string; // produce only; commons render an icon block
  available: number; // availability count; a claim holds + decrements it
  weightLbs: number; // drives the impact receipt (produce)
  rating: number;
  handoffs: number;
  verified: boolean;
  memberSince: string;
  review: string;
  handles: { venmo?: string; cashapp?: string; paypal?: string };
};

// $ kept in the neighborhood this week — block-level stat for the receipt.
export const BLOCK_TOTAL = 127;

// Seeded for the demo — a neighborhood already alive with produce.
export const listings: Listing[] = [
  {
    id: "lemons",
    type: "produce",
    grower: "Maya",
    initial: "M",
    title: "A bag of Meyer lemons",
    distance: "0.2 mi",
    pickupKind: "porch",
    pickupLabel: "Porch pickup",
    exactPickup: "14 Elm St · basket on the porch, blue door",
    price: "$3",
    suggestedAmount: 3,
    payNote: "PAY WHAT'S FAIR",
    image: "/produce/lemons.jpg",
    available: 4,
    weightLbs: 3,
    rating: 4.9,
    handoffs: 23,
    verified: true,
    memberSince: "March",
    review: "Lemons were perfect, easy porch grab.",
    handles: { venmo: "Maya-Greenthumb", cashapp: "$mayalemons" },
  },
  {
    id: "peaches",
    type: "produce",
    grower: "Marisol",
    initial: "M",
    title: "Sungold peaches, just picked",
    distance: "0.4 mi",
    pickupKind: "porch",
    pickupLabel: "Porch pickup",
    exactPickup: "7 Maple St · basket at the garden gate",
    price: "$5",
    suggestedAmount: 5,
    payNote: "PAY WHAT'S FAIR",
    image: "/produce/peaches.jpg",
    available: 12,
    weightLbs: 5,
    rating: 4.8,
    handoffs: 41,
    verified: true,
    memberSince: "January",
    review: "Sweetest peaches all summer. Marisol's a legend.",
    handles: { venmo: "Marisol-Orchard", paypal: "marisolorchard" },
  },
  {
    id: "zucchini",
    type: "produce",
    grower: "Priya",
    initial: "P",
    title: "Too many zucchini — please help",
    distance: "0.3 mi",
    pickupKind: "porch",
    pickupLabel: "Porch pickup",
    exactPickup: "22 Oak St · bin on the front steps",
    price: "Free",
    suggestedAmount: 0,
    payNote: "OR PAY WHAT'S FAIR",
    image: "/produce/zucchini.jpg",
    available: 9,
    weightLbs: 6,
    rating: 5.0,
    handoffs: 7,
    verified: true,
    memberSince: "May",
    review: "Gave half to my neighbor. Total glut, all free!",
    handles: { venmo: "Priya-Garden" },
  },
  {
    id: "grapes",
    type: "produce",
    grower: "Sam",
    initial: "S",
    title: "Backyard Concord grapes",
    distance: "0.6 mi",
    pickupKind: "porch",
    pickupLabel: "Porch pickup",
    exactPickup: "9 Pine St · cooler on the porch",
    price: "$4",
    suggestedAmount: 4,
    payNote: "PAY WHAT'S FAIR",
    image: "/produce/grapes.jpg",
    available: 3,
    weightLbs: 4,
    rating: 4.7,
    handoffs: 15,
    verified: true,
    memberSince: "February",
    review: "Made jam with these. Incredible.",
    handles: { venmo: "Sam-Vines", paypal: "samvines" },
  },
  {
    id: "basil",
    type: "produce",
    grower: "Lena",
    initial: "L",
    title: "Fresh basil & mint, cut today",
    distance: "0.5 mi",
    pickupKind: "hub",
    pickupLabel: "Hub · Oak St",
    exactPickup: "Oak St Hub · shelf inside the cabinet",
    price: "$2",
    suggestedAmount: 2,
    payNote: "PAY WHAT'S FAIR",
    image: "/produce/basil.jpg",
    available: 6,
    weightLbs: 1,
    rating: 4.9,
    handoffs: 31,
    verified: true,
    memberSince: "November",
    review: "Pesto for days. So fresh.",
    handles: { venmo: "Lena-Herbs", cashapp: "$lenaherbs" },
  },

  // The commons — the land, tools, and hands to grow it. Browse + Contact,
  // no payment (non-custodial, same verify gate as produce).
  {
    id: "plot-ruth",
    type: "land",
    grower: "Ruth",
    initial: "R",
    title: "Sunny backyard plot — come grow",
    distance: "0.3 mi",
    pickupKind: "porch",
    pickupLabel: "Backyard plot",
    exactPickup: "Your block · address shared once you connect",
    price: "Share the harvest",
    suggestedAmount: 0,
    payNote: "≈200 SQ FT · FULL SUN",
    image: "",
    available: 1,
    weightLbs: 0,
    rating: 4.9,
    handoffs: 12,
    verified: true,
    memberSince: "2023",
    review: "Ruth let us grow tomatoes all summer — a dream neighbor.",
    handles: {},
  },
  {
    id: "tiller-marcus",
    type: "tool",
    grower: "Marcus",
    initial: "M",
    title: "Borrow my rototiller — weekends",
    distance: "0.4 mi",
    pickupKind: "porch",
    pickupLabel: "Tool to borrow",
    exactPickup: "Pickup details shared once you connect",
    price: "Free to borrow",
    suggestedAmount: 0,
    payNote: "WEEKENDS · GAS-POWERED",
    image: "",
    available: 1,
    weightLbs: 0,
    rating: 5.0,
    handoffs: 8,
    verified: true,
    memberSince: "2024",
    review: "Saved me renting one. Marcus even showed me how to start it.",
    handles: {},
  },
  {
    id: "help-lourdes",
    type: "help",
    grower: "Lourdes",
    initial: "L",
    title: "Retired landscaper — I'll help you till & plant",
    distance: "0.5 mi",
    pickupKind: "porch",
    pickupLabel: "Helping hands",
    exactPickup: "We'll arrange a time once you connect",
    price: "Volunteer",
    suggestedAmount: 0,
    payNote: "WILL TRAVEL ON THE BLOCK",
    image: "",
    available: 1,
    weightLbs: 0,
    rating: 5.0,
    handoffs: 19,
    verified: true,
    memberSince: "2022",
    review: "Lourdes turned my dead lawn into a veggie bed in an afternoon.",
    handles: {},
  },
];
