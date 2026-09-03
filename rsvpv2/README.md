# Ummi & Danish — Wedding RSVP

A single-page scrollable wedding invitation built with **Next.js 16** (App
Router) and React 19. Lemon-and-leaf themed, bilingual (English / Bahasa
Melayu), text-only layout (no card containers), hairline section dividers,
animated sliding doors, floating leaf particles, smooth scroll-revealed
sections via [Framer Motion](https://www.framer.com/motion/), and a full
RSVP flow that persists guest responses and wishes to `localStorage`.

## Sections (all on one page)

| Section id | What's there |
| --- | --- |
| (hero)   | Entrance — two panels that slide outward on tap, revealing couple names + date |
| `#info`      | General info + couple names + guest wishes wall |
| `#itinerary` | Day-of timeline |
| `#map`       | Embedded Google Map + directions link |
| `#rsvp`      | Form (attendance, guest count, names, phones, wishes) |
| `#contact`   | Bride & groom family contact blocks |

The page is fully scrollable. Each section fades + lifts in as it enters
the viewport (Framer Motion `whileInView`). A floating `↑` button appears
once the user scrolls past the hero and snaps them back to the top.

`[lang]` is either `en` or `ms`. The first visit is auto-routed by the
`proxy.ts` middleware based on the `Accept-Language` header; the user's
choice is then persisted in a `locale` cookie.

## Run it

The app uses **PostgreSQL** in production. Render supplies the database
connection automatically through `render.yaml`.

```bash
npm install
npx prisma migrate dev --name init   # requires a PostgreSQL DATABASE_URL
npm run dev                          # http://localhost:3000
npm run build                        # production build (Turbopack)
npm run lint
```

For local development, set `DATABASE_URL` to a PostgreSQL database before
running Prisma commands. The API code does not need a database-specific change.

## Customise the wedding

- **Names, parents, contact numbers, date, venue, GPS coordinates** —
  edit `lib/wedding-data.ts`.
- **All translatable text** (English + Malay) —
  edit `app/dictionaries/en.json` and `app/dictionaries/ms.json`.
- **Colour palette** (lemon yellow + leaf green) — CSS custom properties
  in `app/globals.css`.
- **Map embed** — change `wedding.venue.googleMapsUrl` in
  `lib/wedding-data.ts`. Any Google Maps embed URL works.

## Architecture notes

- **No external animation library** — sliding doors and falling leaves are
  pure CSS `@keyframes`. Particle data is generated once on mount to avoid
  SSR/CSR hydration mismatch.
- **No external i18n library** — uses Next.js 16's recommended
  dictionary pattern: `app/[lang]/dictionaries.ts` lazy-loads per-locale
  JSON, the root layout passes the dict into a small client-side
  `I18nProvider` context so client components can call `useI18n()`.
- **RSVP persistence** — submissions are written to PostgreSQL via Prisma.
  The `Rsvp` and `Wish` tables are defined in
  `prisma/schema.prisma`. The browser calls `POST /api/rsvp` and
  `POST /api/wishes`; both route handlers live in `app/api/`.
- **Google Maps iframe** is loaded directly — no API key required for
  the basic embed URL.
