# The Grand Crest API

A RESTful backend service built to support a modern cabin booking and reservation platform. It provides structured and secure endpoints for managing cabins, guests, bookings, users, and application settings.

**Base URL:** `https://the-grand-crest-api.onrender.com/api/v1`

---

## Table of Contents

- [Authentication](#authentication)
- [Cabins](#cabins)
- [Guests](#guests)
- [Bookings](#bookings)
- [Users](#users)
- [Settings](#settings)

---

## Authentication

Protected endpoints require a Bearer Token passed in the `Authorization` header.

```
Authorization: Bearer {{jwt}}
```

---

## Cabins

Manage cabin listings available on the platform.

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/cabins` | Create a new cabin |
| `GET` | `/cabins` | Get all cabins |
| `GET` | `/cabins/:id` | Get a cabin by ID |
| `PATCH` | `/cabins/:id` | Update a cabin |
| `DELETE` | `/cabins/:id` | Delete a cabin |

### POST `/cabins` — Create Cabin

Creates a new cabin listing with details such as name, capacity, and pricing.

**Request Body:**
```json
{
  "name": "003",
  "max_capacity": 3,
  "regular_price": 3434,
  "discount": 10,
  "description": "Good"
}
```

### GET `/cabins` — Get All Cabins

Returns a list of all available cabins including pricing, capacity, and availability info.

### GET `/cabins/:id` — Get Cabin by ID

Returns full details for a specific cabin including pricing, capacity, description, and images.

### PATCH `/cabins/:id` — Update Cabin

Modifies an existing cabin's details without recreating it.

**Request Body (example):**
```json
{
  "discount": 5
}
```

### DELETE `/cabins/:id` — Delete Cabin

Permanently removes a cabin from the system.

---

## Guests

Handle guest authentication, registration, and account management.

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/guests` | Create a new guest account |
| `GET` | `/guests` | Get all guests |
| `GET` | `/guests/:id` | Get a guest by ID |
| `GET` | `/guests/getBookings` | Get bookings for authenticated guest |
| `GET` | `/guests/lookup` | Get guest by email |
| `POST` | `/guests/login` | Guest login |
| `DELETE` | `/guests/:id` | Delete a guest |

### POST `/guests` — Create Guest

Registers a new guest account.

**Request Body:**
```json
{
  "fullName": "raju",
  "email": "raju@example.com",
  "password": "test1234"
}
```

### POST `/guests/login` — Login

Authenticates a guest and creates a session for accessing protected features.

**Request Body:**
```json
{
  "email": "raju@example.com",
  "password": "test1234"
}
```

### GET `/guests` — Get All Guests

Returns all registered guest accounts. Intended for admin use.

### GET `/guests/:id` — Get Guest by ID

Returns profile details for a specific guest.

### GET `/guests/getBookings` — Get Guest Bookings

Returns all bookings associated with the currently authenticated guest, including reservation history and upcoming stays.

### GET `/guests/lookup` — Get Guest by Email

Looks up a guest account by email address without requiring their ID.

### DELETE `/guests/:id` — Delete Guest

Permanently removes a guest account and all associated access from the platform.

---

## Bookings

Manage cabin reservations for guests.

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/bookings` | Create a new booking |
| `GET` | `/bookings` | Get all bookings |
| `GET` | `/bookings/:id` | Get a booking by ID |
| `PATCH` | `/bookings/:id` | Update a booking |
| `DELETE` | `/bookings/:id` | Delete a booking |

### POST `/bookings` — Create Booking

Reserves a cabin for an authenticated guest.

**Request Body:**
```json
{
  "startDate": "2026-02-11",
  "endDate": "2026-02-12",
  "numNights": 1,
  "cabinPrice": 500,
  "extraPrice": 30,
  "status": "unconfirmed",
  "hasBreakfast": true,
  "isPaid": true,
  "observations": "No observations",
  "cabinId": "698c73c5e85822bb0bbe5b86",
  "guestId": "698891bbbb4daeb0a4625928",
  "totalPrice": 530
}
```

### GET `/bookings` — Get All Bookings

Returns all bookings in the system. Intended for admin use.

### GET `/bookings/:id` — Get Booking by ID

Returns full details for a specific booking including cabin info, dates, and guest data.

### PATCH `/bookings/:id` — Update Booking

Modifies an existing booking's details.

**Request Body (example):**
```json
{
  "numNights": 5,
  "cabinPrice": 1000
}
```

### DELETE `/bookings/:id` — Delete Booking

Cancels and permanently removes a reservation from the system.

---

## Users

Manage user accounts and authorization for admin-level access.

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/auth/signin` | Initiate sign-in |
| `POST` | `/auth/login` | User login |
| `GET` | `/auth/getme` | Get current user |
| `POST` | `/auth/createUser` | Create a new user |
| `PATCH` | `/auth/updateMe` | Update current user |
| `POST` | `/auth/logout` | Logout |
| `DELETE` | `/auth/:id` | Delete a user |

### POST `/auth/login` — Login

Authenticates a user and establishes a session.

**Request Body:**
```json
{
  "email": "test@example.com",
  "password": "test1234"
}
```

### GET `/auth/getme` — Get Current User

Returns the profile and session details of the currently authenticated user.

### POST `/auth/createUser` — Create User

Registers a new user who can manage protected features of the application.

**Request Body:**
```json
{
  "fullName": "test102",
  "email": "test102@gmail.com",
  "password": "test1024"
}
```

### PATCH `/auth/updateMe` — Update User

Modifies the profile information of the currently authenticated user.

### POST `/auth/logout` — Logout

Terminates the current user session.

### DELETE `/auth/:id` — Delete User

Permanently removes a user account from the system.

---

## Settings

Manage application-wide configuration and platform behavior.

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/settings` | Get current settings |
| `PATCH` | `/settings/:id` | Update settings |

### GET `/settings` — Get Settings

Returns the current global configuration, including pricing rules and operational preferences.

### PATCH `/settings/:id` — Update Settings

Modifies global system settings by ID.

**Request Body (example):**
```json
{
  "breakfastPrice": 12
}
```

---

## Booking Status Values

| Status | Description |
|--------|-------------|
| `unconfirmed` | Booking has been created but not yet confirmed |

---

## Notes

- All IDs in path parameters (`:id`) are MongoDB ObjectIDs.
- Date fields use the `YYYY-MM-DD` format.
- The API uses JWT-based authentication. Obtain a token via the login endpoints and include it as a Bearer Token for protected routes.
