# Online Auction API Documentation

-   **Base URL:** `http://localhost:8080/api/`
-   **Version:** `v1`
-   **Authentication:**
    -   Access Token: JWT Bearer Token (`Authorization: Bearer <token>`)
    -   Refresh Token: HttpOnly Cookie (`refreshToken`)
-   **Content-Type:** `application/json`

---

## Authentication

### Register
<details>
 <summary><code>POST</code> <code><b>register</b></code> <code>(Create new user)</code></summary>

##### Body
| Name | Type | Description |
|Data Type|Required|Description|
|---|---|---|
| `email` | string | **Required**. User email |
| `password` | string | **Required**. Password |
| `name` | string | **Required**. Full name |
| `phone` | string | **Required**. Phone number |
| `address` | string | **Required**. Address |
| `captchaToken` | string | **Required**. reCAPTCHA token |

##### Responses
| Code | Description |
|---|---|
| `201` | Account created. Please check your email for OTP. |
| `400` | reCAPTCHA failed or Invalid input |
| `422` | User with that email or phone already exists |
| `500` | Internal Server Error |
</details>

### Verify OTP
<details>
 <summary><code>POST</code> <code><b>verify-otp</b></code> <code>(Verify account)</code></summary>

##### Body
| Name | Type | Description |
|---|---|---|
| `email` | string | **Required**. User email |
| `otp` | string | **Required**. OTP Code |

##### Responses
| Code | Description |
|---|---|
| `200` | Account verified successfully |
| `400` | Invalid OTP or OTP expired |
| `404` | User not found |
</details>

### Login
<details>
 <summary><code>POST</code> <code><b>login</b></code> <code>(Login user)</code></summary>

##### Body
| Name | Type | Description |
|---|---|---|
| `email` | string | **Required**. User email |
| `password` | string | **Required**. Password |

##### Responses
| Code | Description |
|---|---|
| `200` | Login successful. Returns `user` object and `accessToken`. Sets `refreshToken` cookie. |
| `401` | Invalid username or password |
| `404` | Invalid username or password |
</details>

### Refresh Token
<details>
 <summary><code>POST</code> <code><b>refresh</b></code> <code>(Get new access token)</code></summary>

##### Cookies
| Name | Description |
|---|---|
| `refreshToken` | **Required**. HttpOnly cookie containing the refresh token |

##### Responses
| Code | Description |
|---|---|
| `200` | Returns new `accessToken` |
| `401` | Refresh Token is required |
| `403` | Invalid Refresh Token |
</details>

### Logout
<details>
 <summary><code>POST</code> <code><b>logout</b></code> <code>(Logout user)</code></summary>

##### Cookies
| Name | Description |
|---|---|
| `refreshToken` | **Required**. HttpOnly cookie to be cleared |

##### Responses
| Code | Description |
|---|---|
| `200` | Logged out successfully |
</details>

---

## Products

### Get All Products
<details>
 <summary><code>GET</code> <code><b>products</b></code> <code>(List products with pagination)</code></summary>

##### Query Parameters
| Name | Type | Description |
|---|---|---|
| `page` | integer | Page number (default: 1) |
| `limit` | integer | Items per page (default: 12) |
| `sort` | string | Sort order: `default` (newest), `price_asc`, `time_desc` |

##### Responses
| Code | Description |
|---|---|
| `200` | Returns `{ totalItems, totalPages, currentPage, products: [...] }` |
</details>

### Search Products
<details>
 <summary><code>GET</code> <code><b>products/search</b></code> <code>(Full-text search)</code></summary>

##### Query Parameters
| Name | Type | Description |
|---|---|---|
| `q` | string | **Required**. Search query |
| `page` | integer | Page number (default: 1) |
| `limit` | integer | Items per page (default: 12) |
| `sort` | string | Sort order |

##### Responses
| Code | Description |
|---|---|
| `200` | Returns `{ totalItems, totalPages, currentPage, products: [...] }` |
| `400` | Search query is required |
</details>

### Get Product by ID
<details>
 <summary><code>GET</code> <code><b>products/:id</b></code> <code>(Get product details)</code></summary>

##### Parameters
| Name | Type | Description |
|---|---|---|
| `id` | integer | Product ID |

##### Responses
| Code | Description |
|---|---|
| `200` | Returns product object with `bids`, `images`, `seller`, `category`, `current_winner` |
| `404` | Product not found |
</details>

### Get Products by Category
<details>
 <summary><code>GET</code> <code><b>products/category/:id</b></code> <code>(List products in category)</code></summary>

##### Parameters
| Name | Type | Description |
|---|---|---|
| `id` | integer | Category ID |

##### Query Parameters
| Name | Type | Description |
|---|---|---|
| `page` | integer | Page number |
| `limit` | integer | Items per page |
| `sort` | string | Sort order |

##### Responses
| Code | Description |
|---|---|
| `200` | Returns `{ totalItems, totalPages, currentPage, products: [...] }` |
</details>

### Get Featured Products
<details>
 <summary><code>GET</code> <code><b>products/latest-bidded</b></code> <code>(Top 5 latest bidded)</code></summary>
 <summary><code>GET</code> <code><b>products/most-bidded</b></code> <code>(Top 5 most bidded)</code></summary>
 <summary><code>GET</code> <code><b>products/highest-price</b></code> <code>(Top 5 highest price)</code></summary>

##### Responses
| Code | Description |
|---|---|
| `200` | Returns array of top 5 products |
</details>

---

## Categories

### Get All Categories
<details>
 <summary><code>GET</code> <code><b>categories</b></code> <code>(List all categories)</code></summary>

##### Responses
| Code | Description |
|---|---|
| `200` | Returns array of categories with `subcategories` |
</details>

### Get Category by ID
<details>
 <summary><code>GET</code> <code><b>categories/:id</b></code> <code>(Get category details)</code></summary>

##### Parameters
| Name | Type | Description |
|---|---|---|
| `id` | integer | Category ID |

##### Responses
| Code | Description |
|---|---|
| `200` | Returns category object |
| `404` | Category not found |
</details>

---

## User Profile (Protected)

**Headers:** `Authorization: Bearer <accessToken>`

### Get Profile
<details>
 <summary><code>GET</code> <code><b>user/profile</b></code> <code>(Get user info)</code></summary>

##### Responses
| Code | Description |
|---|---|
| `200` | Returns user object |
| `404` | User not found |
</details>

### Update Profile
<details>
 <summary><code>PUT</code> <code><b>user/profile</b></code> <code>(Update user info)</code></summary>

##### Body
| Name | Type | Description |
|---|---|---|
| `name` | string | Optional. New name |
| `email` | string | Optional. New email |
| `oldPassword` | string | Required if setting new password |
| `newPassword` | string | Optional. New password |

##### Responses
| Code | Description |
|---|---|
| `200` | Profile updated successfully |
| `400` | Incorrect old password or missing requirements |
</details>

### User Lists
<details>
 <summary><code>GET</code> <code><b>user/watchlist</b></code> <code>(Get watchlist)</code></summary>
 <summary><code>GET</code> <code><b>user/participating</b></code> <code>(Get participating auctions)</code></summary>
 <summary><code>GET</code> <code><b>user/won</b></code> <code>(Get won auctions)</code></summary>

##### Responses
| Code | Description |
|---|---|
| `200` | Returns array of products |
</details>

### User Ratings
<details>
 <summary><code>GET</code> <code><b>user/ratings</b></code> <code>(Get received ratings)</code></summary>

##### Responses
| Code | Description |
|---|---|
| `200` | Returns array of feedback objects with `reviewer` and `product` info |
</details>
