# NASA APOD — Imagen astronómica del día

**Repositorio:** [github.com/EnithV/NASA_APOD](https://github.com/EnithV/NASA_APOD)  
**Sitio en vivo:** https://enithv.github.io/NASA_APOD/

Explorador web de la **Astronomy Picture of the Day (APOD)** de la NASA: elige una fecha, consulta la imagen o el video, lee la explicación científica y guarda favoritos en el navegador. **Interfaz bilingüe (español / inglés).**

📄 [English version — README.md](./README.md)

---

## Características

- Consulta APOD por **fecha** (por defecto, el día actual).
- Bloqueo de **fechas futuras**.
- Soporte para contenido **imagen** o **video**.
- **Favoritos** en `localStorage` con miniaturas y acceso rápido.
- Indicador visual si el APOD actual ya está guardado.
- Selector de idioma **ES / EN** (preferencia guardada en el navegador).
- Diseño responsive con tema espacial oscuro y Bootstrap 5.

---

## Tecnologías

- HTML5, CSS3, JavaScript (vanilla)
- [Bootstrap 5.3](https://getbootstrap.com/)
- [Font Awesome 6](https://fontawesome.com/)
- [NASA Open APIs — APOD](https://api.nasa.gov/)

---

## Estructura del proyecto

```
NASA/
├── index.html    # Layout, selector de idioma y fecha
├── i18n.js       # Traducciones ES / EN
├── app.js        # Lógica APOD, favoritos y API NASA
├── style.css     # Estilos tema espacial
├── README.md     # Inglés
└── README.es.md  # Español (este archivo)
```

---

## Requisitos

1. Clave gratuita de la NASA: [api.nasa.gov](https://api.nasa.gov/) → *Generate API Key*.
2. Sustituye la clave en `app.js` (parámetro `api_key` en la URL de `cargarImagen`).

```js
const url = `https://api.nasa.gov/planetary/apod?api_key=TU_API_KEY&date=${fechaElegida}`;
```

> No subas claves API a repositorios públicos. Usa variables de entorno o archivos locales ignorados por Git.

---

## Vista previa local

```bash
cd NASA
npx serve .
```

Abre la URL indicada (ej. `http://localhost:3000`). Se requiere conexión a internet para la API de la NASA.

---

## Uso

1. Al cargar la página se muestra el APOD de **hoy**.
2. Cambia la fecha con el selector para explorar otros días.
3. Pulsa **Hoy** para volver a la fecha actual.
4. Usa **ES / EN** en la barra de navegación para cambiar el idioma.
5. Pulsa **Guardar en favoritos** para almacenar el APOD actual.
6. En **Mis favoritos**, usa **Ver APOD** para abrir uno guardado.

Los favoritos se guardan bajo la clave `NASA-favoritos` en `localStorage`.

---

## GitHub Pages

1. Sube el proyecto a [EnithV/NASA_APOD](https://github.com/EnithV/NASA_APOD).
2. **Settings → Pages →** rama `main`, carpeta `/ (root)`.
3. URL del sitio: https://enithv.github.io/NASA_APOD/

---

## Autora

**Gicela Vargas** — [Portfolio](https://enithv.github.io/portfolio-website/) · [GitHub](https://github.com/EnithV)

Generation Colombia · Desarrolladora Full-Stack Java.
