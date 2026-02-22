require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");

const { initDB } = require("./config/db");
const swaggerSpec = require("./config/swagger");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// Security & parsing middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many requests, please try again later." },
});
app.use("/auth", authLimiter);

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/auth", authRoutes);

app.get("/", (_req, res) => {
  const { version } = require("../package.json");

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Authentication API</title>
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      background: #0a0e1a;
      color: #e2e8f0;
      overflow: hidden;
    }

    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background:
        repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(56, 189, 248, 0.03) 50px),
        repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(56, 189, 248, 0.03) 50px);
      pointer-events: none;
      z-index: 0;
    }

    body::after {
      content: '';
      position: fixed;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(ellipse at 30% 20%, rgba(14, 165, 233, 0.08) 0%, transparent 50%),
                  radial-gradient(ellipse at 70% 80%, rgba(6, 182, 212, 0.06) 0%, transparent 50%);
      pointer-events: none;
      z-index: 0;
    }

    .container {
      position: relative;
      z-index: 1;
      text-align: center;
      padding: 3rem 2.5rem;
      max-width: 480px;
      width: 90%;
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(56, 189, 248, 0.12);
      border-radius: 20px;
      backdrop-filter: blur(20px);
      box-shadow: 0 0 60px rgba(14, 165, 233, 0.06), 0 25px 50px rgba(0, 0, 0, 0.4);
    }

    .lock-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 1.5rem;
      position: relative;
    }

    .lock-icon::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 30px;
      height: 24px;
      border: 3.5px solid #38bdf8;
      border-bottom: none;
      border-radius: 15px 15px 0 0;
    }

    .lock-icon::after {
      content: '';
      position: absolute;
      bottom: 6px;
      left: 50%;
      transform: translateX(-50%);
      width: 42px;
      height: 32px;
      background: linear-gradient(135deg, #0ea5e9, #06b6d4);
      border-radius: 6px;
      box-shadow: 0 0 20px rgba(14, 165, 233, 0.3);
    }

    .lock-keyhole {
      position: absolute;
      bottom: 14px;
      left: 50%;
      transform: translateX(-50%);
      width: 8px;
      height: 12px;
      z-index: 2;
    }

    .lock-keyhole::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 8px;
      height: 8px;
      background: #0a0e1a;
      border-radius: 50%;
    }

    .lock-keyhole::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 6px;
      background: #0a0e1a;
      border-radius: 0 0 2px 2px;
    }

    h1 {
      font-size: 1.9rem;
      font-weight: 700;
      letter-spacing: 1.5px;
      background: linear-gradient(135deg, #e0f2fe 0%, #38bdf8 40%, #06b6d4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: none;
      margin-bottom: 0.4rem;
    }

    .version {
      font-size: 0.85rem;
      font-family: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
      color: #06b6d4;
      opacity: 0.8;
      letter-spacing: 2px;
      margin-bottom: 2rem;
    }

    .shield-line {
      width: 60px;
      height: 2px;
      margin: 0 auto 2rem;
      background: linear-gradient(90deg, transparent, #38bdf8, transparent);
      border-radius: 2px;
    }

    .links {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 2rem;
    }

    .btn-primary, .btn-secondary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.8rem 1.6rem;
      border-radius: 10px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      letter-spacing: 0.5px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .btn-primary {
      background: linear-gradient(135deg, #0ea5e9, #0891b2);
      color: #f0f9ff;
      border: 1px solid rgba(56, 189, 248, 0.3);
      box-shadow: 0 0 20px rgba(14, 165, 233, 0.15), 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .btn-primary:hover {
      box-shadow: 0 0 30px rgba(14, 165, 233, 0.3), 0 8px 24px rgba(0, 0, 0, 0.4);
      transform: translateY(-2px);
      background: linear-gradient(135deg, #38bdf8, #06b6d4);
    }

    .btn-secondary {
      background: rgba(15, 23, 42, 0.6);
      color: #94a3b8;
      border: 1px solid rgba(148, 163, 184, 0.15);
    }

    .btn-secondary:hover {
      color: #e2e8f0;
      border-color: rgba(56, 189, 248, 0.3);
      box-shadow: 0 0 15px rgba(14, 165, 233, 0.1);
      transform: translateY(-2px);
    }

    .scan-line {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent 0%, rgba(56, 189, 248, 0.15) 50%, transparent 100%);
      animation: scan 4s ease-in-out infinite;
      pointer-events: none;
      border-radius: 20px;
    }

    @keyframes scan {
      0%, 100% { top: 0; opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { top: 100%; opacity: 0; }
    }

    .sign {
      font-size: 0.8rem;
      color: #475569;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(56, 189, 248, 0.08);
    }

    .sign a {
      color: #38bdf8;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .sign a:hover {
      color: #7dd3fc;
    }

    @media (max-width: 480px) {
      .container { padding: 2rem 1.5rem; }
      h1 { font-size: 1.5rem; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="scan-line"></div>
    <div class="lock-icon"><div class="lock-keyhole"></div></div>
    <h1>Authentication API</h1>
    <p class="version">v\${version}</p>
    <div class="shield-line"></div>
    <div class="links">
      <a href="/api-docs" class="btn-primary">API Documentation</a>
      <a href="/auth/me" class="btn-secondary">Health Check</a>
    </div>
    <footer class="sign">
      Created by
      <a href="https://serkanbayraktar.com/" target="_blank" rel="noopener noreferrer">Serkanby</a>
      |
      <a href="https://github.com/Serkanbyx" target="_blank" rel="noopener noreferrer">Github</a>
    </footer>
  </div>
</body>
</html>`);
});

// Global error handler
app.use(errorHandler);

// Initialize DB and start server
initDB();
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});
