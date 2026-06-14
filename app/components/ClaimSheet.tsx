"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import { BadgeCheck, X, ShieldCheck, MapPin, Lock, ArrowUpRight } from "lucide-react";
import type { Listing } from "../lib/listings";
import {
  venmoDeepLink,
  venmoWebLink,
  cashAppLink,
  paypalLink,
} from "../lib/payment";

type Step = "detail" | "verify" | "pay" | "wait" | "receipt";

export function ClaimSheet({
  listing,
  alreadyVerified,
  onHold,
  onVerified,
  onClose,
}: {
  listing: Listing;
  alreadyVerified: boolean;
  onHold: (id: string) => void;
  onVerified: () => void;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState<Step>("detail");
  const [held, setHeld] = useState(false);
  const [phone, setPhone] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [amount, setAmount] = useState(
    listing.suggestedAmount > 0 ? String(listing.suggestedAmount) : "",
  );
  const [paidVia, setPaidVia] = useState<"pickup" | "venmo" | "cashapp" | "paypal">(
    "pickup",
  );
  const [showQR, setShowQR] = useState(false);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Move focus to each step's heading for screen readers; close on Esc.
  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const num = Number(amount) || 0;
  const note = `Ripe · ${listing.grower}'s ${listing.title.replace(/^A |^Too many /i, "").toLowerCase()}`;
  const neighborsFed = Math.max(1, Math.round(listing.weightLbs * 1.3));

  function startClaim() {
    if (!held) {
      onHold(listing.id);
      setHeld(true);
    }
    setStep(alreadyVerified ? "pay" : "verify");
  }

  function finishVerify() {
    onVerified();
    setStep("pay");
  }

  function payNow(via: "venmo" | "cashapp" | "paypal") {
    setPaidVia(via);
    const h = listing.handles;
    let link = "";
    if (via === "venmo" && h.venmo) link = venmoDeepLink(h.venmo, num, note);
    if (via === "cashapp" && h.cashapp) link = cashAppLink(h.cashapp, num);
    if (via === "paypal" && h.paypal) link = paypalLink(h.paypal, num);
    if (link) window.location.href = link; // opens the wallet app on mobile
    setStep("wait");
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
      aria-labelledby="sheet-heading"
    >
      {/* backdrop */}
      <motion.button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* sheet */}
      <motion.div
        {...sheetMotion}
        className="relative flex max-h-[90dvh] w-full max-w-[440px] flex-col overflow-hidden rounded-t-[26px] bg-bone shadow-[0_-20px_50px_-20px_rgba(35,39,31,0.5)]"
      >
        <div className="flex items-center justify-between px-5 pb-1 pt-3">
          <span className="mx-auto h-1 w-9 rounded-full bg-line" aria-hidden />
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-ink-soft hover:bg-bone-2"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 pb-7 pt-1">
          {/* live region for SR step announcements */}
          <p className="sr-only" aria-live="polite">
            {step === "detail" && "Listing details"}
            {step === "verify" && "Step: verify your phone to continue"}
            {step === "pay" && "Pickup revealed. Choose how to pay."}
            {step === "wait" && "Finish paying in your wallet app, then return."}
            {step === "receipt" && `Done. You saved ${listing.weightLbs} pounds of food.`}
          </p>

          {step === "detail" && (
            <DetailStep listing={listing} headingRef={headingRef} onClaim={startClaim} />
          )}
          {step === "verify" && (
            <VerifyStep
              grower={listing.grower}
              headingRef={headingRef}
              phone={phone}
              setPhone={setPhone}
              codeSent={codeSent}
              setCodeSent={setCodeSent}
              code={code}
              setCode={setCode}
              onDone={finishVerify}
            />
          )}
          {step === "pay" && (
            <PayStep
              listing={listing}
              headingRef={headingRef}
              amount={amount}
              setAmount={setAmount}
              num={num}
              onPayAtPickup={() => {
                setPaidVia("pickup");
                setStep("receipt");
              }}
              onPayNow={payNow}
            />
          )}
          {step === "wait" && (
            <WaitStep
              listing={listing}
              headingRef={headingRef}
              num={num}
              note={note}
              showQR={showQR}
              setShowQR={setShowQR}
              onPaid={() => setStep("receipt")}
            />
          )}
          {step === "receipt" && (
            <ReceiptStep
              listing={listing}
              headingRef={headingRef}
              num={num}
              paidVia={paidVia}
              neighborsFed={neighborsFed}
              reduce={!!reduce}
              onDone={onClose}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* ---------- steps ---------- */

function TrustBlock({ l }: { l: Listing }) {
  return (
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
            Verified neighbor · {l.handoffs} handoffs · ★ {l.rating.toFixed(1)} · since {l.memberSince}
          </div>
        </div>
      </div>
      <p className="mt-2 text-[12.5px] italic text-ink-soft">“{l.review}”</p>
    </div>
  );
}

function DetailStep({
  listing: l,
  headingRef,
  onClaim,
}: {
  listing: Listing;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onClaim: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative h-[180px] overflow-hidden rounded-[16px] bg-bone-2">
        <Image
          src={l.image}
          alt={l.title}
          fill
          sizes="440px"
          className="object-cover"
          unoptimized={l.image.startsWith("blob:") || l.image.startsWith("data:")}
        />
        <span className="absolute bottom-2.5 left-2.5 rounded-md bg-bone/90 px-2.5 py-1 text-[11px] font-semibold text-ink backdrop-blur-sm">
          {l.pickupLabel} · {l.distance}
        </span>
      </div>

      <h2
        id="sheet-heading"
        ref={headingRef}
        tabIndex={-1}
        className="font-display text-[22px] font-medium leading-tight tracking-tight text-ink outline-none"
      >
        {l.title}
      </h2>

      <TrustBlock l={l} />

      <div className="flex items-center gap-2 rounded-[12px] bg-sage/60 px-3 py-2.5 text-[12.5px] text-green-deep">
        <Lock className="h-4 w-4 shrink-0" aria-hidden />
        Exact pickup spot unlocks after a quick verify — {l.grower}&rsquo;s home stays private until then.
      </div>

      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="text-[20px] font-bold text-ink">{l.price}</div>
          <div className="text-[10px] font-bold tracking-[0.08em] text-ink-soft">
            {l.payNote}
          </div>
        </div>
        <button
          onClick={onClaim}
          className="min-h-[52px] rounded-[13px] bg-green px-6 text-[15px] font-semibold text-white transition-transform duration-150 hover:-translate-y-px hover:bg-green-deep"
        >
          Claim — hold 1 hour
        </button>
      </div>
      <p className="text-center text-[12px] text-ink-soft">
        Free to hold. We reserve it for you for 1 hour — no payment yet.
      </p>
    </div>
  );
}

function VerifyStep({
  grower,
  headingRef,
  phone,
  setPhone,
  codeSent,
  setCodeSent,
  code,
  setCode,
  onDone,
}: {
  grower: string;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  phone: string;
  setPhone: (v: string) => void;
  codeSent: boolean;
  setCodeSent: (v: boolean) => void;
  code: string;
  setCode: (v: string) => void;
  onDone: () => void;
}) {
  function onCode(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 6);
    setCode(digits);
    if (digits.length === 6) setTimeout(onDone, 350); // auto-advance
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-green" aria-hidden />
        <h2
          id="sheet-heading"
          ref={headingRef}
          tabIndex={-1}
          className="font-display text-[21px] font-medium tracking-tight text-ink outline-none"
        >
          Quick safety check
        </h2>
      </div>
      <p className="text-[13.5px] text-ink-soft">
        One tap keeps Ripe neighbors-only. {grower} verified too — you&rsquo;ll both
        know you&rsquo;re real neighbors. We never share your number or post.
      </p>

      {!codeSent ? (
        <>
          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-semibold text-ink">Your mobile number</span>
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 012-3456"
              className="min-h-[48px] rounded-[12px] border border-line bg-card px-3.5 text-[16px] text-ink outline-none focus:border-green"
            />
          </label>
          <button
            onClick={() => setCodeSent(true)}
            className="min-h-[52px] rounded-[13px] bg-green text-[15px] font-semibold text-white transition-transform duration-150 hover:-translate-y-px hover:bg-green-deep"
          >
            Text me a code
          </button>
        </>
      ) : (
        <>
          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-semibold text-ink">
              Enter the 6-digit code we texted you
            </span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              maxLength={6}
              value={code}
              onChange={(e) => onCode(e.target.value)}
              placeholder="••••••"
              className="min-h-[48px] rounded-[12px] border border-line bg-card px-3.5 text-center text-[22px] tracking-[0.4em] text-ink outline-none focus:border-green"
            />
          </label>
          <button
            onClick={onDone}
            disabled={code.length < 4}
            className="min-h-[52px] rounded-[13px] bg-green text-[15px] font-semibold text-white transition-transform duration-150 hover:-translate-y-px hover:bg-green-deep disabled:opacity-40"
          >
            Verify
          </button>
          <p className="text-center text-[12px] text-ink-soft">
            You&rsquo;ll only do this once. Didn&rsquo;t get it?{" "}
            <button className="font-semibold text-green underline">Resend</button>
          </p>
        </>
      )}
    </div>
  );
}

function PayStep({
  listing: l,
  headingRef,
  amount,
  setAmount,
  num,
  onPayAtPickup,
  onPayNow,
}: {
  listing: Listing;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  amount: string;
  setAmount: (v: string) => void;
  num: number;
  onPayAtPickup: () => void;
  onPayNow: (via: "venmo" | "cashapp" | "paypal") => void;
}) {
  const bump = (d: number) => setAmount(String(Math.max(0, num + d)));
  return (
    <div className="flex flex-col gap-4">
      {/* reveal */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="rounded-[14px] border border-green/30 bg-sage/50 p-3.5"
      >
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-green-deep">
          <MapPin className="h-3.5 w-3.5" aria-hidden /> Pickup spot · held for 1 hour
        </div>
        <h2
          id="sheet-heading"
          ref={headingRef}
          tabIndex={-1}
          className="mt-1 font-display text-[18px] font-medium tracking-tight text-ink outline-none"
        >
          {l.exactPickup}
        </h2>
        <p className="mt-1 text-[12px] text-ink-soft">
          You&rsquo;re both verified neighbors. {l.grower} has been notified.
        </p>
      </motion.div>

      {/* amount */}
      <div>
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-soft">
            Pay what&rsquo;s fair
          </span>
          <div className="flex items-center rounded-[12px] border border-line bg-card px-3.5 focus-within:border-green">
            <span className="text-[20px] font-bold text-ink-soft">$</span>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="0"
              aria-label="Amount in dollars"
              className="min-h-[48px] w-full bg-transparent px-2 text-[20px] font-bold text-ink outline-none"
            />
            <div className="flex gap-1.5">
              <Chip onClick={() => bump(1)}>+$1</Chip>
              <Chip onClick={() => bump(2)}>+$2</Chip>
            </div>
          </div>
        </label>
        {l.suggestedAmount === 0 && (
          <p className="mt-1.5 text-[12px] text-ink-soft">
            It&rsquo;s free — add a thank-you if you like.
          </p>
        )}
      </div>

      {/* equitable ledger — the tiebreaker, made visible */}
      <div className="flex items-center justify-center gap-1.5 rounded-[12px] bg-bone-2/70 py-2.5 text-[13px] font-semibold text-ink">
        You pay ${num} → {l.grower} gets ${num}
        <span className="text-terracotta">· Ripe takes $0</span>
      </div>

      {/* primary = pay at pickup (default) */}
      <button
        onClick={onPayAtPickup}
        className="min-h-[54px] rounded-[13px] bg-green text-[15px] font-semibold text-white transition-transform duration-150 hover:-translate-y-px hover:bg-green-deep"
      >
        I&rsquo;ll pay at pickup
      </button>
      <p className="-mt-2 text-center text-[12px] text-ink-soft">
        Most neighbors pay at pickup, after they see the produce.
      </p>

      {/* secondary = pay now */}
      <div className="flex flex-col gap-2 border-t border-line pt-3">
        <span className="text-center text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-soft">
          or pay now
        </span>
        <div className="flex flex-wrap justify-center gap-2">
          {l.handles.venmo && (
            <PayNowButton onClick={() => onPayNow("venmo")} primary>
              Pay ${num} in Venmo <ArrowUpRight className="h-4 w-4" />
            </PayNowButton>
          )}
          {l.handles.cashapp && (
            <PayNowButton onClick={() => onPayNow("cashapp")}>Cash App</PayNowButton>
          )}
          {l.handles.paypal && (
            <PayNowButton onClick={() => onPayNow("paypal")}>PayPal</PayNowButton>
          )}
        </div>
        <p className="text-center text-[11.5px] text-ink-soft">
          Ripe never touches the money — it goes straight to {l.grower}.
        </p>
      </div>
    </div>
  );
}

function WaitStep({
  listing: l,
  headingRef,
  num,
  note,
  showQR,
  setShowQR,
  onPaid,
}: {
  listing: Listing;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  num: number;
  note: string;
  showQR: boolean;
  setShowQR: (v: boolean) => void;
  onPaid: () => void;
}) {
  const web = l.handles.venmo ? venmoWebLink(l.handles.venmo, num, note) : "";
  return (
    <div className="flex flex-col items-center gap-4 py-2 text-center">
      <h2
        id="sheet-heading"
        ref={headingRef}
        tabIndex={-1}
        className="font-display text-[20px] font-medium tracking-tight text-ink outline-none"
      >
        Opening your wallet…
      </h2>
      <p className="text-[13.5px] text-ink-soft">
        Finish paying {l.grower} ${num}, then pop back here.
      </p>

      {showQR && web ? (
        <div className="rounded-[14px] border border-line bg-card p-4">
          <QRCodeSVG value={web} size={172} bgColor="#ffffff" fgColor="#23271f" />
          <p className="mt-2 text-[12px] text-ink-soft">
            Scan with your phone&rsquo;s camera to pay
          </p>
        </div>
      ) : (
        web && (
          <button
            onClick={() => setShowQR(true)}
            className="text-[13px] font-semibold text-green underline"
          >
            Didn&rsquo;t open? Show QR code
          </button>
        )
      )}

      <button
        onClick={onPaid}
        className="mt-1 min-h-[54px] w-full rounded-[13px] bg-green text-[15px] font-semibold text-white transition-transform duration-150 hover:-translate-y-px hover:bg-green-deep"
      >
        I paid {l.grower}
      </button>
    </div>
  );
}

function ReceiptStep({
  listing: l,
  headingRef,
  num,
  paidVia,
  neighborsFed,
  reduce,
  onDone,
}: {
  listing: Listing;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  num: number;
  paidVia: "pickup" | "venmo" | "cashapp" | "paypal";
  neighborsFed: number;
  reduce: boolean;
  onDone: () => void;
}) {
  return (
    <div className="relative flex flex-col items-center gap-4 py-2 text-center">
      {!reduce && <LeafConfetti />}
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage text-green-deep">
        <BadgeCheck className="h-7 w-7" aria-hidden />
      </div>
      <h2
        id="sheet-heading"
        ref={headingRef}
        tabIndex={-1}
        className="font-display text-[24px] font-medium tracking-tight text-ink outline-none"
      >
        Your block, fed.
      </h2>

      <div className="grid w-full grid-cols-3 gap-2">
        <Stat value={<CountUp to={l.weightLbs} reduce={reduce} suffix=" lb" />} label="saved" />
        <Stat value={<CountUp to={neighborsFed} reduce={reduce} />} label="neighbors fed" />
        <Stat value="$0" label="platform cut" />
      </div>

      <p className="text-[13.5px] text-ink-soft">
        {num > 0 ? (
          <>
            {paidVia === "pickup" ? "You'll hand" : "You paid"} {l.grower} ${num} —{" "}
            <span className="font-semibold text-ink">100% of it.</span> Ripe took $0.
          </>
        ) : (
          <>
            {l.grower} gifted this one free. Surplus that would&rsquo;ve rotted, on a
            plate instead.
          </>
        )}
      </p>

      <div className="flex w-full flex-col gap-2 pt-1">
        <button className="min-h-[52px] rounded-[13px] border border-line bg-card text-[14.5px] font-semibold text-ink transition-transform duration-150 hover:-translate-y-px">
          Share this
        </button>
        <button
          onClick={onDone}
          className="min-h-[54px] rounded-[13px] bg-ink text-[15px] font-semibold text-bone transition-transform duration-150 hover:-translate-y-px"
        >
          Done
        </button>
      </div>
    </div>
  );
}

/* ---------- bits ---------- */

function Chip({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full bg-bone-2 px-2.5 py-1.5 text-[12px] font-bold text-ink-soft hover:bg-sage"
    >
      {children}
    </button>
  );
}

function PayNowButton({
  children,
  onClick,
  primary,
}: {
  children: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={
        primary
          ? "inline-flex min-h-[48px] items-center gap-1.5 rounded-[12px] bg-ink px-4 text-[14px] font-semibold text-bone transition-transform duration-150 hover:-translate-y-px"
          : "inline-flex min-h-[48px] items-center rounded-[12px] border border-line bg-card px-4 text-[13.5px] font-semibold text-ink transition-transform duration-150 hover:-translate-y-px"
      }
    >
      {children}
    </button>
  );
}

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="rounded-[12px] bg-bone-2/70 px-2 py-3">
      <div className="font-display text-[22px] font-semibold text-ink">{value}</div>
      <div className="mt-0.5 text-[11px] font-semibold text-ink-soft">{label}</div>
    </div>
  );
}

function CountUp({
  to,
  reduce,
  suffix = "",
}: {
  to: number;
  reduce: boolean;
  suffix?: string;
}) {
  const [val, setVal] = useState(reduce ? to : 0);
  useEffect(() => {
    if (reduce) {
      setVal(to);
      return;
    }
    let raf = 0;
    let start = 0;
    const dur = 1000;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(to * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setVal(to);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, reduce]);
  return (
    <span>
      {Math.round(val)}
      {suffix}
    </span>
  );
}

function LeafConfetti() {
  const colors = ["#2e5e3a", "#a8553c", "#1c3f27", "#7fae6a"];
  const leaves = Array.from({ length: 16 });
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-0 overflow-visible" aria-hidden>
      {leaves.map((_, i) => {
        const left = (i * 61) % 100;
        const delay = (i % 6) * 0.05;
        const rot = (i * 47) % 360;
        const drift = ((i % 5) - 2) * 14;
        return (
          <motion.span
            key={i}
            initial={{ y: -10, x: 0, opacity: 0, rotate: rot }}
            animate={{ y: 360, x: drift, opacity: [0, 1, 1, 0], rotate: rot + 200 }}
            transition={{ duration: 1.7, delay, ease: "easeIn" }}
            className="absolute h-2.5 w-2.5"
            style={{
              left: `${left}%`,
              background: colors[i % colors.length],
              borderRadius: "0 100% 0 100%",
            }}
          />
        );
      })}
    </div>
  );
}
