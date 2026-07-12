# Service Booking Platform

## Project Overview

A NestJS REST API for managing bookable services and customer appointments. Staff users authenticate with JWT to manage services and bookings; customers can create and cancel bookings without an account by providing their contact details.

**Core capabilities**

- Staff authentication (signup, login, refresh, logout)
- Service CRUD (title, description, duration, price, active status)
- Public booking creation and cancellation
- Staff booking listing, detail, and status updates (`PENDING` → `CONFIRMED` / `COMPLETED`, plus cancel)
- Conflict checks that block two bookings for the same service at the same date and time
- Swagger docs, Prisma + PostgreSQL, structured logging (Pino)

**Stack:** NestJS · Prisma · PostgreSQL · JWT · Swagger · dayjs

---

## Installation Steps

### Prerequisites

- Node.js 22+ (recommended)
- PostgreSQL 14+
- npm/pnpm(recommended)/yarn

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd service-booking-platform

# Install dependencies (runs `prisma generate` via postinstall)
npm install

# Configure environment
cp .env.example .env
# Edit .env with your values (see Environment Variables)
```

---

## Environment Variables

Copy `.env.example` to `.env` and set:

| Variable       | Description                                      | Example                                      |
|----------------|--------------------------------------------------|----------------------------------------------|
| `PORT`         | HTTP port (defaults to `8080` if unset)          | `8080`                                       |
| `DATABASE_URL` | PostgreSQL connection string                     | `postgresql://user:pass@localhost:5432/db`   |
| `JWT_SECRET`   | Secret used to sign and verify JWT access tokens | `a-long-random-secret`                       |

Optional:

| Variable   | Description                                      |
|------------|--------------------------------------------------|
| `NODE_ENV` | Set to `production` for production logging/cookies |

---

## Database Setup

1. Create a PostgreSQL database.
2. Set `DATABASE_URL` in `.env`.
3. Apply migrations (see [Running Migrations](#running-migrations)).

The Prisma schema lives in `prisma/schema.prisma`. The generated client is written to `generated/prisma`.

**Models**

- `User` — staff accounts (email + password)
- `Service` — bookable offerings (`duration` in whole minutes)
- `Booking` — customer appointment (`bookingDate` as date, `bookingTime` as time), linked to a service

---

## Running the Application

```bash
# Development (watch mode)
npm run dev

# Start once (applies pending migrations, then starts)
npm start

# Production
npm run build
npm run prod
```

The API listens on `http://localhost:8080` (or the port set in `PORT`).

Timezone is forced to **UTC** at process start so date/time fields behave consistently.

---

## Running Migrations

```bash
# Apply all pending migrations (also runs on `npm start` / `npm run prod`)
npx prisma migrate deploy

# Create and apply a new migration during development
npx prisma migrate dev --name <migration_name>

# Regenerate the Prisma client only
npx prisma generate
```

---

## API Documentation

Interactive OpenAPI docs are available when the app is running:

**[http://localhost:8080/docs](http://localhost:8080/docs)**

Use **Authorize** with a Bearer access token for protected routes. Refresh tokens are issued as an HTTP-only `refreshToken` cookie on login/refresh.

### Main route groups

| Group     | Base path   | Notes |
|-----------|-------------|--------|
| Auth      | `/auth`     | Public: signup, login, refresh. Protected: logout, me |
| Service   | `/service`  | Protected staff CRUD + list/get |
| Booking   | `/booking`  | Public: create, cancel. Protected: list, get, update status |

Most routes require a JWT unless marked `@PublicRoute()` (booking create/cancel and auth signup/login/refresh).

---

## Assumptions Made

- **Staff vs customer:** Authenticated `User` accounts are staff/admin. Customers are not registered users; they book with name, email, and phone only.
- **Public booking create/cancel:** Anyone with a booking ID can cancel; there is no ownership check against a customer account.
- **Conflict rules:** Only one booking is allowed per service + date + time. There is no check that the same customer is booking twice, and no staff/resource capacity beyond that single slot.
- **Time selection:** Clients send an arbitrary `HH:mm` time; the API does not generate slots from duration, business hours, or existing bookings.
- **Service duration:** Stored for the service but not used yet to block overlapping time ranges.
- **Auth model:** Access tokens are JWTs; refresh tokens are stored in cookies. All non-public routes are guarded by default.
- **Date/time storage:** Application timezone is UTC; booking date and time are stored as PostgreSQL `DATE` and `TIME` columns.

---

## Future Improvements

### 1. Customer Management and Authentication

Introduce customer registration and authentication to establish unique customer identities. This serves as the foundation for secure customer-specific features and ownership verification.

### 2. Secure Booking Management

Allow authenticated customers to securely view, edit, cancel, and reschedule only their own bookings by verifying booking ownership.

### 3. Duplicate Booking Prevention

Prevent duplicate bookings by the same customer for the same service, date, and time. This feature depends on customer management and authentication to reliably identify customers.

### 4. Resource and Staff Management

Introduce resource allocation by assigning services to staff members or other resources, enabling multiple simultaneous bookings based on actual resource availability.

### 5. Service Availability Management

Determine service availability using service duration, resource schedules, business operating hours, and existing bookings to prevent overlapping appointments.

### 6. Time Slot Generation

Automatically generate available booking time slots based on service duration, operating hours, resource availability, and existing bookings, instead of allowing arbitrary time selection.
