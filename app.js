/**
 * NASA APOD — main application logic.
 * Loads Astronomy Picture of the Day data, date navigation,
 * favorites (add/remove), and toast notifications.
 */

/* -------------------------------------------------------------------------- */
/*  DOM references                                                          */
/* -------------------------------------------------------------------------- */
const imagenDia = document.getElementById("img-dia");
const fechaInput = document.getElementById("fecha-nasa");
const btnHoy = document.getElementById("btn-hoy");
const btnAnterior = document.getElementById("btn-anterior");
const btnSiguiente = document.getElementById("btn-siguiente");
const listaFavoritos = document.getElementById("listaFavoritos");
const favoritosCount = document.getElementById("favoritos-count");

/* -------------------------------------------------------------------------- */
/*  Constants and global state                                                */
/* -------------------------------------------------------------------------- */
const hoy = new Date().toISOString().split("T")[0];
const FECHA_MINIMA = "1995-06-16"; // APOD archive start date

fechaInput.value = hoy;
fechaInput.max = hoy;
fechaInput.min = FECHA_MINIMA;

let datosActuales = {};      // Current APOD payload shown in the main panel
let toastInstance = null;    // Bootstrap toast instance

/* -------------------------------------------------------------------------- */
/*  Toast initialization                                                    */
/* -------------------------------------------------------------------------- */
function initToast() {
  const el = document.getElementById("toast-nasa");
  if (el && window.bootstrap) {
    toastInstance = bootstrap.Toast.getOrCreateInstance(el, { delay: 3200 });
  }
}

/**
 * Displays a toast notification.
 * @param {string} message - Message text.
 * @param {string} [type="info"] - Type: 'success', 'warning', 'danger', 'info'.
 */
function showToast(message, type = "info") {
  const body = document.getElementById("toast-nasa-body");
  if (!body) return;
  const icons = {
    success: "fa-circle-check text-success",
    warning: "fa-triangle-exclamation text-warning",
    danger: "fa-circle-xmark text-danger",
    info: "fa-circle-info text-info",
  };
  body.innerHTML = `<i class="fa-solid ${icons[type] || icons.info} me-2"></i>${message}`;
  toastInstance?.show();
}

/* -------------------------------------------------------------------------- */
/*  Utilities                                                               */
/* -------------------------------------------------------------------------- */
/**
 * Escapes text for safe HTML insertion.
 * @param {string} text - Raw text.
 * @returns {string} Escaped HTML string.
 */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text ?? "";
  return div.innerHTML;
}

/* -------------------------------------------------------------------------- */
/*  Main panel state rendering                                              */
/* -------------------------------------------------------------------------- */
function renderLoading() {
  imagenDia.innerHTML = `
    <div class="apod-loading text-center">
      <div class="spinner-border text-info" role="status" style="width: 3rem; height: 3rem;"></div>
      <p class="mt-3 text-secondary mb-0">${t("loadingApod")}</p>
    </div>
  `;
}

/**
 * Renders an error state; supports the pre-1995 archive edge case.
 * @param {boolean} [isBeforeMin=false] - True when the date is before the archive minimum.
 */
function renderError(isBeforeMin = false) {
  const errorTitle = isBeforeMin ? t("errorDateBeforeApod") : t("errorTitle");
  const errorHint = isBeforeMin ? "" : t("errorHint");
  imagenDia.innerHTML = `
    <div class="apod-error">
      <div class="alert text-center mb-0">
        <i class="fa-solid fa-cloud-moon fa-2x mb-3 d-block opacity-75"></i>
        <p class="mb-1 fw-semibold">${errorTitle}</p>
        <p class="small mb-0 opacity-75">${errorHint}</p>
      </div>
    </div>
  `;
}

/* -------------------------------------------------------------------------- */
/*  APOD API fetch                                                          */
/* -------------------------------------------------------------------------- */
/**
 * Loads APOD content for the given date.
 * @param {string} fechaElegida - Date in YYYY-MM-DD format.
 */
function cargarImagen(fechaElegida) {
  // Reject dates before the archive minimum before calling the API
  if (fechaElegida < FECHA_MINIMA) {
    renderError(true);
    fechaInput.value = fechaElegida;
    return;
  }

  renderLoading();
  fechaInput.value = fechaElegida;

  const url = `https://api.nasa.gov/planetary/apod?api_key=7sMKZ1HGTEiMjM3rDyFlY1B6xlGvO7f0p3on41hu&date=${fechaElegida}`;

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error("Error al cargar");
      return res.json();
    })
    .then((datos) => mostrarDatos(datos))
    .catch(() => {
      // Expected failure when the date predates the APOD archive
      if (fechaElegida < FECHA_MINIMA) {
        renderError(true);
      } else {
        renderError();
      }
    });
}

