// Non-custodial payment links — we never touch the money; these just pre-fill
// the buyer's own wallet app. (Partiful "Chip In" model.)

export type Handles = { venmo?: string; cashapp?: string; paypal?: string };

function amt(amount: number): string {
  return amount > 0 ? amount.toFixed(2) : "";
}

/** Mobile deep-link: opens the Venmo app with recipient + amount + note pre-filled. */
export function venmoDeepLink(handle: string, amount: number, note: string): string {
  const a = amount > 0 ? `&amount=${amt(amount)}` : "";
  return `venmo://paycharge?txn=pay&recipients=${encodeURIComponent(
    handle,
  )}${a}&note=${encodeURIComponent(note)}`;
}

/** Web fallback (desktop / no app) — also the QR target. */
export function venmoWebLink(handle: string, amount: number, note: string): string {
  const p = new URLSearchParams({ txn: "pay" });
  if (amount > 0) p.set("amount", amt(amount));
  p.set("note", note);
  return `https://venmo.com/${encodeURIComponent(handle)}?${p.toString()}`;
}

export function cashAppLink(handle: string, amount: number): string {
  const tag = handle.replace(/^\$/, "");
  return amount > 0 ? `https://cash.app/$${tag}/${amt(amount)}` : `https://cash.app/$${tag}`;
}

export function paypalLink(handle: string, amount: number): string {
  return amount > 0 ? `https://paypal.me/${handle}/${amt(amount)}` : `https://paypal.me/${handle}`;
}

export type PayMethod = "venmo" | "cashapp" | "paypal";

export const PAY_METHOD_LABEL: Record<PayMethod, string> = {
  venmo: "Venmo",
  cashapp: "Cash App",
  paypal: "PayPal",
};
