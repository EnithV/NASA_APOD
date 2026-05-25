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
    loading: "Conectando con la NASA...",
    errorTitle: "No hay datos para esta fecha",
    errorHint: "Prueba con otra fecha o vuelve a intentar más tarde.",
    loadingApod: "Consultando archivos de la NASA...",
    favoritesTitle: "Mis favoritos",
    favoritesSubtitle: "Tus APOD guardados en este navegador",
    savedCount: "{n} guardado",
    savedCountPlural: "{n} guardados",
    emptyFavorites: "Aún no tienes favoritos.<br>Guarda un APOD que te inspire.",
    viewApod: "Ver APOD",
    badgeVideo: "Video",
    badgeImage: "Imagen",
    saveFavorite: "Guardar en favoritos",
    savedFavorite: "Guardado en favoritos",
    toastFuture: "No se pueden seleccionar fechas futuras.",
    toastSaved: "APOD guardado en tus favoritos.",
    toastDuplicate: "Este APOD ya está en favoritos.",
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
    loading: "Connecting to NASA...",
    errorTitle: "No data for this date",
    errorHint: "Try another date or come back later.",
    loadingApod: "Fetching NASA archives...",
    favoritesTitle: "My favorites",
    favoritesSubtitle: "Your saved APODs in this browser",
    savedCount: "{n} saved",
    savedCountPlural: "{n} saved",
    emptyFavorites: "No favorites yet.<br>Save an APOD that inspires you.",
    viewApod: "View APOD",
    badgeVideo: "Video",
    badgeImage: "Image",
    saveFavorite: "Save to favorites",
    savedFavorite: "Saved to favorites",
    toastFuture: "Future dates cannot be selected.",
    toastSaved: "APOD saved to your favorites.",
    toastDuplicate: "This APOD is already in favorites.",
    footerAuthor: "Gicela Vargas · Generation Colombia",
    close: "Close",
  },
};

let currentLang = localStorage.getItem("nasa-lang") || (navigator.language.startsWith("es") ? "es" : "en");

function t(key) {
  return I18N[currentLang][key] ?? I18N.en[key] ?? key;
}

function formatSavedCount(n) {
  const tpl = n === 1 ? t("savedCount") : t("savedCountPlural");
  return tpl.replace("{n}", n);
}

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

function setLanguage(lang) {
  if (!I18N[lang]) return;
  currentLang = lang;
  localStorage.setItem("nasa-lang", lang);
  applyPageTranslations();
  if (typeof window.onLanguageChange === "function") {
    window.onLanguageChange();
  }
}

function initLanguageSwitcher() {
  document.querySelectorAll(".lang-pill").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      setLanguage(btn.getAttribute("data-lang"));
    });
  });
  applyPageTranslations();
}