/* -------------------------------------------------------------------------- */
/*  Render APOD in the main panel                                           */
/* -------------------------------------------------------------------------- */
/**
 * Builds the APOD panel (media, metadata, favorite button).
 * @param {object} datos - APOD API response object.
 */
function mostrarDatos(datos) {
  datosActuales = datos;

  const esVideo = datos.media_type === "video";
  const mediaHtml = esVideo
    ? `<video src="${escapeHtml(datos.url)}" controls class="w-100 h-100"></video>`
    : `<img src="${escapeHtml(datos.url)}" alt="${escapeHtml(datos.title)}" loading="lazy">`;

  // HD image link when provided by the API
  const hdLinkHtml = (!esVideo && datos.hdurl)
    ? `<a href="${escapeHtml(datos.hdurl)}" target="_blank" rel="noopener" class="apod-hd-link">
         <i class="fa-solid fa-maximize me-1"></i>${t("viewHD")}
       </a>`
    : "";

  const favoritosGuardados = JSON.parse(localStorage.getItem("NASA-favoritos")) || [];
  const yaEsta = favoritosGuardados.some((f) => f.date === datos.date);

  const badgeMedia = esVideo
    ? `<span class="apod-badge badge-video"><i class="fa-solid fa-video me-1"></i>${t("badgeVideo")}</span>`
    : `<span class="apod-badge badge-image"><i class="fa-regular fa-image me-1"></i>${t("badgeImage")}</span>`;

  imagenDia.innerHTML = `
    <div class="apod-media-wrap">${mediaHtml}</div>
    <div class="apod-body">
      <div class="apod-meta">
        ${badgeMedia}
        <span class="apod-badge badge-date"><i class="fa-regular fa-calendar me-1"></i>${escapeHtml(datos.date)}</span>
      </div>
      ${hdLinkHtml}
      <h2 class="apod-title">${escapeHtml(datos.title)}</h2>
      <p class="apod-explanation">${escapeHtml(datos.explanation)}</p>
      <button type="button" id="botonFavorito" class="btn btn-favorite w-100 ${yaEsta ? "btn-favorite-saved" : "btn-favorite-add"}">
        <i class="fa-${yaEsta ? "solid fa-heart" : "regular fa-heart"} me-2"></i>
        ${yaEsta ? t("savedFavorite") : t("saveFavorite")}
      </button>
    </div>
  `;

  // Favorite toggle handler
  document.getElementById("botonFavorito")?.addEventListener("click", toggleFavorito);
}

/* -------------------------------------------------------------------------- */
/*  Favorites (add / remove)                                                  */
/* -------------------------------------------------------------------------- */
/**
 * Toggles favorite state for the current APOD entry.
 */
function toggleFavorito() {
  const favoritos = JSON.parse(localStorage.getItem("NASA-favoritos")) || [];
  const index = favoritos.findIndex(f => f.date === datosActuales.date);

  if (index === -1) {
    // Add to favorites
    favoritos.push(datosActuales);
    localStorage.setItem("NASA-favoritos", JSON.stringify(favoritos));
    showToast(t("toastSaved"), "success");
  } else {
    // Remove from favorites
    favoritos.splice(index, 1);
    localStorage.setItem("NASA-favoritos", JSON.stringify(favoritos));
    showToast(t("toastRemoved"), "info");
  }

  // Refresh main panel and favorites grid
  mostrarDatos(datosActuales);
  mostrarListaFavoritos();
}

/**
 * Removes a favorite by list index.
 * @param {number} index - Index in the favorites array.
 */
function eliminarFavorito(index) {
  const favoritos = JSON.parse(localStorage.getItem("NASA-favoritos")) || [];
  if (index >= 0 && index < favoritos.length) {
    favoritos.splice(index, 1);
    localStorage.setItem("NASA-favoritos", JSON.stringify(favoritos));
    showToast(t("toastRemoved"), "info");
    mostrarListaFavoritos();

    // Sync favorite button if the visible APOD was removed
    if (datosActuales.date === favoritos[index]?.date) {
      mostrarDatos(datosActuales);
    }
  }
}

/**
 * Updates the favorites counter in the UI.
 */
function updateFavoritosCount() {
  const favoritos = JSON.parse(localStorage.getItem("NASA-favoritos")) || [];
  if (favoritosCount) {
    favoritosCount.textContent = formatSavedCount(favoritos.length);
  }
}

/**
 * Renders the favorites card grid.
 */
