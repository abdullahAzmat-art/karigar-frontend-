# 🛠️ Karigar - Local Services Marketplace

Karigar is a platform that connects local service providers (plumbers, electricians, etc.) with customers. This repository contains the backend API built with Node.js, Express, and MongoDB.

## 🚀 Getting Started

### Prerequisites
- Node.js
- MongoDB (Local or Atlas)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/abdullahAzmat-art/karigar-frontend-.git
   cd karigar
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory and add:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```
4. Run the server:
   ```bash
   npm run dev
   ```

---

## 🔄 User Flow

### 1. Registration & Roles
- **Customers**: Register and get immediate access (`active` status).
- **Service Providers**: Register with `pending_approval` status. They cannot add services or accept bookings until approved by an Admin.

### 2. Admin Approval Process
- Admin reviews pending providers in the Admin Dashboard.
- Admin updates provider status to `active` to grant them access.

### 3. Service Management (Providers)
- Approved providers create their service profile (category, price, availability).
- Providers manage incoming booking requests (Accept/Reject/Reschedule).

### 4. Booking Process (Customers)
- Customers browse active services.
- Customers book a service for a specific date.
- Customers track booking status (Pending -> Confirmed -> Completed).

---

## 📖 API Documentation

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Body |
| :--- | :--- | :--- | :--- |
| POST | `/register` | Register a new user | `{ name, email, password, role }` |
| POST | `/login` | Login and get JWT token | `{ email, password }` |

---

### 👤 Customer Endpoints (`/api/customer`)
*All routes require `Authorization: Bearer <token>` and `role: customer`*

| Method | Endpoint | Description | Body |
| :--- | :--- | :--- | :--- |
| GET | `/services` | Browse all available services | N/A |
| GET | `/provider/:id` | View provider profile & services | N/A |
| POST | `/bookings` | Create a new booking request | `{ serviceId, bookingDate }` |
| GET | `/bookings` | View your booking history | N/A |
| PATCH | `/bookings/:id/cancel` | Cancel a pending booking | N/A |

---

### 🛠️ Service Provider Endpoints (`/api/provider`)
*All routes require `Authorization: Bearer <token>` and `role: provider`*

| Method | Endpoint | Description | Body |
| :--- | :--- | :--- | :--- |
| GET | `/service` | View your service profile | N/A |
| POST | `/service` | Create/Update service profile | `{ title, description, category, price, availability }` |
| GET | `/bookings` | View incoming booking requests | N/A |
| PUT | `/bookings/:id` | Update booking status | `{ status }` |
| PUT | `/bookings/:id/reschedule` | Propose new booking date | `{ bookingDate }` |

---

### 🛡️ Admin Endpoints (`/api/admin`)
*All routes require `Authorization: Bearer <token>` and `role: admin`*

| Method | Endpoint | Description | Body |
| :--- | :--- | :--- | :--- |
| POST | `/login` | Admin login | `{ email, password }` |
| GET | `/users` | List all users | N/A |
| PUT | `/users/:id/status` | Activate/Deactivate user | `{ status }` |
| DELETE | `/users/:id` | Permanently remove a user | N/A |
| GET | `/services` | View all services | N/A |
| GET | `/reports` | View user reports | N/A |
| PUT | `/reports/:id` | Update report status | `{ status }` |
| GET | `/metrics` | View platform performance metrics | N/A |

---

## 📜 License
ISC
