const imagenDia = document.getElementById("img-dia");
const fecha = document.getElementById("fecha-nasa");
const btnHoy = document.getElementById("btn-hoy");
const listaFavoritos = document.getElementById("listaFavoritos");
const favoritosCount = document.getElementById("favoritos-count");

const hoy = new Date().toISOString().split("T")[0];
fecha.value = hoy;
fecha.max = hoy;

let datosActuales = {};
let toastInstance = null;

function initToast() {
  const el = document.getElementById("toast-nasa");
  if (el && window.bootstrap) {
    toastInstance = bootstrap.Toast.getOrCreateInstance(el, { delay: 3200 });
  }
}

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

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text ?? "";
  return div.innerHTML;
}

function renderLoading() {
  imagenDia.innerHTML = `
    <div class="apod-loading text-center">
      <div class="spinner-border text-info" role="status" style="width: 3rem; height: 3rem;"></div>
      <p class="mt-3 text-secondary mb-0">${t("loadingApod")}</p>
    </div>
  `;
}

function renderError() {
  imagenDia.innerHTML = `
    <div class="apod-error">
      <div class="alert text-center mb-0">
        <i class="fa-solid fa-cloud-moon fa-2x mb-3 d-block opacity-75"></i>
        <p class="mb-1 fw-semibold">${t("errorTitle")}</p>
        <p class="small mb-0 opacity-75">${t("errorHint")}</p>
      </div>
    </div>
  `;
}

function cargarImagen(fechaElegida) {
  renderLoading();
  fecha.value = fechaElegida;

  const url = `https://api.nasa.gov/planetary/apod?api_key=7sMKZ1HGTEiMjM3rDyFlY1B6xlGvO7f0p3on41hu&date=${fechaElegida}`;

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error("Error al cargar");
      return res.json();
    })
    .then((datos) => mostrarDatos(datos))
    .catch(() => renderError());
}

function updateFavoritosCount() {
  const favoritos = JSON.parse(localStorage.getItem("NASA-favoritos")) || [];
  if (favoritosCount) {
    favoritosCount.textContent = formatSavedCount(favoritos.length);
  }
}

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
          <button type="button" class="btn btn-view-fav w-100" data-fav-index="${i}">
            <i class="fa-solid fa-arrow-up-right-from-square me-1"></i> ${t("viewApod")}
          </button>
        </div>
      </article>
    `;

    col.querySelector("button").addEventListener("click", () => cargarFecha(i));
    listaFavoritos.appendChild(col);
  });
}

function cargarFecha(favoritoIndex) {
  const favoritos = JSON.parse(localStorage.getItem("NASA-favoritos")) || [];
  const datos = favoritos[favoritoIndex];
  if (!datos) return;
  mostrarDatos(datos);
  fecha.value = datos.date;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

fecha.addEventListener("change", () => {
  const fechaElegida = fecha.value;
  if (fechaElegida > hoy) {
    showToast(t("toastFuture"), "warning");
    fecha.value = hoy;
    return;
  }
  cargarImagen(fechaElegida);
});

btnHoy?.addEventListener("click", () => {
  fecha.value = hoy;
  cargarImagen(hoy);
});

function mostrarDatos(datos) {
  datosActuales = datos;

  const esVideo = datos.media_type === "video";
  const mediaHtml = esVideo
    ? `<video src="${escapeHtml(datos.url)}" controls class="w-100 h-100"></video>`
    : `<img src="${escapeHtml(datos.url)}" alt="${escapeHtml(datos.title)}">`;

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
      <h2 class="apod-title">${escapeHtml(datos.title)}</h2>
      <p class="apod-explanation">${escapeHtml(datos.explanation)}</p>
      <button type="button" id="botonFavorito" class="btn btn-favorite w-100 ${yaEsta ? "btn-favorite-saved" : "btn-favorite-add"}">
        <i class="fa-${yaEsta ? "solid fa-heart" : "regular fa-heart"} me-2"></i>
        ${yaEsta ? t("savedFavorite") : t("saveFavorite")}
      </button>
    </div>
  `;

  document.getElementById("botonFavorito")?.addEventListener("click", () => {
    const favoritos = JSON.parse(localStorage.getItem("NASA-favoritos")) || [];
    const repetido = favoritos.some((f) => f.date === datosActuales.date);

    if (!repetido) {
      favoritos.push(datosActuales);
      localStorage.setItem("NASA-favoritos", JSON.stringify(favoritos));
      showToast(t("toastSaved"), "success");
      mostrarDatos(datosActuales);
      mostrarListaFavoritos();
    } else {
      showToast(t("toastDuplicate"), "warning");
    }
  });
}

window.onLanguageChange = () => {
  if (datosActuales?.date) {
    mostrarDatos(datosActuales);
  } else if (imagenDia.querySelector(".apod-loading")) {
    renderLoading();
  } else if (imagenDia.querySelector(".apod-error")) {
    renderError();
  }
  mostrarListaFavoritos();
};

initLanguageSwitcher();
initToast();
cargarImagen(hoy);
mostrarListaFavoritos();
