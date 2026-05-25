/**
 * APOD NASA - Lógica principal.
 * Maneja la carga de la imagen astronómica del día, la navegación de fechas,
 * la gestión de favoritos (agregar, eliminar) y las notificaciones.
 */

/* -------------------------------------------------------------------------- */
/*  REFERENCIAS AL DOM                                                        */
/* -------------------------------------------------------------------------- */
const imagenDia = document.getElementById("img-dia");
const fechaInput = document.getElementById("fecha-nasa");
const btnHoy = document.getElementById("btn-hoy");
const btnAnterior = document.getElementById("btn-anterior");
const btnSiguiente = document.getElementById("btn-siguiente");
const listaFavoritos = document.getElementById("listaFavoritos");
const favoritosCount = document.getElementById("favoritos-count");

/* -------------------------------------------------------------------------- */
/*  CONSTANTES Y ESTADO GLOBAL                                                */
/* -------------------------------------------------------------------------- */
const hoy = new Date().toISOString().split("T")[0];
const FECHA_MINIMA = "1995-06-16"; // El archivo APOD comienza en esta fecha

fechaInput.value = hoy;
fechaInput.max = hoy;
fechaInput.min = FECHA_MINIMA;

let datosActuales = {};      // Almacena los datos del APOD que se está mostrando
let toastInstance = null;    // Instancia del toast de Bootstrap

/* -------------------------------------------------------------------------- */
/*  INICIALIZACIÓN DEL TOAST                                                  */
/* -------------------------------------------------------------------------- */
function initToast() {
  const el = document.getElementById("toast-nasa");
  if (el && window.bootstrap) {
    toastInstance = bootstrap.Toast.getOrCreateInstance(el, { delay: 3200 });
  }
}

/**
 * Muestra una notificación toast.
 * @param {string} message - Texto del mensaje.
 * @param {string} [type="info"] - Tipo: 'success', 'warning', 'danger', 'info'.
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
/*  UTILIDADES                                                                */
/* -------------------------------------------------------------------------- */
/**
 * Escapa texto para inserción segura en HTML.
 * @param {string} text - Texto a escapar.
 * @returns {string} Texto escapado.
 */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text ?? "";
  return div.innerHTML;
}

/* -------------------------------------------------------------------------- */
/*  RENDERIZADO DE ESTADOS DEL PANEL PRINCIPAL                                 */
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
 * Muestra un mensaje de error, pudiendo ser específico para fechas anteriores a 1995.
 * @param {boolean} [isBeforeMin=false] - Indica si la fecha es anterior al mínimo.
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
/*  CARGA DE APOD DESDE LA API                                                */
/* -------------------------------------------------------------------------- */
/**
 * Carga la APOD para una fecha determinada.
 * @param {string} fechaElegida - Fecha en formato YYYY-MM-DD.
 */
function cargarImagen(fechaElegida) {
  // Validación extra: si la fecha es anterior al mínimo, mostrar error de inmediato
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
      // Si la fecha es anterior a 1995, el error es esperado
      if (fechaElegida < FECHA_MINIMA) {
        renderError(true);
      } else {
        renderError();
      }
    });
}

/* -------------------------------------------------------------------------- */
/*  MOSTRAR DATOS DEL APOD EN EL PANEL PRINCIPAL                               */
/* -------------------------------------------------------------------------- */
/**
 * Construye el contenido del APOD (imagen/video, metadatos, botón de favorito).
 * @param {object} datos - Objeto JSON de la API de APOD.
 */
function mostrarDatos(datos) {
  datosActuales = datos;

  const esVideo = datos.media_type === "video";
  const mediaHtml = esVideo
    ? `<video src="${escapeHtml(datos.url)}" controls class="w-100 h-100"></video>`
    : `<img src="${escapeHtml(datos.url)}" alt="${escapeHtml(datos.title)}" loading="lazy">`;

  // Enlace a la versión HD de la imagen si está disponible
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

  // Evento para alternar favorito (agregar / eliminar)
  document.getElementById("botonFavorito")?.addEventListener("click", toggleFavorito);
}

