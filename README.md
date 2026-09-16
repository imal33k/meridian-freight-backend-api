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
