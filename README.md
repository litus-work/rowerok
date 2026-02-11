# Rower Ok

Production-grade bicycle e-commerce monorepo.

## 1) Project Summary

- Backend: Django + DRF + PostgreSQL + Redis + Celery
- Frontend: Next.js App Router + TypeScript + Tailwind CSS
- Features implemented:
  - Categories and catalog pages
  - URL-based filtering (price, brand, frame_size, wheel_size, frame_material, brake_type, fork_type, gears, condition, availability)
  - Product detail page
  - Compare (2-4 products)
  - Favorites
  - Cart (localStorage + backend sync for authenticated users)
  - Checkout with validation and manual payment methods
  - User auth (register/login with DRF token)
  - Account and orders page
  - Django admin customization
  - CSV product import command
  - Celery notifications: email to customer, email to manager, Telegram message
  - UKR/ENG language switch (UI + dual-language product/category fields)

## 2) Folder Structure

```text
.
├── backend
│   ├── config
│   ├── core
│   ├── users
│   ├── catalog
│   ├── orders
│   ├── manage.py
│   └── requirements.txt
├── frontend
│   ├── src/app
│   ├── src/components
│   ├── src/lib
│   └── package.json
├── docker
│   ├── backend.Dockerfile
│   ├── frontend.Dockerfile
│   └── docker-compose.yml
├── .env.example
└── README.md
```

## 3) Environment Variables

Use `.env.example` as baseline:

- `DJANGO_SECRET_KEY`
- `DJANGO_DEBUG`
- `DJANGO_ALLOWED_HOSTS`
- `DJANGO_USE_SQLITE`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `REDIS_URL`
- `CELERY_TASK_ALWAYS_EAGER`
- `DEFAULT_FROM_EMAIL`
- `MANAGER_EMAIL`
- `EMAIL_BACKEND`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `CORS_ALLOWED_ORIGINS`
- `NEXT_PUBLIC_API_URL`

## 4) Setup Instructions

Python for backend: `3.12.x` (recommended) or `3.13.x`.  
`Python 3.14` currently breaks Django admin rendering in this stack.

1. Copy env:
   - `copy .env.example .env` (Windows PowerShell: `Copy-Item .env.example .env`)
2. Backend dependencies:
   - `cd backend`
   - `py -3.12 -m venv .venv`
   - `.\.venv\Scripts\Activate.ps1`
   - `python -m pip install -r requirements.txt`
3. Frontend dependencies:
   - `cd ../frontend`
   - `npm install`

## 5) Run Backend

From `backend`:

1. Migrations:
   - PostgreSQL: `python manage.py migrate`
   - SQLite dev mode: `$env:DJANGO_USE_SQLITE='true'; python manage.py migrate`
2. Create admin:
   - `python manage.py createsuperuser`
3. Seed products (dev):
   - `python manage.py seed_data`
4. Run API:
   - `python manage.py runserver 127.0.0.1:8000`
5. Run Celery worker:
   - `celery -A config worker -l info`

## 6) Run Frontend

From `frontend`:

1. Dev:
   - `npm run dev`
2. Production build:
   - `npm run build`
   - `npm run start`

Frontend default URL: `http://127.0.0.1:3000`

## Docker (optional)

From `docker`:

- `docker compose --env-file ../.env up --build`

## 7) Migration Instructions

When models change:

1. `python manage.py makemigrations`
2. `python manage.py migrate`

Current migrations are included for:

- `catalog`
- `orders`
- `users`

## 8) Verification Checklist

- [ ] `python manage.py test` passes
- [ ] `npm run build` passes
- [ ] `/catalog` filters update URL query params and return filtered products
- [ ] Product page opens by slug and shows specs
- [ ] Cart works for guest (localStorage)
- [ ] Login/register returns token and account pages are accessible
- [ ] Authenticated cart/favorites/compare sync with backend endpoints
- [ ] Checkout creates `Order` + `OrderItem` rows in DB
- [ ] New order appears in Django Admin
- [ ] Email notifications are sent (customer + manager)
- [ ] Telegram notification is sent when bot token/chat id are set

## Useful Commands

- CSV import:
  - `python manage.py import_products_csv path/to/products.csv`
- API examples:
  - `GET /api/catalog/products/?price_min=1000&brand=Summit,Veloce&condition=new`
  - `GET /api/catalog/products/?search=gravel`
  - `GET /api/catalog/products/filters/`
