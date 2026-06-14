"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { X, Camera, MapPin, Check } from "lucide-react";
import type { Listing, PickupKind } from "../lib/listings";

// Unique-enough ids for pins dropped during a session.
let counter = 0;

export function ShareSheet({
  onPost,
  onClose,
}: {
  onPost: (l: Listing) => void;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const [photo, setPhoto] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [free, setFree] = useState(false);
  const [pickup, setPickup] = useState<PickupKind>("porch");
  const [venmo, setVenmo] = useState("");

  const headingRef = useRef<HTMLHeadingElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

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

  function pickPhoto(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setPhoto(URL.createObjectURL(f)); // ephemeral preview — fine for the demo
  }

  const num = free ? 0 : Number(amount) || 0;
  const canPost = !!photo && title.trim().length > 1;

  function post() {
    if (!canPost) return;
    const isFree = free || num === 0;
    const listing: Listing = {
      id: `you-${++counter}`,
      type: "produce",
      grower: "You",
      initial: "Y",
      title: title.trim(),
      distance: "Just posted",
      pickupKind: pickup,
      pickupLabel: pickup === "porch" ? "Porch pickup" : "Hub · Elm St",
      exactPickup:
        pickup === "porch"
          ? "Your porch · basket by the door"
          : "Elm St Hub · the green crate by the gate",
      price: isFree ? "Free" : `$${num}`,
      suggestedAmount: num,
      payNote: isFree ? "OR PAY WHAT'S FAIR" : "PAY WHAT'S FAIR",
      image: photo!,
      available: 1,
      weightLbs: 3,
      rating: 5.0,
      handoffs: 0,
      verified: true,
      memberSince: "today",
      review: "Fresh from my garden.",
      handles: venmo.trim() ? { venmo: venmo.trim() } : {},
    };
    onPost(listing);
  }

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
      aria-labelledby="share-heading"
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
          <h2
            id="share-heading"
            ref={headingRef}
            tabIndex={-1}
            className="font-display text-[22px] font-medium tracking-tight text-ink outline-none"
          >
            Share your surplus
          </h2>
          <p className="mt-1 text-[13px] text-ink-soft">
            Whole, uncut produce from your garden — free or pay-what&rsquo;s-fair.
          </p>

          {/* photo */}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative mt-4 flex h-[180px] w-full items-center justify-center overflow-hidden rounded-[16px] border border-dashed border-line bg-bone-2 text-ink-soft"
          >
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element -- ephemeral object URL, not optimizable
              <img src={photo} alt="Your produce" className="h-full w-full object-cover" />
            ) : (
              <span className="flex flex-col items-center gap-1.5 text-[13px] font-semibold">
                <Camera className="h-6 w-6" aria-hidden /> Add a photo
              </span>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={pickPhoto}
            className="sr-only"
            aria-label="Add a photo of your produce"
          />

          {/* title */}
          <label className="mt-4 flex flex-col gap-1.5">
            <span className="text-[12px] font-semibold text-ink">What is it?</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="A bag of Meyer lemons"
              className="min-h-[48px] rounded-[12px] border border-line bg-card px-3.5 text-[16px] text-ink outline-none focus:border-green"
            />
          </label>

          {/* price */}
          <div className="mt-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-soft">
              Pay what&rsquo;s fair
            </span>
            <div className="mt-1.5 flex items-center gap-2">
              <div
                className={`flex flex-1 items-center rounded-[12px] border bg-card px-3.5 ${
                  free ? "border-line opacity-50" : "border-line focus-within:border-green"
                }`}
              >
                <span className="text-[20px] font-bold text-ink-soft">$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  disabled={free}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                  placeholder="0"
                  aria-label="Suggested amount in dollars"
                  className="min-h-[48px] w-full bg-transparent px-2 text-[20px] font-bold text-ink outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => setFree((v) => !v)}
                aria-pressed={free}
                className={`min-h-[48px] rounded-[12px] border px-4 text-[14px] font-semibold transition-colors ${
                  free ? "border-green bg-green text-white" : "border-line bg-card text-ink"
                }`}
              >
                Free
              </button>
            </div>
          </div>

          {/* pickup */}
          <div className="mt-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-soft">
              Pickup
            </span>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              {(["porch", "hub"] as PickupKind[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setPickup(k)}
                  aria-pressed={pickup === k}
                  className={`flex min-h-[48px] items-center justify-center gap-1.5 rounded-[12px] border text-[14px] font-semibold transition-colors ${
                    pickup === k
                      ? "border-green bg-sage/60 text-green-deep"
                      : "border-line bg-card text-ink"
                  }`}
                >
                  <MapPin className="h-4 w-4" aria-hidden />
                  {k === "porch" ? "My porch" : "Neighbor hub"}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-[12px] text-ink-soft">
              Exact spot stays private until a verified neighbor claims it.
            </p>
          </div>

          {/* venmo handle — the non-custodial model, made visible */}
          <label className="mt-4 flex flex-col gap-1.5">
            <span className="text-[12px] font-semibold text-ink">
              Where do neighbors pay you?{" "}
              <span className="font-normal text-ink-soft">(optional)</span>
            </span>
            <div className="flex items-center rounded-[12px] border border-line bg-card px-3.5 focus-within:border-green">
              <span className="text-[15px] font-semibold text-ink-soft">@</span>
              <input
                value={venmo}
                onChange={(e) => setVenmo(e.target.value)}
                placeholder="your-venmo"
                aria-label="Your Venmo handle"
                className="min-h-[48px] w-full bg-transparent px-2 text-[16px] text-ink outline-none"
              />
            </div>
            <span className="text-[11.5px] text-ink-soft">
              Ripe never touches it — neighbors pay you straight in your wallet.
            </span>
          </label>

          {/* submit */}
          <button
            onClick={post}
            disabled={!canPost}
            className="mt-5 flex min-h-[54px] w-full items-center justify-center gap-2 rounded-[13px] bg-green text-[15px] font-semibold text-white transition-transform duration-150 hover:-translate-y-px hover:bg-green-deep disabled:opacity-40 disabled:hover:translate-y-0"
          >
            <Check className="h-5 w-5" aria-hidden /> Share with your block
          </button>
        </div>
      </motion.div>
    </div>
  );
}
