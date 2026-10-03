# Meridian

Meridian is an import, export, and freight management platform designed to help customers manage shipments, track goods, and communicate with a freight company through a centralized platform.

## Features

* User registration and authentication
* Company profile management
* Shipment creation and management
* Goods and shipment item management
* Shipment tracking
* Destination management
* Contact and inquiry management
* Book-a-call functionality
* Notifications
* Customer dashboard
* Administrative dashboard
* Shipment and request management
* Role-based access control

## Project Structure

```text
meridian/
├── backend/
└── frontend/
```

### Backend

The backend is the primary focus of this project and was designed and implemented by me.

It provides the REST API, authentication, database access, business logic, validation, and communication between the frontend and the database.

**Technologies:**

* NestJS
* TypeScript
* Prisma
* PostgreSQL
* Supabase
* REST API
* Class Validator

### Frontend

The frontend provides the user interface for interacting with the platform.

The frontend was developed using an **AI-assisted/vibe-coding workflow**, as my primary area of focus is backend development rather than frontend development. AI tools were used to accelerate the creation of the UI, components, pages, and frontend integration.

The frontend is included to demonstrate the backend APIs within a complete working application.

**Technologies:**

* React
* TypeScript
* Vite
* Supabase

## Backend Architecture

The backend follows a modular NestJS architecture.

```text
backend/
├── src/
│   ├── auth/
│   ├── company/
│   ├── database/
│   ├── shipment/
│   ├── supabase/
│   ├── users/
│   └── app.module.ts
├── prisma/
│   ├── migrations/
│   └── schema.prisma
└── package.json
```

Each major feature is separated into its own module containing controllers, services, DTOs, and related functionality.

## Authentication

Authentication is handled using **Supabase Auth**.

The NestJS backend validates authenticated requests and uses the authenticated user's identity when performing protected operations.

## Database

The application uses:

* PostgreSQL for data storage
* Prisma ORM for database access and schema management
* Supabase for authentication and related services

## API

The backend exposes RESTful endpoints for the application's core functionality.

The API is designed to separate authentication, business logic, database operations, and HTTP controllers into maintainable modules.

## Development

### Backend

```bash
cd backend
npm install
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Environment variables are required to run the application locally.

Create the appropriate `.env` files using the provided `.env.example` as a reference.

**Never commit real environment variables, API keys, passwords, or database credentials to GitHub.**

## Development Note

This project reflects my focus as a **backend developer**.

The backend architecture, API development, database design, authentication, validation, business logic, and backend integration were implemented by me.

The frontend was created using an AI-assisted/vibe-coding workflow and is primarily included to provide a working interface for demonstrating the backend.

## Project Status

The project is under active development. Additional functionality and improvements will be added as development continues.

## Author

**Abdulmalik Ibrahim Abdullahi**

Backend Developer
NestJS • TypeScript • PostgreSQL • Prisma • Supabase

## Running locally

**Backend** (`backend/`)

```bash
cp .env.example .env          # fill in DATABASE_URL, SUPABASE_URL, SUPABASE_ANON_KEY
npm install
npx prisma migrate dev        # applies the schema (see "Database" below)
npm run start:dev             # API on http://localhost:3000/api, Swagger on /docs
```

**Frontend** (`frontend/`) - see `frontend/README.md`.

**Supabase dashboard:** add `<FRONTEND_URL>/reset-password` to Authentication > URL Configuration >
Redirect URLs, otherwise password-reset links are rejected.

## Database migrations

`prisma/schema.prisma` is ahead of the migration history, so run `npx prisma migrate dev` to generate
and apply a new migration. If the database already holds data from the old schema, Prisma may refuse
(new required columns, changed enums); on a development database use `npx prisma migrate reset`.

## API overview

Every route requires a valid Supabase access token unless marked public. Staff = `ADMIN` or `STAFF`.

| Area | Routes |
| --- | --- |
| Auth | `POST /auth/register` `login` `refresh` `forgot-password` `reset-password` (public), `POST /auth/logout` |
| Users | `GET /users/me`, `GET /customers` and `/customers/:id` (staff) |
| Company | `POST /company`, `GET /company/me`, `PATCH /company`, `DELETE /company` |
| Requests | `POST /requests`, `GET /requests/me`, `GET /requests/:id`; staff: `GET /requests/admin/all`, `PATCH /requests/admin/:id` (status, quote) |
| Shipments | `GET /shipment/me`, `GET /shipment/:id`; staff: `GET /shipment/admin/all`, `POST /shipment/admin/from-request`, `PATCH /shipment/admin/:id`, `POST /shipment/admin/:id/documents` |
| Tracking | `GET /tracking-event/:trackingNumber` (public); staff: `POST /tracking-event/:trackingNumber/events` |
| Notifications | `GET /notifications/me`, `PATCH /notifications/read-all`, `PATCH /notifications/:id/read` |
| Bookings | `POST /booking` (public); staff: `GET /booking/admin/all`, `PATCH /booking/admin/:id` |
| Contact | `POST /contact` (public); staff: `GET /contact/admin/all`, `PATCH /contact/admin/:id` |

## Known limits

- Documents are metadata only (name, type, size label, staff-only flag). There is no file storage yet.
- If saving the profile fails right after Supabase sign-up, the Supabase user is left behind. Cleaning
  it up needs the service-role key.
- The public booking and contact endpoints have no rate limiting yet.

