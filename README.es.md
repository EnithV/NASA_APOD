# NASA APOD — Imagen astronómica del día

**Repositorio:** [github.com/EnithV/NASA_APOD](https://github.com/EnithV/NASA_APOD)  
**Sitio en vivo:** https://enithv.github.io/NASA_APOD/

Aplicación web de una sola página para explorar la **Astronomy Picture of the Day (APOD)** de la NASA: consulta por fecha, visualiza imágenes o videos con su explicación, abre la versión HD cuando exista y gestiona favoritos en el navegador. **Interfaz bilingüe (español / inglés).**

📄 [English version — README.md](./README.md)

---

## Características

| Área | Detalle |
|------|---------|
| **Consulta APOD** | Cualquier fecha desde el **16 de junio de 1995** (inicio del archivo) hasta **hoy** |
| **Navegación** | Selector de fecha, botones **día anterior / siguiente** y atajo **Hoy** |
| **Medios** | Imagen o video embebido; enlace **Ver imagen en HD** cuando la API devuelve `hdurl` |
| **Favoritos** | Guardar, quitar (toggle en la tarjeta principal) y eliminar desde la cuadrícula; en `localStorage` |
| **Idioma** | Interfaz completa **ES / EN** desde el navbar; preferencia en `localStorage` (`nasa-lang`) |
| **Experiencia** | Toasts de Bootstrap, estados de carga, validación de rango, imágenes con `loading="lazy"` |
| **Diseño** | Tema espacial oscuro, paneles glassmorphism, tipografías Orbitron y DM Sans |

---

## Tecnologías

- HTML5, CSS3, JavaScript vanilla (ES6+)
- [Bootstrap 5.3](https://getbootstrap.com/)
- [Font Awesome 6](https://fontawesome.com/)
- Google Fonts: Orbitron, DM Sans
- [NASA Open APIs — APOD](https://api.nasa.gov/)

---

## Estructura del proyecto

```
NASA/
├── index.html    # Layout, controles de fecha, sección favoritos, toasts
├── i18n.js       # Cadenas ES / EN y cambio de idioma
├── app.js        # API NASA, navegación por fechas, favoritos, renderizado
├── style.css     # Tema espacial, paneles glass, diseño responsive
├── README.md     # Inglés
└── README.es.md  # Español (este archivo)
```

---

## Requisitos

1. Clave gratuita de la NASA: [api.nasa.gov](https://api.nasa.gov/) → *Generate API Key*.
2. Configura tu clave en `app.js`, dentro de `cargarImagen()`:

```js
const url = `https://api.nasa.gov/planetary/apod?api_key=TU_API_KEY&date=${fechaElegida}`;
```

> No subas claves API a repositorios públicos. En producción, usa variables de entorno o un archivo local en `.gitignore`.

---

## Vista previa local

```bash
cd NASA
npx serve .
```

Abre la URL indicada (ej. `http://localhost:3000`). Se requiere conexión a internet para la API de la NASA.

---

## Uso

1. **Al cargar** — Se obtiene automáticamente el APOD de hoy.
2. **Cambiar fecha** — Usa el input, los botones **← / →** o **Hoy**.
3. **Idioma** — Cambia **ES / EN** en la barra superior; se actualizan textos y mensajes.
4. **Favoritos** — El botón con corazón en la tarjeta principal agrega o quita el APOD actual.
5. **Cuadrícula de favoritos** — **Ver APOD** abre uno guardado; el icono de papelera lo elimina de la lista.
6. **HD** — Si está disponible, **Ver imagen en HD** abre el archivo en alta resolución en otra pestaña.

Los favoritos se guardan con la clave `NASA-favoritos` en `localStorage` (por navegador).

---

## Validación y errores

- **Fechas futuras** — Bloqueadas con toast; el input vuelve a hoy.
- **Antes del 1995-06-16** — Mensaje específico (el archivo APOD aún no existía).
- **Errores de API o red** — Tarjeta de error con sugerencia de probar otra fecha.
- **Favorito duplicado** — Gestionado con toggle (volver a pulsar quita el favorito).

---

## GitHub Pages

1. Sube el código a [EnithV/NASA_APOD](https://github.com/EnithV/NASA_APOD).
2. **Settings → Pages →** rama `main`, carpeta `/ (root)`.
3. URL pública: https://enithv.github.io/NASA_APOD/

---

## Autora

**Gicela Vargas** — [Portfolio](https://enithv.github.io/portfolio-website/) · [GitHub](https://github.com/EnithV)

Generation Colombia · Desarrolladora Full-Stack Java.