/* -------------------------------------------------------------------------- */
/*  GESTIÓN DE FAVORITOS (AGREGAR / ELIMINAR)                                  */
/* -------------------------------------------------------------------------- */
/**
 * Alterna el estado de favorito para el APOD actual.
 * Si ya existe, lo elimina; si no, lo agrega.
 */
function toggleFavorito() {
  const favoritos = JSON.parse(localStorage.getItem("NASA-favoritos")) || [];
  const index = favoritos.findIndex(f => f.date === datosActuales.date);

  if (index === -1) {
    // Agregar
    favoritos.push(datosActuales);
    localStorage.setItem("NASA-favoritos", JSON.stringify(favoritos));
    showToast(t("toastSaved"), "success");
  } else {
    // Eliminar
    favoritos.splice(index, 1);
    localStorage.setItem("NASA-favoritos", JSON.stringify(favoritos));
    showToast(t("toastRemoved"), "info");
  }

  // Reconstruir el panel principal y la lista de favoritos
  mostrarDatos(datosActuales);
  mostrarListaFavoritos();
}

/**
 * Elimina un favorito por su índice en la lista.
 * @param {number} index - Índice en el array de favoritos.
 */
function eliminarFavorito(index) {
  const favoritos = JSON.parse(localStorage.getItem("NASA-favoritos")) || [];
  if (index >= 0 && index < favoritos.length) {
    favoritos.splice(index, 1);
    localStorage.setItem("NASA-favoritos", JSON.stringify(favoritos));
    showToast(t("toastRemoved"), "info");
    mostrarListaFavoritos();

    // Si el APOD mostrado era el eliminado, actualizar su botón de favorito
    if (datosActuales.date === favoritos[index]?.date) {
      mostrarDatos(datosActuales);
    }
  }
}

/**
 * Actualiza el contador de favoritos en la interfaz.
 */
function updateFavoritosCount() {
  const favoritos = JSON.parse(localStorage.getItem("NASA-favoritos")) || [];
  if (favoritosCount) {
    favoritosCount.textContent = formatSavedCount(favoritos.length);
  }
}

/**
 * Construye la cuadrícula de tarjetas de favoritos.
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

    // Evento para ver un favorito
    col.querySelector(".btn-view-fav").addEventListener("click", (e) => {
      const idx = parseInt(e.currentTarget.dataset.favIndex);
      cargarFecha(idx);
    });

    // Evento para eliminar un favorito
    col.querySelector(".btn-delete-fav").addEventListener("click", (e) => {
      e.stopPropagation();
      const idx = parseInt(e.currentTarget.dataset.favIndex);
      eliminarFavorito(idx);
    });

    listaFavoritos.appendChild(col);
  });
}

/**
 * Carga un favorito en el panel principal y desplaza la vista.
 * @param {number} favoritoIndex - Índice en el array de favoritos.
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
/*  NAVEGACIÓN DE FECHAS                                                      */
/* -------------------------------------------------------------------------- */
/**
 * Cambia la fecha en el input sumando o restando días.
 * @param {number} dias - Número de días a desplazar (negativo para anterior).
 */
function cambiarDia(dias) {
  if (!fechaInput.value) return;
  const fechaActual = new Date(fechaInput.value + "T12:00:00"); // mediodía para evitar zona horaria
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

// Eventos de navegación
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
/*  SINCRONIZACIÓN CON CAMBIO DE IDIOMA                                       */
/* -------------------------------------------------------------------------- */
/**
 * Esta función será llamada por i18n.js después de cambiar el idioma.
 * Reconstruye el panel principal y la lista de favoritos con las nuevas traducciones.
 */
window.onLanguageChange = () => {
  if (datosActuales?.date) {
    mostrarDatos(datosActuales);
  } else if (imagenDia.querySelector(".apod-loading")) {
    renderLoading();
  } else if (imagenDia.querySelector(".apod-error")) {
    // En caso de error se vuelve a mostrar con los textos traducidos
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
/*  INICIALIZACIÓN                                                            */
/* -------------------------------------------------------------------------- */
initLanguageSwitcher();
initToast();
cargarImagen(hoy);
mostrarListaFavoritos();