# TechVault — Enterprise Electronics & Hardware E-Commerce Platform

TechVault is a modern, full-stack electronics e-commerce platform built with **React (Tailwind CSS, Vite)** on the frontend, **Spring Boot 3 (Spring Security, JPA/Hibernate, JJWT)** on the backend, and **MySQL / H2** database persistence.

---

## ⚡ Key Platform Features

### 🛒 Customer Storefront & Hardware Shopping
- **Dynamic Specification Matrix**: Key-value technical specifications system (`product_specifications`) supporting arbitrary hardware specs (e.g. CPU Socket, TDP, DDR standard, GPU Clock, VRAM, Display Refresh Rate).
- **Rule-Based Smart Product Finder ("Help Me Choose")**: Interactive recommendation algorithm (`POST /api/recommendations`) matching users by budget, usage tier (Gaming, Content Creation, Office, Development), and hardware priorities without external AI dependencies.
- **Custom PC Builder & Compatibility Checker**: Real-time compatibility engine (`POST /api/compatibility/check`) inspecting CPU socket matching, motherboard DDR standard, GPU chassis clearance, and estimated PSU wattage thresholds.
- **Side-by-Side Multi-Product Comparison**: Compare up to 4 devices side-by-side with difference highlighting across dynamic spec attributes.
- **Live Search & Autocomplete**: Real-time search suggestions (`GET /api/products/suggestions?q=...`) across product titles, categories, and brands.
- **Server-Side Filtering & Pagination**: Filter by category, brand, price range, stock availability, and sort by price, rating, or newest.
- **Persistent Cart & Wishlist**: Real-time stock reservation validation, 18% GST calculation, coupon discounting, and 1-click move between wishlist and cart.
- **Transactional Checkout**: End-to-end atomic transactions: order allocation, stock deduction, payment recording, and cart clearing.
- **Visual Order Tracking**: 6-stage lifecycle tracking: `PENDING` ➔ `CONFIRMED` ➔ `PACKED` ➔ `SHIPPED` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED`.
- **Verified Purchaser Reviews**: Rating and feedback submission with moderation guards.

### 🛡️ Backoffice & Administrative Suite (`/admin`)
- **Executive Analytics Dashboard**: Gross revenue tracking, order volume, low stock alerts, category revenue share, and top-selling hardware leaderboards.
- **Product Management**: Full CRUD with multi-image URLs, dynamic spec row builder, SKU generator, and threshold warnings.
- **Warehouse Inventory Control**: Live stock adjustments (+5, +25, -1) with audit logging.
- **Category & Brand Management**: Taxonomy hierarchy and partner OEM branding.
- **Order Dispatch & Logistics**: Status transition manager with courier tracking ID assignment.
- **Review Moderation**: Approve or reject customer reviews.
- **Coupon Promotion Engine**: Percentage / fixed discount promo codes with usage quotas and order minimums.
- **Customer CRM Inquiries**: In-app contact form ticket management with status resolution and direct mail reply.

---

## 🏗️ Architecture & Technology Stack

```
TechVault Architecture:
┌─────────────────────────────────────────────────────────────┐
│                 React 18 Single Page App                    │
│   Tailwind CSS • Lucide Icons • Context API • Axios Client  │
└──────────────────────────────┬──────────────────────────────┘
                               │ JSON / REST (JWT Auth)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               Spring Boot 3.2.5 Backend API                 │
│  Spring Security 6 • JJWT 0.12.5 • Bean Validation • Maven  │
├─────────────────────────────────────────────────────────────┤
│ Service Layer (Transactional Logic, Compatibility, Coupons) │
├─────────────────────────────────────────────────────────────┤
│  Spring Data JPA / Hibernate (21 Entities & Repositories)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ JDBC
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               MySQL 8.0 / H2 In-Memory Database             │
│   schema.sql (21 Tables, Foreign Keys, Indexes) • seed.sql  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 Demo Accounts & Credentials

