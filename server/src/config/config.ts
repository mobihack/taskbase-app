import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});

export const config = {
  runMigrations: false,
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  cors_origin: process.env.CORS_ORIGIN,

  jwtExpiry: 3 * 60 * 60, // 3 hours
  cookieExpiry: 3 * 60 * 60, // 3 hours
};
