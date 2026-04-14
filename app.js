// app.js – UI-Controller für den Improv Theater Trainer

import { pickRandom } from "./sampler.js";

/** @type {{ activeCategoryId: string|null, lastPicks: string[] }} */
export const state = {
  activeCategoryId: null,
  lastPicks: [],
};

/**
 * Rendert die Ergebnisse einer Zufallsauswahl in die Ergebnisanzeige.
 * @param {object} elements - DOM-Referenzen
 * @param {string} label    - Kategoriename für die Überschrift
 * @param {string[]} picks  - Ausgewählte Vorgaben
 * @param {string|null} warning - Optionaler Hinweistext
 */
export function renderResult(elements, label, picks, warning) {
  const { resultSection, resultHeading, resultList, warningBox, retryBtn } = elements;

  resultHeading.textContent = label;

  resultList.innerHTML = "";
  for (const pick of picks) {
    const li = resultList.ownerDocument.createElement("li");
    li.textContent = pick;
    resultList.appendChild(li);
  }

  if (warning) {
    warningBox.textContent = warning;
    warningBox.removeAttribute("hidden");
  } else {
    warningBox.textContent = "";
    warningBox.setAttribute("hidden", "");
  }

  resultSection.removeAttribute("hidden");
  retryBtn.removeAttribute("hidden");
  setTimeout(() => {
    resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 50);
}

/**
 * Führt eine Zufallsauswahl für die angegebene Kategorie durch und aktualisiert die UI.
 * @param {object} elements    - DOM-Referenzen
 * @param {object} categories  - Alle Kategorien aus data.js
 * @param {string} categoryId  - ID der gewählten Kategorie
 * @returns {boolean} false wenn die Kategorie-ID unbekannt ist
 */
export function selectCategory(elements, categories, categoryId) {
  const category = categories[categoryId];
  if (!category) {
    console.error(`Unbekannte Kategorie-ID: "${categoryId}"`);
    return false;
  }

  const { picks, warning } = pickRandom(category.items);

  state.activeCategoryId = categoryId;
  state.lastPicks = picks;

  renderResult(elements, category.label, picks, warning);
  return true;
}

/**
 * Initialisiert die App: Buttons rendern und Event-Listener registrieren.
 * @param {object} elements   - DOM-Referenzen
 * @param {object} categories - Kategorie-Objekt aus data.js
 */
export function init(elements, categories) {
  const { categoryGrid, retryBtn } = elements;

  for (const [id, category] of Object.entries(categories)) {
    const btn = categoryGrid.ownerDocument.createElement("button");
    btn.type = "button";
    btn.textContent = category.label;
    btn.dataset.categoryId = id;
    btn.addEventListener("click", () => selectCategory(elements, categories, id));
    categoryGrid.appendChild(btn);
  }

  retryBtn.addEventListener("click", () => {
    if (state.activeCategoryId) {
      selectCategory(elements, categories, state.activeCategoryId);
    }
  });
}

// ─── Browser-Einstiegspunkt ───────────────────────────────────────────────────
// Läuft nur wenn das Dokument ein #category-grid enthält (echter Browser-Kontext).
// In Testumgebungen wird document.body leer initialisiert, daher kein Auto-Start.
if (typeof document !== "undefined" && document.getElementById("category-grid")) {
  const elements = {
    categoryGrid:  document.getElementById("category-grid"),
    resultSection: document.getElementById("result-section"),
    resultHeading: document.getElementById("result-heading"),
    resultList:    document.getElementById("result-list"),
    warningBox:    document.getElementById("warning-box"),
    retryBtn:      document.getElementById("retry-btn"),
  };

  try {
    const { categories } = await import("./data.js");
    init(elements, categories);
  } catch {
    elements.categoryGrid.textContent = "Daten konnten nicht geladen werden.";
  }
}
