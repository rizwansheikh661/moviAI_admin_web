# MoviAI Admin Web

Single-page admin web app serving both **Super Admin** and **Tenant Admin** panels via role-based routing.

## Stack

- Next.js 14 (App Router) + TypeScript
- Bootstrap 5.3 + react-bootstrap
- Framer Motion (animations)
- SCSS for theming

## Brand colors (from MoviAI Figma)

- Primary: `#A8D729` (lime green)
- Secondary: `#0A1633` (deep navy)
- Background: `#F4F8EE` (soft cream-green)

## Development

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Routes

- `/login` — shared login (role detected from API response)
- `/super/*` — Super Admin (cross-tenant)
- `/admin/*` — Tenant Admin (single-tenant scoped)

## Phase 1 status

- [x] Foundation + theme + login page + Super dashboard (review-ready)
- [ ] Tenant CRUD + Driver/Rides list + Commission config + Tenant Admin pages
- [ ] API integration with `moviAI_API` backend
- [ ] Real auth (JWT from backend)
