"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { Feed } from "./Feed";
import { ClaimSheet } from "./ClaimSheet";
import type { Listing } from "../lib/listings";

export function RipeApp({ listings }: { listings: Listing[] }) {
  const [items, setItems] = useState(listings);
  const [claiming, setClaiming] = useState<Listing | null>(null);
  const [verified, setVerified] = useState(false);

  // Claiming holds the produce for 1 hour — decrements availability, no payment.
  function hold(id: string) {
    setItems((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, available: Math.max(0, l.available - 1) } : l,
      ),
    );
  }

  return (
    <div className="relative mx-auto min-h-dvh max-w-[440px] bg-bone">
      <main inert={claiming ? true : undefined} className="flex flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between bg-bone/85 px-5 pb-3 pt-4 backdrop-blur-md">
          <span className="font-display text-[25px] font-medium tracking-tight text-ink">
            Ripe
          </span>
          <span className="flex items-center gap-1.5 text-[13px] font-semibold text-ink-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-green" />
            Sunset District
          </span>
        </header>

        <div className="flex items-baseline justify-between px-5 pb-3.5 pt-1">
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-soft">
            Near you
          </span>
          <span className="text-[11px] font-semibold text-ink-soft">
            {items.length} within ½ mile
          </span>
        </div>

        <Feed items={items} onClaim={setClaiming} />

        <div className="fixed inset-x-0 bottom-0 z-10 mx-auto max-w-[440px] bg-gradient-to-t from-bone from-40% to-transparent px-[18px] pb-6 pt-6">
          <button className="w-full rounded-[13px] bg-ink py-3.5 text-[14.5px] font-semibold text-bone transition-transform duration-150 hover:-translate-y-px">
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
      </AnimatePresence>
    </div>
  );
}
