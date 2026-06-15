"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { Feed } from "./Feed";
import { ClaimSheet } from "./ClaimSheet";
import { ShareSheet } from "./ShareSheet";
import { ContactSheet } from "./ContactSheet";
import { HubSheet } from "./HubSheet";
import { BLOCK_TOTAL, type Listing, type ListingType } from "../lib/listings";

const FILTERS: { key: "all" | ListingType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "produce", label: "Produce" },
  { key: "land", label: "Land" },
  { key: "tool", label: "Tools" },
  { key: "help", label: "Help" },
];

// Section label reacts to the filter so the commons (the 2nd pillar) is legible.
const SECTION: Record<"all" | ListingType, string> = {
  all: "Near you",
  produce: "Fresh near you",
  land: "Land to grow",
  tool: "Tools to borrow",
  help: "Helping hands",
};

export function RipeApp({ listings }: { listings: Listing[] }) {
  const [items, setItems] = useState(listings);
  const [filter, setFilter] = useState<"all" | ListingType>("all");
  const [claiming, setClaiming] = useState<Listing | null>(null);
  const [contacting, setContacting] = useState<Listing | null>(null);
  const [sharing, setSharing] = useState(false);
  const [hubInfo, setHubInfo] = useState(false);
  const [verified, setVerified] = useState(false);

  // Claiming holds the produce for 1 hour — decrements availability, no payment.
  function hold(id: string) {
    setItems((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, available: Math.max(0, l.available - 1) } : l,
      ),
    );
  }

  // Sharing drops a new pin — prepend it and reset to All so it's visible on top.
  function addListing(l: Listing) {
    setItems((prev) => [l, ...prev]);
    setFilter("all");
    setSharing(false);
  }

  const shown = filter === "all" ? items : items.filter((l) => l.type === filter);
  const sheetOpen = Boolean(claiming) || Boolean(contacting) || sharing || hubInfo;
  const moneyView = filter === "all" || filter === "produce";

  return (
    <div className="relative mx-auto min-h-dvh max-w-[440px] bg-bone">
      <main inert={sheetOpen ? true : undefined} className="flex flex-col">
        <header className="sticky top-0 z-10 bg-bone/85 px-5 pb-2 pt-4 backdrop-blur-md">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-display text-[25px] font-medium leading-none tracking-tight text-ink">
                Ripe
              </span>
              <span className="mt-1 text-[11px] font-semibold text-ink-soft">
                Money goes straight to the grower
              </span>
            </div>
            <span className="flex items-center gap-1.5 pt-1 text-[13px] font-semibold text-ink-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-green" />
              Sunset District
            </span>
          </div>
          <div
            role="group"
            aria-label="Filter listings by type"
            className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                aria-pressed={filter === f.key}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                  filter === f.key
                    ? "border-ink bg-ink text-bone"
                    : "border-line bg-card text-ink-soft hover:bg-bone-2"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </header>

        <div className="flex items-baseline justify-between px-5 pb-3.5 pt-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-soft">
            {SECTION[filter]}
          </span>
          <span aria-live="polite" className="text-[11px] font-semibold text-ink-soft">
            {moneyView ? `$${BLOCK_TOTAL} kept local this week` : `${shown.length} nearby`}
          </span>
        </div>

        <Feed
          items={shown}
          onClaim={setClaiming}
          onContact={setContacting}
          onHubInfo={() => setHubInfo(true)}
        />

        <div className="fixed inset-x-0 bottom-0 z-10 mx-auto max-w-[440px] bg-gradient-to-t from-bone from-40% to-transparent px-[18px] pb-6 pt-6">
          <button
            onClick={() => setSharing(true)}
            className="w-full rounded-[13px] bg-ink py-3.5 text-[14.5px] font-semibold text-bone transition-transform duration-150 hover:-translate-y-px"
          >
            Share your surplus
          </button>
        </div>
      </main>

      <AnimatePresence>
        {claiming && (
          <ClaimSheet
            key={claiming.id}
            listing={claiming}
            alreadyVerified={verified}
            onHold={hold}
            onVerified={() => setVerified(true)}
            onClose={() => setClaiming(null)}
          />
        )}
        {contacting && (
          <ContactSheet
            key={contacting.id}
            listing={contacting}
            onClose={() => setContacting(null)}
          />
        )}
        {sharing && <ShareSheet onPost={addListing} onClose={() => setSharing(false)} />}
        {hubInfo && <HubSheet onClose={() => setHubInfo(false)} />}
      </AnimatePresence>
    </div>
  );
}
