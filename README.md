# 🔐 Authentication API

A JWT-based user authentication REST API built with Node.js, Express, and SQLite. Features secure password hashing, token-based authentication, protected routes, and interactive Swagger documentation.

[![Created by Serkanby](https://img.shields.io/badge/Created%20by-Serkanby-blue?style=flat-square)](https://serkanbayraktar.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Serkanbyx-181717?style=flat-square&logo=github)](https://github.com/Serkanbyx)

## Features

- **User Registration**: Email uniqueness validation and bcrypt password hashing (12 salt rounds)
- **User Login**: Secure password comparison with JWT access token generation
- **Protected Routes**: Middleware-based route protection with Bearer token authentication
- **Swagger UI**: Interactive API documentation and testing at `/api-docs`
- **Security Hardened**: Helmet headers, CORS, and rate limiting (20 req/15min)
- **Zero DB Setup**: SQLite file-based database — no external database installation required
- **Global Error Handling**: Centralized error handler with consistent JSON responses
- **Clean Architecture**: MVC-like layered structure (Routes → Controllers → Models)

## Live Demo

[🚀 View Live API](https://authentication-api-3bfr.onrender.com)

[📖 View Swagger Docs](https://authentication-api-3bfr.onrender.com/api-docs)

> **Note:** Free tier instance spins down after inactivity. First request may take ~50 seconds to wake up.

## Technologies

- **Node.js**: JavaScript runtime environment
- **Express.js v5**: Fast, minimalist web framework for REST APIs
- **SQLite (better-sqlite3)**: Lightweight, file-based relational database
- **JSON Web Token (JWT)**: Stateless token-based authentication
- **bcryptjs**: Industry-standard password hashing with salt rounds
- **Swagger (swagger-jsdoc + swagger-ui-express)**: Auto-generated API documentation
- **Helmet**: HTTP security headers middleware
- **express-rate-limit**: Request rate limiting for brute-force protection
- **CORS**: Cross-Origin Resource Sharing configuration
- **dotenv**: Environment variable management

## Installation

### Local Development

1. **Clone the repository:**

```bash
git clone https://github.com/Serkanbyx/authentication-api.git
cd authentication-api
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create environment file:**

```bash
cp .env.example .env
```

4. **Edit `.env` and set your JWT secret:**

```env
PORT=5000
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
```

5. **Start the development server:**

```bash
npm run dev
```

6. **For production:**

```bash
npm start
```

The server will start at `http://localhost:5000` and Swagger docs will be available at `http://localhost:5000/api-docs`.

## Usage

1. Open Swagger UI at `/api-docs`
2. **Register** a new user with `POST /auth/register` (provide email and password)
3. **Login** with `POST /auth/login` to receive a JWT token
4. Click the **"Authorize"** button at the top of Swagger UI
5. Paste your token and click **"Authorize"**
6. **Access** the protected `GET /auth/me` endpoint to retrieve your user info

## API Endpoints

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Register a new user | No |
| `POST` | `/auth/login` | Login and receive JWT token | No |
| `GET` | `/auth/me` | Get authenticated user info | Yes (Bearer Token) |

### Request & Response Examples

**Register:**

```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secret123"
}
```

```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "user": { "id": 1, "email": "user@example.com", "created_at": "2026-02-20 18:42:46" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Login:**

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secret123"
}
```

**Get Me (Protected):**

```bash
GET /auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Error Responses

| Status Code | Message | When |
| --- | --- | --- |
| `400` | Please provide email and password. | Login with missing fields |
| `400` | Password must be at least 6 characters. | Register with short password |
| `400` | Please provide a valid email address. | Register with invalid email format |
| `401` | Invalid email or password. | Login with wrong credentials |
| `401` | Access denied. No token provided. | Protected route without token |
| `401` | Invalid or expired token. | Protected route with bad/expired token |
| `401` | User belonging to this token no longer exists. | Token valid but user deleted |
| `409` | This email is already registered. | Register with duplicate email |
| `429` | Too many requests, please try again later. | Rate limit exceeded (20 req/15min) |
| `500` | Internal server error | Unexpected server error |

## How It Works?

### Authentication Flow

```
Register: Client → POST /auth/register → Hash password → Save to DB → Return JWT
Login:    Client → POST /auth/login → Verify password → Return JWT
Auth:     Client → GET /auth/me + Bearer Token → Verify JWT → Return user data
```

### Password Hashing

Passwords are never stored in plain text. bcrypt hashes the password with 12 salt rounds before saving to the database. During login, `bcrypt.compare()` verifies the plain password against the stored hash.

### JWT Token Structure

The token payload contains the user ID and expiration time. The server signs it with `JWT_SECRET` and verifies it on every protected request via the `protect` middleware.

### Middleware Pipeline

```
Request → Helmet → CORS → JSON Parser → Rate Limiter → Route Handler → Error Handler
                                                            ↓
                                              (Protected routes only)
                                              Auth Middleware → Verify Token → Set req.user
```

## Project Structure

```
src/
├── config/
│   ├── db.js               # SQLite connection and table creation
│   └── swagger.js           # Swagger/OpenAPI configuration
├── controllers/
│   └── authController.js    # Register, Login, GetMe business logic
├── middlewares/
│   ├── auth.js              # JWT verification middleware (protect)
│   └── errorHandler.js      # Global error handling middleware
├── models/
│   └── User.js              # User data operations (SQLite queries)
├── routes/
│   └── authRoutes.js        # Route definitions + Swagger JSDoc
├── utils/
│   └── token.js             # JWT generate & verify helpers
└── server.js                # Application entry point
data/
└── auth.db                  # SQLite database file (auto-created)
```

## Environment Variables

| Variable | Description | Default |
| --- | --- | --- |
| `PORT` | Server port number | `5000` |
| `JWT_SECRET` | Secret key for signing JWT tokens | — (required) |
| `JWT_EXPIRES_IN` | Token expiration duration | `7d` |

## Deploy

### Render

1. Connect your GitHub repository on [render.com](https://render.com)
2. Select **"Web Service"**
3. Set **Build Command:** `npm install`
4. Set **Start Command:** `node src/server.js`
5. Add environment variables (`JWT_SECRET`, `JWT_EXPIRES_IN`) in the dashboard
6. Click **"Create Web Service"**

### Railway

1. Connect your GitHub repository on [railway.app](https://railway.app)
2. Railway auto-detects Node.js
3. Add environment variables in the dashboard
4. Deploy triggers automatically on push

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m "feat: add amazing feature"`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

**Commit message format:** `feat:` / `fix:` / `refactor:` / `docs:` / `chore:`

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## Developer

**Serkan Bayraktar**

- Website: [serkanbayraktar.com](https://serkanbayraktar.com)
- GitHub: [@Serkanbyx](https://github.com/Serkanbyx)
- Email: [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)

## Contact

- For bugs and feature requests, please [open an issue](https://github.com/Serkanbyx/authentication-api/issues)
- Email: [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)
- Website: [serkanbayraktar.com](https://serkanbayraktar.com)

---

⭐ If you like this project, don't forget to give it a star!
