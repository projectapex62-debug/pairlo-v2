// Wishlist stored in localStorage — reactive via custom event

const KEY = "pairlo-wishlist";
const EVENT = "pairlo-wishlist-change";

export function getWishlist(): string[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function toggleWishlist(id: string): boolean {
  const list = getWishlist();
  const idx = list.indexOf(id);
  const next = idx === -1 ? [...list, id] : list.filter((x) => x !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(EVENT));
  return idx === -1; // true = added
}

export function removeFromWishlist(id: string): void {
  const next = getWishlist().filter((x) => x !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function isWishlisted(id: string): boolean {
  return getWishlist().includes(id);
}

export function useWishlistCount() {
  // returns count; components subscribe via the custom event
  return getWishlist().length;
}
