import { Apple, Sprout, Wrench, HeartHandshake, type LucideIcon } from "lucide-react";
import type { ListingType, Reach } from "../lib/listings";

// Labels for the reach dial. `pick` = the share-flow button; `phrase` = browse
// copy ("Marisol shares this across the neighborhood"); `dist` = the ring size.
export const REACH: Record<Reach, { pick: string; phrase: string; dist: string }> = {
  block: { pick: "My block", phrase: "on this block", dist: "0.1 mi" },
  street: { pick: "My street", phrase: "with this street", dist: "0.25 mi" },
  neighborhood: { pick: "The neighborhood", phrase: "across the neighborhood", dist: "0.5 mi" },
};

// Icon + label per listing type. Produce is photo-led so its icon is only a
// fallback; the commons types render as icon blocks in the feed.
export const META: Record<ListingType, { Icon: LucideIcon; label: string }> = {
  produce: { Icon: Apple, label: "Produce" },
  land: { Icon: Sprout, label: "Land to grow" },
  tool: { Icon: Wrench, label: "Tool to borrow" },
  help: { Icon: HeartHandshake, label: "Helping hands" },
};
