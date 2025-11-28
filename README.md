## Hotel Willa

Full-stack hotel management platform with a Django REST backend and a React (Vite) frontend. Guests can browse rooms, dining tables, resort packages, plane classes, and occasions, then submit bookings inside each detail page. Staff can manage content and view live metrics through the protected admin dashboard.

### Stack

- **Frontend:** React 19, React Router 7, TanStack Query 5, Tailwind CSS, Vite, Vitest, Testing Library
- **Backend:** Django 4.2, Django REST Framework, SimpleJWT, PostgreSQL, Pillow
- **Tooling:** Docker & docker-compose, GitHub Actions CI, Postman collection

---

## Quick start

### 1. Clone & install

```bash
git clone <repo> hotel-willa
cd hotel-willa
cp env.example .env    # optional, configure overrides
```

### 2. Run with Docker (recommended)

```bash
docker-compose up --build
```

Services:

- Backend API: http://localhost:8000/api
- Frontend: http://localhost:5173
- PostgreSQL: localhost:5432 (credentials in `docker-compose.yml`)

The compose command runs migrations and seeds demo data automatically (idempotent).

### 3. Run without Docker

#### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
export DATABASE_URL=postgres://hotel_willa:hotel_willa@localhost:5432/hotel_willa  # adjust as needed
python manage.py migrate
python manage.py seed_hotel
python manage.py runserver 0.0.0.0:8000
```

> For local development you can keep SQLite by omitting `DATABASE_URL`. PostgreSQL is required in Docker/CI.

#### Frontend

```bash
cd frontend
npm install
VITE_API_URL=http://localhost:8000/api npm run dev
```

---

## Environment variables

Copy `env.example` to `.env` (or inject through your hosting platform). Key settings:

| Variable | Description |
| --- | --- |
| `DJANGO_SECRET_KEY` | Django signing key |
| `DJANGO_DEBUG` | `1` for local dev |
| `DATABASE_URL` | Standard Postgres URI |
| `CORS_ALLOWED_ORIGINS` | Frontend origins, e.g. `http://localhost:5173` |
| `VITE_API_URL` | Frontend base URL for API requests |

For production, also configure `CSRF_TRUSTED_ORIGINS` and `CORS_ALLOW_ALL=0`.

---

## Seeding content & media

- `python manage.py seed_hotel` loads rooms, tables, resort packages, plane classes, occasions, demo bookings, and default users.
- Local placeholder images live in `backend/media/seed/`. Replace files or upload via the React admin dashboard (Images panel copies IDs for reuse).
- Remote Unsplash URLs are also seeded for variety; update them in `bookings/management/commands/seed_hotel.py`.

### Demo credentials

| Role | Username | Password |
| --- | --- | --- |
| Admin | `admin` | `AdminPass123!` |
| Guest | `guest` | `GuestPass123!` |

---

## Running tests

### Backend

```bash
cd backend
python manage.py test bookings
```

Tests cover key API guarantees including plane class responses, booking overlap validation, and dashboard defaults.

### Frontend

```bash
cd frontend
npm run test
```

Vitest + Testing Library exercises shared UI components to ensure regressions are caught in CI.

GitHub Actions (`.github/workflows/ci.yml`) run both suites plus migrations on every push/PR.

---

## API reference

- Core endpoints: `/api/rooms/`, `/api/tables/`, `/api/resorts/`, `/api/plane-classes/`, `/api/occasions/`
- Booking: `POST /api/bookings/` (JWT required; server validates availability)
- Dashboard stats: `GET /api/dashboard/` (admin only, never returns nulls)
- Auth: `/api/auth/register/`, `/api/auth/login/`, `/api/auth/refresh/`

Import `docs/HotelWilla.postman_collection.json` into Postman/Insomnia for ready-made calls.

---

## Frontend features

- Responsive Tailwind layout, accessible nav + keyboard-friendly booking modals.
- Home page without generic “Book Now” CTAs; bookings only within Rooms/Tables/Resorts/Planes detail views.
- React Admin dashboard (JWT protected) for live stats, CRUD over rooms/tables/resorts/plane classes/occasions, and image uploads.
- Defensive data handling: list pages tolerate either arrays or paginated objects, showing graceful error + retry UI (`Failed to load plane classes.` etc.).

---

## Common troubleshooting

- **CORS / cookies:** Ensure `CORS_ALLOWED_ORIGINS` includes the exact frontend origin (protocol + port). For production, also set `CSRF_TRUSTED_ORIGINS`.
- **Postgres connection errors:** Confirm the `DATABASE_URL` host/port matches Docker or local service. With Docker Desktop on Windows/macOS, Postgres is exposed on `localhost:5432`.
- **Media not loading:** Uploaded files land in `backend/media/uploads`. Mount `media_data` volume in Docker or set `MEDIA_ROOT` on your host. Update Tailwind-friendly image URLs via the admin image library.
- **Plane classes array:** Backend guarantees `/api/plane-classes/` always returns `[]` or `[ ... ]`. If the frontend still errors, confirm you migrated & seeded data.

---

## Changing sample images

1. Replace any file inside `backend/media/seed/` or upload new images via `/admin` → Images (or the React admin dashboard).
2. Attach image IDs to rooms/tables/resorts/planes/occasions via the React admin CRUD forms (`Image IDs` field accepts comma-separated IDs).
3. Restart the frontend (if you changed `VITE_API_URL`) to pick up new media URLs.

---

## Development tips

- Run `python manage.py shell_plus` (if django-extensions installed) for quicker data tweaks.
- Use `?page=` and `?page_size=` on list endpoints; responses include a consistent `results` array plus pagination metadata.
- Booking overlap checks run server-side—modify `BookModal` to catch validation messages returned by DRF if needed.
- For background workers/email, start by swapping the console email backend in `config/settings.py`.

Enjoy building with Hotel Willa!

