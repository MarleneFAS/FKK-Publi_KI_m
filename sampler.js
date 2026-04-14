// sampler.js – Zufallsauswahl-Logik für den Improv Theater Trainer

/**
 * Wählt n eindeutige, zufällige Einträge aus einem Array.
 * @param {string[]} items  - Alle verfügbaren Vorgaben der Kategorie
 * @param {number}   n      - Anzahl der gewünschten Vorgaben (Standard: 5)
 * @returns {{ picks: string[], warning: string|null }}
 *   picks:   Die ausgewählten Vorgaben (max. items.length, wenn items.length < n)
 *   warning: Hinweistext wenn items.length < n, sonst null
 */
export function pickRandom(items, n = 5) {
  if (!Array.isArray(items) || items.length === 0) {
    return { picks: [], warning: "Keine Einträge verfügbar." };
  }

  if (items.length < n) {
    return {
      picks: [...items],
      warning: `Nur ${items.length} Einträge verfügbar – alle werden angezeigt.`
    };
  }

  // Fisher-Yates-Shuffle auf einer Kopie, dann die ersten n nehmen
  const pool = [...items];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return { picks: pool.slice(0, n), warning: null };
}
