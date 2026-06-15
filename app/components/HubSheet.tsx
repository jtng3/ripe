"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { X, Warehouse, MapPin, Clock, ShieldCheck, type LucideIcon } from "lucide-react";

// Progressive-disclosure explainer for the "Hub" pickup type. Opened on demand
// from the hub badge in the feed: contextual help, never shown unprompted.
export function HubSheet({ onClose }: { onClose: () => void }) {
  const reduce = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);
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
      aria-labelledby="hub-heading"
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

        <div className="overflow-y-auto px-5 pb-8 pt-1">
          <div className="flex flex-col gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage text-green">
              <Warehouse className="h-6 w-6" aria-hidden />
            </span>

            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-green-deep">
                Pickup types
              </span>
              <h2
                id="hub-heading"
                ref={headingRef}
                tabIndex={-1}
                className="font-display text-[24px] font-medium leading-tight tracking-tight text-ink outline-none"
              >
                What&rsquo;s a hub?
              </h2>
            </div>

            <p className="text-[14.5px] leading-relaxed text-ink-soft">
              A hub is a shared pickup spot a few neighbors keep going. Usually a
              cabinet, a shelf, or a cooler somewhere easy to reach. Growers drop
              their surplus there, so you can collect a claim whenever it suits
              you. No porch to find, no one to wait on.
            </p>

            <div className="flex flex-col gap-3 rounded-[14px] border border-line bg-card p-4">
              <Row icon={MapPin}>
                Claim here and verify your number. We share the hub&rsquo;s exact
                spot and shelf.
              </Row>
              <Row icon={Clock}>
                Swing by while it&rsquo;s open and grab your produce. Most hubs sit
                on a porch or in a garage.
              </Row>
              <Row icon={ShieldCheck}>
                Same trust as a porch pickup. Every neighbor is phone-verified
                first.
              </Row>
            </div>

            <p className="text-[12.5px] text-ink-soft">
              Prefer a porch pickup? That works the same way, just at the
              grower&rsquo;s own door.
            </p>

            <button
              onClick={onClose}
              className="mt-1 min-h-[54px] rounded-[13px] bg-ink text-[15px] font-semibold text-bone transition-transform duration-150 hover:-translate-y-px"
            >
              Got it
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Row({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 text-[13px] text-ink">
      <Icon className="mt-px h-4 w-4 shrink-0 text-green" aria-hidden />
      <span>{children}</span>
    </div>
  );
}
