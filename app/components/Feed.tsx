"use client";

import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import type { Listing } from "../lib/listings";

export function Feed({
  items,
  onClaim,
}: {
  items: Listing[];
  onClaim: (l: Listing) => void;
}) {
  return (
    <div className="flex flex-col gap-5 px-[18px] pb-36">
      {items.map((l, i) => {
        const soldOut = l.available <= 0;
        return (
          <article
            key={l.id}
            style={{ animationDelay: `${i * 0.07}s` }}
            className="rise-in overflow-hidden rounded-[18px] border border-line bg-card shadow-[0_4px_14px_-10px_rgba(35,39,31,0.35)]"
          >
            <div className="relative h-[248px] bg-bone-2">
              <Image
                src={l.image}
                alt={l.title}
                fill
                sizes="(max-width: 440px) 100vw, 440px"
                className="object-cover"
              />
              <span className="absolute left-3 top-3 rounded-md bg-bone/90 px-2.5 py-1 text-[11px] font-bold text-ink backdrop-blur-sm">
                {soldOut ? "All claimed" : `${l.available} left`}
              </span>
              <span className="absolute right-3 top-3 rounded-md bg-black/55 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                {l.distance}
              </span>
              <span className="absolute bottom-3 left-3 rounded-md bg-bone/90 px-2.5 py-1 text-[11px] font-semibold text-ink backdrop-blur-sm">
                {l.pickupLabel}
              </span>
            </div>

            <div className="p-[15px] pt-[14px]">
              <div className="mb-2 flex items-center gap-1.5 text-ink-soft">
                <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-sage text-[11px] font-bold text-green-deep">
                  {l.initial}
                </span>
                <span className="text-[12.5px] font-semibold text-ink">
                  {l.grower}
                </span>
                {l.verified && (
                  <BadgeCheck
                    className="h-[15px] w-[15px] text-green"
                    aria-label="Verified neighbor"
                  />
                )}
                <span className="text-xs">
                  · {l.handoffs} handoffs · ★ {l.rating.toFixed(1)}
                </span>
              </div>

              <h3 className="font-display mb-3.5 text-[18px] font-medium tracking-tight text-ink">
                {l.title}
              </h3>

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-px">
                  <span className="text-[16px] font-bold text-ink">{l.price}</span>
                  <span className="text-[10px] font-bold tracking-[0.08em] text-ink-soft">
                    {l.payNote}
                  </span>
                </div>
                <button
                  onClick={() => onClaim(l)}
                  disabled={soldOut}
                  aria-label={`Claim ${l.title} from ${l.grower}`}
                  className="min-h-11 rounded-[11px] bg-green px-5 text-[14px] font-semibold text-white transition-transform duration-150 hover:-translate-y-px hover:bg-green-deep active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                >
                  {soldOut ? "Claimed" : "Claim"}
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
