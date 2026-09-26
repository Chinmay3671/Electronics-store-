# TechVault REST API Documentation

Base URL: `http://localhost:8080`
Interactive Swagger / OpenAPI UI: `http://localhost:8080/swagger-ui.html`
Raw OpenAPI Spec: `http://localhost:8080/api-docs`

---

## 1. Authentication (`/api/auth`)

### Register Account
- **Method**: `POST`
- **Endpoint**: `/api/auth/register`
- **Auth**: Public
- **Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "phone": "+91 9876543210",
  "address": "42 Silicon Ave",
  "city": "Bengaluru",
  "state": "Karnataka",
  "pincode": "560001"
}
```
- **Response**: `200 OK` (Returns JWT token and user profile)

### Login
- **Method**: `POST`
- **Endpoint**: `/api/auth/login`
- **Auth**: Public
- **Request Body**:
```json
{
  "email": "admin@techvault.com",
  "password": "Password123!"
}
```
- **Response**: `200 OK`

---

## 2. Product Catalog (`/api/products`)

### Search & Filter Products
- **Method**: `GET`
- **Endpoint**: `/api/products`
- **Auth**: Public
- **Query Parameters**:
  - `search` (string)
  - `category` (slug string)
  - `brand` (slug string)
  - `minPrice` (decimal)
  - `maxPrice` (decimal)
  - `minRating` (double 1-5)
  - `status` (`IN_STOCK`, `LOW_STOCK`, `OUT_OF_STOCK`)
  - `sortBy` (`relevance`, `price_asc`, `price_desc`, `rating`, `newest`, `popularity`)
  - `page` (int, default 0)
  - `size` (int, default 16)
- **Response**: `PagedResponse<ProductSummaryDto>`

### Product Details
- **Method**: `GET`
- **Endpoint**: `/api/products/{id}` or `/api/products/slug/{slug}`
- **Auth**: Public
- **Response**: `ProductDto` (includes dynamic specifications, gallery images, brand, warranty)

### Compare Products
- **Method**: `GET`
- **Endpoint**: `/api/products/compare?ids=1,2,5`
- **Auth**: Public
- **Response**: `List<ProductDto>` (dynamically aligns specifications across up to 4 devices)

---

## 3. Smart Product Finder ("Help Me Choose")

### Recommendation Engine
- **Method**: `POST`
- **Endpoint**: `/api/recommendations`
- **Auth**: Public
- **Request Body**:
```json
{
  "category": "laptop",
  "budget": 80000,
  "usage": ["gaming", "college"],
  "ram": 16,
  "storage": 512,
  "brandPreference": "asus"
}
```
- **Response**:
```json
{
  "success": true,
  "querySummary": "Found 4 top recommendations based on your preferences",
  "recommendations": [
    {
      "id": 6,
      "name": "ASUS ROG Zephyrus G16 (2024)",
      "price": 269990.00,
      "matchScore": 95,
      "matchReasons": [
        "Matches your preferred brand choice: ASUS",
        "Includes your target 16GB+ RAM configuration",
        "Optimized for high-FPS gaming & ray-traced visuals"
      ]
    }
  ]
}
```

---

## 4. PC Builder / Compatibility Checker

### Check Hardware Compatibility
- **Method**: `POST`
- **Endpoint**: `/api/compatibility/check`
- **Auth**: Public
- **Request Body**:
```json
{
  "cpuId": 9,
  "motherboardId": 14,
  "ramId": 11,
  "gpuId": 10,
  "psuId": 13
}
```
- **Response**:
```json
{
  "compatible": true,
  "estimatedWattage": 750,
  "totalPrice": 239997.00,
  "issues": [],
  "recommendations": [
    "CPU and Motherboard socket match (AM5).",
    "RAM type (DDR5) is fully supported by the motherboard."
  ]
}
```

---

## 5. Cart & Wishlist (`/api/cart`, `/api/wishlist`)

### Get Cart
- **Method**: `GET`
- **Endpoint**: `/api/cart`
- **Headers**: `Authorization: Bearer <token>` or `X-Session-ID: <guest-uuid>`

### Add to Cart
- **Method**: `POST`
- **Endpoint**: `/api/cart/items`
- **Request Body**: `{ "productId": 1, "quantity": 1 }`

---

## 6. Orders & Checkout (`/api/orders`)

### Place Order (Transactional)
- **Method**: `POST`
- **Endpoint**: `/api/orders`
- **Auth**: `ROLE_USER`
- **Request Body**:
```json
{
  "addressId": 1,
  "paymentMethod": "CREDIT_CARD",
  "couponCode": "WELCOME10",
  "notes": "Please call before delivery"
}
```

### Cancel Order
- **Method**: `POST`
- **Endpoint**: `/api/orders/{id}/cancel`
- **Request Body**: `{ "reason": "Changed my mind" }`

---

## 7. Admin Backoffice APIs (`/api/admin/*`)

All Admin APIs require `ROLE_ADMIN` authentication token.

- `GET /api/admin/dashboard` - KPI summary, revenue charts, stock alerts
- `GET /api/admin/analytics` - Sales breakdown by category & time
- `POST /api/admin/products` - Add product with specs & images
- `PUT /api/admin/products/{id}` - Edit product
- `DELETE /api/admin/products/{id}` - Remove product
- `PUT /api/admin/products/{id}/stock` - Manual stock restock/adjustment
- `GET /api/admin/orders` - Filter orders by status
- `PUT /api/admin/orders/{id}/status` - Update status with tracking numbers
- `GET /api/admin/customers` - Customer list and spend metrics
- `GET /api/admin/inventory` - Stock transaction logs
- `PUT /api/admin/reviews/{id}/moderate` - Review moderation
- `GET /api/admin/messages` - Customer inquiries
- `POST /api/admin/coupons` - Create promo codes

---

## 8. Health Check (`/api/health`)

- **Method**: `GET`
- **Endpoint**: `/api/health`
- **Auth**: Public
- **Response**:
```json
{
  "status": "UP",
  "database": "UP",
  "timestamp": "2026-09-26T22:30:00"
}
```
