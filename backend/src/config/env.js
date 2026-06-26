"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _dotenv = require('dotenv'); var _dotenv2 = _interopRequireDefault(_dotenv);
_dotenv2.default.config();

// ── JWT_SECRET validation ──────────────────────────────────────────────────
// In production the server must never fall back to a predictable secret.
// We fail fast here — at config-load time — before any routes are registered.
const _nodeEnv = process.env.NODE_ENV || 'development';
const _jwtSecret = process.env.JWT_SECRET;

if (!_jwtSecret) {
  if (_nodeEnv === 'production') {
    // Hard crash: a predictable JWT secret in production is a critical security risk.
    console.error('❌  FATAL: JWT_SECRET environment variable is not set. Refusing to start in production.');
    process.exit(1);
  } else {
    // Loud warning so developers notice the missing env var during local work.
    console.warn(
      '\n⚠️  WARNING: JWT_SECRET is not set. Using an insecure local-only fallback.\n' +
      '   Set JWT_SECRET in your .env file before deploying to production.\n'
    );
  }
}

 const config = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: _nodeEnv,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwt: {
    // No fallback in production (process already exited above).
    // In dev/test the weak local secret is acceptable for convenience only.
    secret: _jwtSecret || 'DEV_ONLY_insecure_local_secret__do_not_use_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  database: {
    url: process.env.DATABASE_URL || '',
  },
}; exports.config = config;

exports. default = exports.config;
