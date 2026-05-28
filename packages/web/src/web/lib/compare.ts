// Compare store — max 2 pairs, reactive via custom event

const EVENT = "pairlo-compare-change";
let compareList: string[] = [];

export function getCompare(): string[] { return [...compareList]; }

export function toggleCompare(id: string): { added: boolean; maxed: boolean } {
  const idx = compareList.indexOf(id);
  if (idx !== -1) {
    compareList = compareList.filter((x) => x !== id);
    window.dispatchEvent(new CustomEvent(EVENT));
    return { added: false, maxed: false };
  }
  if (compareList.length >= 2) return { added: false, maxed: true };
  compareList = [...compareList, id];
  window.dispatchEvent(new CustomEvent(EVENT));
  return { added: true, maxed: false };
}

export function clearCompare() {
  compareList = [];
  window.dispatchEvent(new CustomEvent(EVENT));
}

export const COMPARE_EVENT = EVENT;
