# Online Auction

-   **Base URL:** `https://api.example.com/api/`
-   **Version:** `v1`
-   **Authentication:** JWT Bearer Token (`Authorization: Bearer <token>`)
-   **Content-Type:** `application/json`
-   **Common Status Codes:**
    -   `200` OK
    -   `201` Created
    -   `204` No Content
    -   `400` Bad Request
    -   `401` Unauthorized
    -   `403` Forbidden
    -   `404` Not Found

---

## Authentication

### Register (checked)

<details>
 <summary><code>POST</code> <code><b>auth/register</b></code> <code>(Create new user)</code></summary>

##### Parameters

> | name       | type     | data type | description  |
> | ---------- | -------- | --------- | ------------ |
> | `username` | required | string    | Username     |
> | `password` | required | string    | Password     |
> | `fullname` | required | string    | Display name |
> | `phone`    | required | string    | Phone number |
> | `email`    | required | string    | User email   |

##### Responses

> | http code | content-type       | response                                            |
> | --------- | ------------------ | --------------------------------------------------- |
> | `201`     | `application/json` | `{ "message": "Account created", "userId": "123" }` |
> | `400`     | `application/json` | `{ "error": "Invalid input" }`                      |

</details>

---

### Login (checked)

<details>
<summary><code>POST</code> <code><b>auth/login</b></code> <code?>(Login user)</code></summary>

##### Parameters

> | name       | type     | data type | description |
> | ---------- | -------- | --------- | ----------- |
> | `username` | required | string    | Username    |
> | `password` | required | string    | Password    |

##### Responses

> | http code | content-type       | response                                                  |
> | --------- | ------------------ | --------------------------------------------------------- |
> | `201`     | `application/json` | `{ "message": Signed in successfully", "userId": "123" }` |
> | `400`     | `application/json` | `{ "error": "Invalid input" }`                            |
> | `400`     | `application/json` | `{ "error": "Username or Password is incorrect" }`        |
