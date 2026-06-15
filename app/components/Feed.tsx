"use client";

import Image from "next/image";
import { BadgeCheck, Info } from "lucide-react";
import type { Listing } from "../lib/listings";
import { META } from "./listingMeta";

export function Feed({
  items,
  onClaim,
  onContact,
  onHubInfo,
}: {
  items: Listing[];
  onClaim: (l: Listing) => void;
  onContact: (l: Listing) => void;
  onHubInfo: () => void;
}) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-1.5 px-6 py-20 text-center">
        <p className="font-display text-[18px] text-ink">Nothing here yet</p>
        <p className="text-[13.5px] text-ink-soft">Be the first to share on your block.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 px-[18px] pb-36">
      {items.map((l, i) => {
        const isProduce = l.type === "produce";
        const soldOut = isProduce && l.available <= 0;
        const { Icon, label } = META[l.type];
        const hasPhoto = l.image !== "";
        return (
          <article
            key={l.id}
            style={{ animationDelay: `${i * 0.07}s` }}
            className="rise-in overflow-hidden rounded-[18px] border border-line bg-card shadow-[0_4px_14px_-10px_rgba(35,39,31,0.35)]"
          >
            {hasPhoto ? (
              <div className="relative h-[248px] bg-bone-2">
                <Image
                  src={l.image}
                  alt={l.title}
                  fill
                  sizes="(max-width: 440px) 100vw, 440px"
                  className="object-cover"
                  unoptimized={l.image.startsWith("blob:") || l.image.startsWith("data:")}
                />
                {isProduce && (
                  <span className="absolute left-3 top-3 rounded-md bg-bone/90 px-2.5 py-1 text-[11px] font-bold text-ink backdrop-blur-sm">
                    {soldOut ? "All claimed" : `${l.available} left`}
                  </span>
                )}
                <span className="absolute right-3 top-3 rounded-md bg-black/55 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  {l.distance}
                </span>
                {l.pickupKind === "hub" ? (
                  <button
                    type="button"
                    onClick={() => onHubInfo()}
                    aria-label="What is a hub pickup?"
                    className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-md bg-bone/90 px-2.5 py-1 text-[11px] font-semibold text-ink backdrop-blur-sm transition-colors hover:bg-bone"
                  >
                    {l.pickupLabel}
                    <Info className="h-3 w-3 text-green" aria-hidden />
                  </button>
                ) : (
                  <span className="absolute bottom-3 left-3 rounded-md bg-bone/90 px-2.5 py-1 text-[11px] font-semibold text-ink backdrop-blur-sm">
                    {l.pickupLabel}
                  </span>
                )}
              </div>
            ) : (
              <div className="relative flex h-[248px] flex-col items-center justify-center gap-3 bg-gradient-to-b from-sage to-bone-2">
                <span className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-card text-green shadow-[0_6px_16px_-10px_rgba(35,39,31,0.45)]">
                  <Icon className="h-7 w-7" aria-hidden />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-green-deep">
                  {label}
                </span>
                <span className="absolute right-3 top-3 rounded-md bg-black/45 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  {l.distance}
                </span>
              </div>
            )}

            <div className="p-[15px] pt-[14px]">
              <div className="mb-2 flex items-center gap-1.5 text-ink-soft">
                <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-sage text-[11px] font-bold text-green-deep">
                  {l.initial}
                </span>
                <span className="text-[12.5px] font-semibold text-ink">{l.grower}</span>
                {l.verified && (
                  <BadgeCheck
                    className="h-[15px] w-[15px] text-green"
                    aria-label="Verified neighbor"
                  />
                )}
                <span className="text-xs">
                  {l.handoffs === 0
                    ? "· New neighbor"
                    : `· ${l.handoffs} ${isProduce ? "handoffs" : "connections"} · ★ ${l.rating.toFixed(1)}`}
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
                {isProduce ? (
                  <button
                    onClick={() => onClaim(l)}
                    disabled={soldOut}
                    aria-label={`Claim ${l.title} from ${l.grower}`}
                    className="min-h-11 rounded-[11px] bg-green px-5 text-[14px] font-semibold text-white transition-transform duration-150 hover:-translate-y-px hover:bg-green-deep active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                  >
                    {soldOut ? "Claimed" : "Claim"}
                  </button>
                ) : (
                  <button
                    onClick={() => onContact(l)}
                    aria-label={`Contact ${l.grower} about ${l.title}`}
                    className="min-h-11 rounded-[11px] bg-green px-5 text-[14px] font-semibold text-white transition-transform duration-150 hover:-translate-y-px hover:bg-green-deep active:translate-y-0"
                  >
                    Contact
                  </button>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