For instant local testing, seed data provides ready-to-use accounts with 1-click fill buttons on the login page:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@techvault.com` | `Password123!` | Full Backoffice (`/admin/*`) & Storefront |
| **Customer** | `user@techvault.com` | `Password123!` | Storefront, Orders, Cart, Wishlist, Reviews |

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- **Node.js**: v18+ (Tested on Node v24)
- **Java JDK**: 17+ (Tested on OpenJDK 26)
- **MySQL**: 8.0+ *(Optional: If MySQL is not running, backend auto-initializes H2 database mode with seed data)*

---

### 2. Backend Setup (`/backend`)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Configure environment variables in `src/main/resources/application.yml` or set environment variables:
   ```bash
   export DB_URL=jdbc:mysql://localhost:3306/techvault_db?createDatabaseIfNotExist=true
   export DB_USERNAME=root
   export DB_PASSWORD=yourpassword
   export JWT_SECRET=techvaultSecretKey98765432101234567890techvaultSecretKey98765432101234567890
   ```

3. Run the Spring Boot application:
   ```bash
   # Using Maven:
   ./mvnw spring-boot:run
   ```

4. The backend server starts at: **`http://localhost:8080`**
   - **Swagger / OpenAPI UI**: [`http://localhost:8080/swagger-ui/index.html`](http://localhost:8080/swagger-ui/index.html)
   - **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`
   - **Health Endpoint**: `http://localhost:8080/api/health`

---

### 3. Frontend Setup (`/frontend`)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start Vite development server:
   ```bash
   npm run dev
   ```

4. Open **`http://localhost:5173`** in your browser.

---

## 📁 Repository Structure

```
├── backend/
│   ├── src/main/java/com/techvault/
│   │   ├── config/             # SecurityConfig, SwaggerConfig, DataInitializer
│   │   ├── controller/         # Auth, Product, Cart, Order, Admin, etc.
│   │   ├── dto/                # Request & Response DTOs, ApiResponse
│   │   ├── entity/             # 21 JPA Entities (User, Product, Order, etc.)
│   │   ├── exception/          # GlobalExceptionHandler, Custom Exceptions
│   │   ├── mapper/             # Entity <-> DTO Mapping Layer
│   │   ├── repository/         # 21 Spring Data JPA Repositories
│   │   ├── security/           # JwtUtils, AuthTokenFilter, UserDetailsServiceImpl
│   │   └── service/            # Transactional Business Services
│   ├── src/main/resources/     # application.yml, application-dev.yml
│   └── pom.xml                 # Maven configuration
├── frontend/
│   ├── src/
│   │   ├── api/                # Axios Client, Auth, Products, Cart, Admin APIs
│   │   ├── components/         # Navbar, Footer, ProductCard, Pagination, Loading
│   │   ├── context/            # AuthContext, CartContext, WishlistContext, Toast
│   │   ├── layouts/            # MainLayout (Storefront), AdminLayout (Backoffice)
│   │   ├── pages/              # 20+ Customer & Admin Views
│   │   ├── utils/              # Currency (INR ₹), Date Formatters
│   │   ├── App.jsx             # React Router v6 Configuration
│   │   └── main.jsx
│   └── tailwind.config.js
├── database/
│   ├── schema.sql              # Production DDL for 21 relational tables
│   └── seed.sql                # 50+ Products, 15 Categories, Brands, Reviews, Coupons
├── docs/
│   ├── API.md                  # Comprehensive REST API Specification
│   └── ER-DIAGRAM.md           # Full Mermaid Entity-Relationship Diagram
└── tests/
    └── techvault_postman_collection.json # 30+ Automated API Assertions
```

---

## 🛡️ Security Features Implemented

1. **Authentication**: BCrypt hashed passwords (never stored in plaintext) and JJWT token generation with claims.
2. **Role-Based Authorization**: Protected endpoints using `@PreAuthorize("hasRole('ADMIN')")`.
3. **Data Integrity & Isolation**: Prevent IDOR by verifying user ownership on carts, addresses, and orders.
4. **Input Sanitization**: Bean Validation (`@Valid`, `@NotBlank`, `@Min`, `@Email`).
5. **Anti-Account Enumeration**: Safe forgot-password endpoints that do not disclose email presence.

---

## 🧪 Testing & Postman Collection

Import `tests/techvault_postman_collection.json` into Postman or Newman to execute 30+ assertions testing registration, JWT authentication, product catalog filters, PC compatibility check, transactional checkout, and admin endpoints.

```bash
# Run with Newman
npx newman run tests/techvault_postman_collection.json
```

---

## 📦 Deployment

### Deploy to Render / Railway / Docker
- **Frontend**: Connect `frontend/` directory with build command `npm run build` and publish directory `dist/`.
- **Backend**: Connect `backend/` with build command `./mvnw clean package -DskipTests` and start command `java -jar target/techvault-backend-1.0.0.jar`.
- Set Environment Variables: `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `FRONTEND_URL`.

---

© 2026 TechVault Inc. All rights reserved.
