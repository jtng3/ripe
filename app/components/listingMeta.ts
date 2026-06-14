import { Apple, Sprout, Wrench, HeartHandshake, type LucideIcon } from "lucide-react";
import type { ListingType } from "../lib/listings";

// Icon + label per listing type. Produce is photo-led so its icon is only a
// fallback; the commons types render as icon blocks in the feed.
export const META: Record<ListingType, { Icon: LucideIcon; label: string }> = {
  produce: { Icon: Apple, label: "Produce" },
  land: { Icon: Sprout, label: "Land to grow" },
  tool: { Icon: Wrench, label: "Tool to borrow" },
  help: { Icon: HeartHandshake, label: "Helping hands" },
};
