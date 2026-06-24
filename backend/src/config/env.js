"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _dotenv = require('dotenv'); var _dotenv2 = _interopRequireDefault(_dotenv);
_dotenv2.default.config();

 const config = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_secret_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  database: {
    url: process.env.DATABASE_URL || '',
  },
}; exports.config = config;

exports. default = exports.config;
