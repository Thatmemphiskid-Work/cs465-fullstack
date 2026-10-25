# Travlr Getaways

CS 465 final project using MongoDB, Express, Angular, and Node.js.

## Run locally

1. Install dependencies in this directory and in `app_admin` using `npm ci`.
2. Start MongoDB locally on port 27017. The database is `travlr`; set `DB_HOST` if needed.
3. Create a local `.env` with a strong `JWT_SECRET`. Never commit this file.
4. For a fresh database only, run `node app_api/models/seed.js` from this directory. This replaces the trip collection with `data/trips.json`.
5. Run `npm start` here, then `npm start` in `app_admin`.
6. Open http://localhost:3000 for the customer site and http://localhost:4200 for administration.

## Staff access

This course application manages staff accounts. Login is public; trip creation, trip updates, and registration of additional staff require a valid one-hour Bearer token. Public self-registration is disabled. Existing staff can sign in as before. For a fresh installation, provision the first staff account using the local bootstrap script described below; no default password is included.

Run `node scripts/create-admin.js` with `ADMIN_EMAIL`, `ADMIN_NAME`, and `ADMIN_PASSWORD` set in the environment. This creates a staff account only when no users exist. Omit those variables from shell history and source control. After bootstrap, use authenticated POST `/api/register` to provision additional staff.

## Rubric coverage

- Customer MVC: `app_server/routes`, `controllers`, Handlebars `views`, and shared partials.
- JSON rendering: `/travel` retrieves `/api/trips` and renders MongoDB records; legacy travel links redirect to this route.
- Persistence: Mongoose Trip and User schemas and MongoDB `trips` and `users` collections.
- REST: public GET `/api/trips` and `/api/trips/:tripCode`; protected POST `/api/trips`, PUT `/api/trips/:tripCode`, and POST `/api/register`; POST `/api/login`.
- SPA: routed trip listing/cards, required Add/Edit forms, date input, currency formatting, login/logout, JWT interceptor, and authentication guards.
- Test evidence: the SDD records a unique trip, before/after pricing, screenshots, GET/PUT persistence, and rejected unauthenticated writes.

The broader scenario's reservations, itineraries, checkout, and customer account management are outside the implemented trip-catalog workflow. Staff users share maintenance permissions; this application does not implement separate customer and administrator roles.

## AI assistance

OpenAI Codex assisted with inspection, security and MVC fixes, tests, and documentation. Review the accompanying SDD for architecture and test evidence.

## Verify the application

With MongoDB and the server running, set `ADMIN_EMAIL` and `ADMIN_PASSWORD` for an existing staff account and run `node scripts/verify-api.cjs`. Optionally set `API_BASE_URL` (default `http://localhost:3000`). This checks public MVC rendering, API errors, protected endpoints, login, token expiry, password compatibility, and real add/update persistence. It creates or updates the clearly named `RJFINAL1025` verification tour. Run `npm run build` in `app_admin` to verify the Angular production build.
