"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { X, BadgeCheck, Lock, Check } from "lucide-react";
import type { Listing } from "../lib/listings";
import { META } from "./listingMeta";

// Lightweight connect flow for commons listings (land / tools / help):
// browse → send a note → request sent. No payment, same privacy posture.
export function ContactSheet({
  listing: l,
  onClose,
}: {
  listing: Listing;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { Icon, label } = META[l.type];

  useEffect(() => {
    headingRef.current?.focus();
  }, [sent]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const sheetMotion = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { y: "100%" },
        animate: { y: 0 },
        exit: { y: "100%" },
        transition: { type: "spring" as const, damping: 32, stiffness: 320 },
      };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-heading"
    >
      <motion.button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.div
        {...sheetMotion}
        className="relative flex max-h-[90dvh] w-full max-w-[440px] flex-col overflow-hidden rounded-t-[26px] bg-bone shadow-[0_-20px_50px_-20px_rgba(35,39,31,0.5)]"
      >
        <div className="flex items-center justify-between px-5 pb-1 pt-3">
          <span className="mx-auto h-1 w-9 rounded-full bg-line" aria-hidden />
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-ink-soft hover:bg-bone-2"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 pb-7 pt-1">
          {!sent ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sage text-green">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-green-deep">
                    {label}
                  </span>
                  <h2
                    id="contact-heading"
                    ref={headingRef}
                    tabIndex={-1}
                    className="font-display text-[20px] font-medium leading-tight tracking-tight text-ink outline-none"
                  >
                    {l.title}
                  </h2>
                </div>
              </div>

              <div className="rounded-[14px] border border-line bg-card p-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sage text-[13px] font-bold text-green-deep">
                    {l.initial}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1 text-[14px] font-semibold text-ink">
                      {l.grower}
                      {l.verified && (
                        <BadgeCheck className="h-4 w-4 text-green" aria-label="Verified neighbor" />
                      )}
                    </div>
                    <div className="text-[12px] text-ink-soft">
                      Verified neighbor · {l.handoffs} connections · ★ {l.rating.toFixed(1)}
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-[12.5px] italic text-ink-soft">“{l.review}”</p>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] font-semibold text-ink">Send {l.grower} a note</span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder={`Hi ${l.grower}! I'd love to connect about this.`}
                  className="resize-none rounded-[12px] border border-line bg-card px-3.5 py-2.5 text-[15px] text-ink outline-none focus:border-green"
                />
              </label>

              <div className="flex items-center gap-2 rounded-[12px] bg-sage/60 px-3 py-2.5 text-[12.5px] text-green-deep">
                <Lock className="h-4 w-4 shrink-0" aria-hidden />
                Exact location stays private until you both agree to connect.
              </div>

              <button
                onClick={() => setSent(true)}
                className="min-h-[54px] rounded-[13px] bg-green text-[15px] font-semibold text-white transition-transform duration-150 hover:-translate-y-px hover:bg-green-deep"
              >
                Request to connect
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage text-green-deep">
                <Check className="h-7 w-7" aria-hidden />
              </div>
              <h2
                id="contact-heading"
                ref={headingRef}
                tabIndex={-1}
                className="font-display text-[22px] font-medium tracking-tight text-ink outline-none"
              >
                Request sent
              </h2>
              <p className="text-[13.5px] text-ink-soft">
                {l.grower} will see your note and can reply right here in Ripe. Your contact
                details stay private until you both agree to connect.
              </p>
              <button
                onClick={onClose}
                className="mt-1 min-h-[54px] w-full rounded-[13px] bg-ink text-[15px] font-semibold text-bone transition-transform duration-150 hover:-translate-y-px"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
