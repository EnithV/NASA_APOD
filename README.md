# NASA APOD — Astronomy Picture of the Day

**Repository:** [github.com/EnithV/NASA_APOD](https://github.com/EnithV/NASA_APOD)  
**Live site:** https://enithv.github.io/NASA_APOD/

Single-page web app to explore NASA's **Astronomy Picture of the Day (APOD)**: browse by date, view images or videos with scientific explanations, open HD versions when available, and manage favorites in the browser. **Bilingual interface (English / Spanish).**

📄 [Versión en español — README.es.md](./README.es.md)

---

## Features

| Area | Details |
|------|---------|
| **APOD browsing** | Load any date from **June 16, 1995** (APOD archive start) through **today** |
| **Navigation** | Date picker, **Previous / Next day** buttons, and **Today** shortcut |
| **Media** | Image or embedded video; optional **View HD image** link when `hdurl` is provided |
| **Favorites** | Save, remove (toggle on main card), and delete from the grid; stored in `localStorage` |
| **i18n** | Full **EN / ES** UI via navbar switcher; preference saved in `localStorage` (`nasa-lang`) |
| **UX** | Bootstrap toasts, loading states, range validation, lazy-loaded images |
| **Design** | Dark space theme, glassmorphism panels, Orbitron + DM Sans typography |

---

## Tech stack

- HTML5, CSS3, vanilla JavaScript (ES6+)
- [Bootstrap 5.3](https://getbootstrap.com/)
- [Font Awesome 6](https://fontawesome.com/)
- Google Fonts: Orbitron, DM Sans
- [NASA Open APIs — APOD](https://api.nasa.gov/)

---

## Project structure

```
NASA/
├── index.html    # Layout, date controls, favorites section, toasts
├── i18n.js       # EN / ES strings and language switcher
├── app.js        # NASA API, date navigation, favorites, rendering
├── style.css     # Space theme, glass panels, responsive layout
├── README.md     # English (this file)
└── README.es.md  # Spanish
```

---

## Requirements

1. Free NASA API key: [api.nasa.gov](https://api.nasa.gov/) → *Generate API Key*.
2. Set your key in `app.js` inside `cargarImagen()`:

```js
const url = `https://api.nasa.gov/planetary/apod?api_key=YOUR_API_KEY&date=${fechaElegida}`;
```

> Do not commit API keys to public repos. For production, use environment variables or a local config file listed in `.gitignore`.

---

## Local preview

```bash
cd NASA
npx serve .
```

Open the URL shown (e.g. `http://localhost:3000`). An internet connection is required for the NASA API.

---

## Usage

1. **On load** — Today's APOD is fetched automatically.
2. **Change date** — Use the date input, **← / →** buttons, or **Today**.
3. **Language** — Switch **EN / ES** in the navbar; all labels and messages update.
4. **Favorites** — Click the heart button on the main card to add or remove the current APOD.
5. **Favorites grid** — **View APOD** opens a saved entry; the trash icon removes it from the list.
6. **HD** — When available, use **View HD image** to open the high-resolution file in a new tab.

Favorites are stored under the key `NASA-favoritos` in `localStorage` (per browser).

---

## Validation and errors

- **Future dates** — Blocked with a toast; input resets to today.
- **Before 1995-06-16** — Specific message (APOD archive did not exist yet).
- **API / network errors** — Friendly error card with retry hint.
- **Duplicate favorite** — Handled via toggle (save again removes the entry).

---

## GitHub Pages

1. Push to [EnithV/NASA_APOD](https://github.com/EnithV/NASA_APOD).
2. **Settings → Pages →** branch `main`, folder `/ (root)`.
3. Public URL: https://enithv.github.io/NASA_APOD/

---

## Author

**Gicela Vargas** — [Portfolio](https://enithv.github.io/portfolio-website/) · [GitHub](https://github.com/EnithV)

Generation Colombia · Full-Stack Java Developer.
