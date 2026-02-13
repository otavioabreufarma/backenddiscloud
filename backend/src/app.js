const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");
const passport = require("./config/steam");

const routes = require("./routes");
const { errorMiddleware } = require("./middlewares/error.middleware");
const { rateLimitMiddleware } = require("./middlewares/rateLimit.middleware");

const app = express();

/**
 * =====================================================
 * 🌐 PROXY / CLOUDFARE / DISCLOUD
 * =====================================================
 * OBRIGATÓRIO para cookies secure + session
 */
app.set("trust proxy", 1);

/**
 * =====================================================
 * 🔐 MIDDLEWARES BÁSICOS
 * =====================================================
 */
app.use(helmet());
app.use(cors());
app.use(express.json());

/**
 * =====================================================
 * 🚦 RATE LIMIT
 * (no-op ou limitado, conforme já ajustado)
 * =====================================================
 */
app.use(rateLimitMiddleware);

/**
 * =====================================================
 * 🧠 SESSION (STEAM OPENID DEPENDE DISSO)
 * =====================================================
 * Regras IMPORTANTES:
 * - sameSite: "none"  → redirecionamento cross-site (Steam)
 * - secure: true      → obrigatório com SameSite=None
 * - proxy: true       → Cloudflare / Discloud
 */
app.use(
  session({
    name: "steam.sid",
    secret: process.env.SESSION_SECRET || "dev-session-secret",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "none",      // Steam redirect (cross-site)
      maxAge: 10 * 60 * 1000 // 10 minutos
    }
  })
);

/**
 * =====================================================
 * 🔑 PASSPORT (STEAM)
 * =====================================================
 */
app.use(passport.initialize());
app.use(passport.session());

/**
 * =====================================================
 * 📡 ROTAS
 * =====================================================
 */
app.use("/api", routes);

/**
 * =====================================================
 * ❌ ERROR HANDLER (SEMPRE POR ÚLTIMO)
 * =====================================================
 */
app.use(errorMiddleware);

module.exports = app;