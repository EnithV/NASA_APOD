# NASA APOD — Astronomy Picture of the Day

**Repository:** [github.com/EnithV/NASA_APOD](https://github.com/EnithV/NASA_APOD)  
**Live site:** https://enithv.github.io/NASA_APOD/

Web explorer for NASA's **Astronomy Picture of the Day (APOD)**: pick a date, view the image or video, read the scientific explanation, and save favorites in your browser. **Bilingual UI (English / Spanish).**

📄 [Versión en español — README.es.md](./README.es.md)

---

## Features

- Browse APOD by **date** (today by default).
- **Future dates** are blocked.
- Supports **image** and **video** content.
- **Favorites** in `localStorage` with thumbnails and quick access.
- Visual indicator when the current APOD is already saved.
- **EN / ES** language switcher (preference stored in the browser).
- Responsive layout with a modern space-themed dark UI (Bootstrap 5).

---

## Tech stack

- HTML5, CSS3, vanilla JavaScript
- [Bootstrap 5.3](https://getbootstrap.com/)
- [Font Awesome 6](https://fontawesome.com/)
- [NASA Open APIs — APOD](https://api.nasa.gov/)

---

## Project structure

```
NASA/
├── index.html    # Layout, language switcher, date picker
├── i18n.js       # EN / ES translations
├── app.js        # APOD logic, favorites, NASA API
├── style.css     # Space theme styles
├── README.md     # English (this file)
└── README.es.md  # Spanish
```

---

## Requirements

1. Free NASA API key: [api.nasa.gov](https://api.nasa.gov/) → *Generate API Key*.
2. Replace the key in `app.js` (`api_key` in the `cargarImagen` URL).

```js
const url = `https://api.nasa.gov/planetary/apod?api_key=YOUR_API_KEY&date=${fechaElegida}`;
```

> Do not commit API keys to public repositories. Use environment variables or a local ignored file for production.

---

## Local preview

```bash
cd NASA
npx serve .
```

Open the URL shown (e.g. `http://localhost:3000`). Internet connection required for the NASA API.

---

## Usage

1. On load, today's APOD is shown.
2. Change the date with the picker to explore other days.
3. Click **Today** to jump back to the current date.
4. Use **EN / ES** in the navbar to switch language.
5. Click **Save to favorites** to store the current APOD.
6. In **My favorites**, click **View APOD** to open a saved entry.

Favorites are stored under `NASA-favoritos` in `localStorage`.

---

## GitHub Pages

1. Push to [EnithV/NASA_APOD](https://github.com/EnithV/NASA_APOD).
2. **Settings → Pages →** branch `main`, folder `/ (root)`.
3. Site URL: https://enithv.github.io/NASA_APOD/

---

## Author

**Gicela Vargas** — [Portfolio](https://enithv.github.io/portfolio-website/) · [GitHub](https://github.com/EnithV)

Generation Colombia · Full-Stack Java Developer.
