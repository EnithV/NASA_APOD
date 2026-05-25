/**
 * Objeto de traducciones para ES y EN.
 * Todas las claves se utilizan mediante la función t(key).
 */
const I18N = {
  es: {
    metaDescription:
      "Explora la Astronomy Picture of the Day de la NASA. Elige una fecha, guarda favoritos y descubre el cosmos.",
    pageTitle: "NASA APOD | Imagen astronómica del día",
    openApi: "API abierta",
    heroEyebrow: "Imagen astronómica del día",
    heroTitle: "Explora el universo,<br class=\"d-none d-sm-inline\"> un día a la vez",
    heroLead:
      "Imágenes y videos astronómicos seleccionados por la NASA. Elige cualquier fecha hasta hoy y guarda tus favoritos.",
    dateLabel: "Fecha de exploración",
    btnToday: "Hoy",
    btnPrevious: "Día anterior",
    btnNext: "Día siguiente",
    loading: "Conectando con la NASA...",
    errorTitle: "No hay datos para esta fecha",
    errorHint: "Prueba con otra fecha o vuelve a intentar más tarde.",
    errorDateBeforeApod: "El archivo APOD comienza el 16 de junio de 1995.",
    loadingApod: "Consultando archivos de la NASA...",
    favoritesTitle: "Mis favoritos",
    favoritesSubtitle: "Tus APOD guardados en este navegador",
    savedCount: "{n} guardado",
    savedCountPlural: "{n} guardados",
    emptyFavorites: "Aún no tienes favoritos.<br>Guarda un APOD que te inspire.",
    viewApod: "Ver APOD",
    removeFavorite: "Eliminar",
    badgeVideo: "Video",
    badgeImage: "Imagen",
    saveFavorite: "Guardar en favoritos",
    savedFavorite: "Guardado en favoritos",
    viewHD: "Ver imagen en HD",
    toastFuture: "No se pueden seleccionar fechas futuras.",
    toastSaved: "APOD guardado en tus favoritos.",
    toastDuplicate: "Este APOD ya está en favoritos.",
    toastRemoved: "Favorito eliminado.",
    toastErrorDate: "Fecha fuera del rango permitido (desde 1995-06-16).",
    footerAuthor: "Gicela Vargas · Generation Colombia",
    close: "Cerrar",
  },
  en: {
    metaDescription:
      "Explore NASA's Astronomy Picture of the Day. Pick a date, save favorites, and discover the cosmos.",
    pageTitle: "NASA APOD | Astronomy Picture of the Day",
    openApi: "Open API",
    heroEyebrow: "Astronomy Picture of the Day",
    heroTitle: "Explore the universe,<br class=\"d-none d-sm-inline\"> one day at a time",
    heroLead:
      "Astronomy images and videos curated by NASA. Pick any date up to today and save your favorites.",
    dateLabel: "Exploration date",
    btnToday: "Today",
    btnPrevious: "Previous day",
    btnNext: "Next day",
    loading: "Connecting to NASA...",
    errorTitle: "No data for this date",
    errorHint: "Try another date or come back later.",
    errorDateBeforeApod: "APOD archive starts on June 16, 1995.",
    loadingApod: "Fetching NASA archives...",
    favoritesTitle: "My favorites",
    favoritesSubtitle: "Your saved APODs in this browser",
    savedCount: "{n} saved",
    savedCountPlural: "{n} saved",
    emptyFavorites: "No favorites yet.<br>Save an APOD that inspires you.",
    viewApod: "View APOD",
    removeFavorite: "Remove",
    badgeVideo: "Video",
    badgeImage: "Image",
    saveFavorite: "Save to favorites",
    savedFavorite: "Saved to favorites",
    viewHD: "View HD image",
    toastFuture: "Future dates cannot be selected.",
    toastSaved: "APOD saved to your favorites.",
    toastDuplicate: "This APOD is already in favorites.",
    toastRemoved: "Favorite removed.",
    toastErrorDate: "Date out of range (starts 1995-06-16).",
    footerAuthor: "Gicela Vargas · Generation Colombia",
    close: "Close",
  },
};

/**
 * Idioma actual. Se recupera de localStorage o del navegador.
 */
let currentLang = localStorage.getItem("nasa-lang") || (navigator.language.startsWith("es") ? "es" : "en");

/**
 * Traduce una clave. Si no existe, devuelve la clave en inglés o la propia clave.
 * @param {string} key - Clave de traducción.
 * @returns {string} Texto traducido.
 */
function t(key) {
  return I18N[currentLang][key] ?? I18N.en[key] ?? key;
}

/**
 * Formatea el contador de favoritos según el número.
 * @param {number} n - Cantidad de favoritos.
 * @returns {string} Texto con el número insertado.
 */
function formatSavedCount(n) {
  const tpl = n === 1 ? t("savedCount") : t("savedCountPlural");
  return tpl.replace("{n}", n);
}

/**
 * Aplica las traducciones al DOM.
 * Actualiza atributos data-i18n, data-i18n-html, meta description, título y aria labels.
 */
function applyPageTranslations() {
  document.documentElement.lang = currentLang;

  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = t("metaDescription");
  document.title = t("pageTitle");

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const value = t(key);
    if (el.hasAttribute("data-i18n-html")) {
      el.innerHTML = value;
    } else {
      el.textContent = value;
    }
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
  });

  document.querySelectorAll(".lang-pill").forEach((btn) => {
    const lang = btn.getAttribute("data-lang");
    btn.classList.toggle("active", lang === currentLang);
    btn.setAttribute("aria-current", lang === currentLang ? "true" : "false");
  });
}

/**
 * Cambia el idioma de la aplicación.
 * @param {string} lang - Código de idioma ('es' o 'en').
 */
function setLanguage(lang) {
  if (!I18N[lang]) return;
  currentLang = lang;
  localStorage.setItem("nasa-lang", lang);
  applyPageTranslations();
  if (typeof window.onLanguageChange === "function") {
    window.onLanguageChange();
  }
}

/**
 * Inicializa los botones de cambio de idioma y aplica las traducciones.
 */
function initLanguageSwitcher() {
  document.querySelectorAll(".lang-pill").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      setLanguage(btn.getAttribute("data-lang"));
    });
  });
  applyPageTranslations();
}