function mostrarListaFavoritos() {
  const favoritos = JSON.parse(localStorage.getItem("NASA-favoritos")) || [];
  updateFavoritosCount();

  if (favoritos.length === 0) {
    listaFavoritos.innerHTML = `
      <div class="col-12">
        <div class="empty-favorites">
          <i class="fa-regular fa-heart d-block"></i>
          <p class="mb-0">${t("emptyFavorites")}</p>
        </div>
      </div>
    `;
    return;
  }

  listaFavoritos.innerHTML = "";

  favoritos.forEach((fav, i) => {
    const col = document.createElement("div");
    col.className = "col-sm-6 col-lg-4";

    const miniatura =
      fav.media_type === "video"
        ? `<div class="video-placeholder"><i class="fa-solid fa-play fa-2x"></i></div>`
        : `<img src="${escapeHtml(fav.url)}" alt="${escapeHtml(fav.title)}" loading="lazy">`;

    col.innerHTML = `
      <article class="favorito-card">
        <div class="favorito-thumb">${miniatura}</div>
        <div class="favorito-body">
          <h3 class="favorito-title">${escapeHtml(fav.title)}</h3>
          <p class="favorito-date"><i class="fa-regular fa-calendar me-1"></i>${escapeHtml(fav.date)}</p>
          <div class="d-flex gap-2 mt-auto">
            <button type="button" class="btn btn-view-fav flex-grow-1" data-fav-index="${i}">
              <i class="fa-solid fa-arrow-up-right-from-square me-1"></i> ${t("viewApod")}
            </button>
            <button type="button" class="btn btn-delete-fav" data-fav-index="${i}" title="${t("removeFavorite")}">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      </article>
    `;

    // Open favorite in main panel
    col.querySelector(".btn-view-fav").addEventListener("click", (e) => {
      const idx = parseInt(e.currentTarget.dataset.favIndex);
      cargarFecha(idx);
    });

    // Delete favorite from list
    col.querySelector(".btn-delete-fav").addEventListener("click", (e) => {
      e.stopPropagation();
      const idx = parseInt(e.currentTarget.dataset.favIndex);
      eliminarFavorito(idx);
    });

    listaFavoritos.appendChild(col);
  });
}

/**
 * Loads a favorite into the main panel and scrolls to top.
 * @param {number} favoritoIndex - Index in the favorites array.
 */
function cargarFecha(favoritoIndex) {
  const favoritos = JSON.parse(localStorage.getItem("NASA-favoritos")) || [];
  const datos = favoritos[favoritoIndex];
  if (!datos) return;
  mostrarDatos(datos);
  fechaInput.value = datos.date;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* -------------------------------------------------------------------------- */
/*  Date navigation                                                         */
/* -------------------------------------------------------------------------- */
/**
 * Shifts the date input by the given number of days.
 * @param {number} dias - Day offset (negative = previous day).
 */
function cambiarDia(dias) {
  if (!fechaInput.value) return;
  const fechaActual = new Date(fechaInput.value + "T12:00:00"); // noon UTC avoids DST edge cases
  fechaActual.setDate(fechaActual.getDate() + dias);
  const nuevaFecha = fechaActual.toISOString().split("T")[0];

  if (nuevaFecha > hoy) {
    showToast(t("toastFuture"), "warning");
    return;
  }
  if (nuevaFecha < FECHA_MINIMA) {
    showToast(t("toastErrorDate"), "warning");
    return;
  }

  fechaInput.value = nuevaFecha;
  cargarImagen(nuevaFecha);
}

// Date control listeners
fechaInput.addEventListener("change", () => {
  const fechaElegida = fechaInput.value;
  if (fechaElegida > hoy) {
    showToast(t("toastFuture"), "warning");
    fechaInput.value = hoy;
    return;
  }
  if (fechaElegida < FECHA_MINIMA) {
    showToast(t("toastErrorDate"), "warning");
    fechaInput.value = FECHA_MINIMA;
    cargarImagen(FECHA_MINIMA);
    return;
  }
  cargarImagen(fechaElegida);
});

btnHoy?.addEventListener("click", () => {
  fechaInput.value = hoy;
  cargarImagen(hoy);
});

btnAnterior?.addEventListener("click", () => cambiarDia(-1));
btnSiguiente?.addEventListener("click", () => cambiarDia(1));

/* -------------------------------------------------------------------------- */
/*  Language change hook (called from i18n.js)                              */
/* -------------------------------------------------------------------------- */
/**
 * Re-renders UI strings after a locale switch.
 */
window.onLanguageChange = () => {
  if (datosActuales?.date) {
    mostrarDatos(datosActuales);
  } else if (imagenDia.querySelector(".apod-loading")) {
    renderLoading();
  } else if (imagenDia.querySelector(".apod-error")) {
    // Re-render error state with updated translations
    const fechaActual = fechaInput.value;
    if (fechaActual < FECHA_MINIMA) {
      renderError(true);
    } else {
      renderError();
    }
  }
  mostrarListaFavoritos();
};

/* -------------------------------------------------------------------------- */
/*  Bootstrap on load                                                       */
/* -------------------------------------------------------------------------- */
initLanguageSwitcher();
initToast();
cargarImagen(hoy);
mostrarListaFavoritos();