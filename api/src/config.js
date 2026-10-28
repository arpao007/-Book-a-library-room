/**
 * config.js — รวมการอ่าน environment variable ไว้ที่เดียว
 *
 * ทำไมต้องมีไฟล์นี้ (CP36)
 *   - ไม่ให้ค่า config กระจายอยู่ทั่วโค้ด (hardcode)
 *   - แยก dev / production ด้วยค่าเดียว: NODE_ENV
 *   - อ่านค่าจาก process.env ที่เดียว ที่อื่น import จากนี่
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const API_ROOT = path.resolve(HERE, '..');
const jwtSecret = process.env.JWT_SECRET;

if (
  process.env.NODE_ENV === 'production' &&
  !jwtSecret
) {
  throw new Error('JWT_SECRET is required in production');
}
export const config = {
  env: process.env.NODE_ENV ?? 'development',
  isProd: process.env.NODE_ENV === 'production',

  port: Number(process.env.PORT ?? 3001),

  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',

  dbFile: process.env.DB_FILE ?? path.join(API_ROOT, 'data', 'campus.db'),
  schemaFile: path.join(API_ROOT, 'data', 'schema.sql'),

  staticDir: process.env.STATIC_DIR ?? path.join(API_ROOT, '..', 'frontend', 'dist'),

  jwtSecret: jwtSecret || 'dev-only-secret-do-not-use-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '2h',

  // เพิ่ม 2 บรรทัดนี้
  staffEmail: process.env.STAFF_EMAIL,
  staffPassword: process.env.STAFF_PASSWORD,
};