import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { loadSeed } from '../../src/services/requestService.js';
import { STAFF, loginAsStaff, tokenFor } from '../helpers/auth.js';

/**
 * Week 13 — เข้าสู่ระบบและสิทธิ์
 * test 3 ข้อแรกให้มาแล้ว — จะ fail จนกว่าจะทำ CP50–CP51 เสร็จ (เขียน test ก่อน แล้วทำให้ผ่าน)
 */
const app = createApp();
beforeEach(async () => { await loadSeed(); });

describe('POST /api/auth/login', () => {
  test('อีเมลและรหัสผ่านถูก → 200 พร้อม token', async () => {
    const r = await request(app).post('/api/auth/login').send(STAFF);
    expect(r.status).toBe(200);
    expect(r.body.token.split('.')).toHaveLength(3);
  });
  test('รหัสผ่านผิด → 401', async () => {
    const r = await request(app).post('/api/auth/login').send({ ...STAFF, password: 'nope1234' });
    expect(r.status).toBe(401);
  });

  // 🏫 TODO W13-LOGIN (CP50): อีเมลที่ไม่มี ต้องได้ข้อความ error เดียวกับรหัสผ่านผิด
});

describe('สิทธิ์ของ PUT / DELETE', () => {
  test('token ปลอม → 401', async () => {
  const r = await request(app)
    .put('/api/advisor-appointments/REQ-001')
    .set(
      'Authorization',
      `Bearer ${tokenFor('staff', 'not-the-real-secret')}`
    )
    .send({ status: 'completed' });

  expect(r.status).toBe(401);
});

test('ไม่ใช่เจ้าหน้าที่ → 403', async () => {
  const r = await request(app)
    .put('/api/advisor-appointments/REQ-001')
    .set(
      'Authorization',
      `Bearer ${tokenFor('requester')}`
    )
    .send({ status: 'completed' });

  expect(r.status).toBe(403);
});
});