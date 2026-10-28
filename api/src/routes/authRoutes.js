import { Router } from 'express';
import * as authService from '../services/authService.js';
import { validateLoginInput } from '../validators/requestValidator.js';

const router = Router();

const attempts = new Map();

export function resetLoginLimiter() {
  attempts.clear();
}

router.post('/login', (req, res) => {
  const key = req.ip ?? 'local';
  const now = Date.now();

  const record = attempts.get(key);

  if (
    record &&
    record.count >= 5 &&
    now - record.firstAttempt < 15 * 60 * 1000
  ) {
    return res.status(429).json({
      error: 'พยายามเข้าสู่ระบบมากเกินไป กรุณาลองใหม่ภายหลัง'
    });
  }

  const errors = validateLoginInput(req.body);

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'ข้อมูลเข้าสู่ระบบไม่ถูกต้อง',
      details: errors
    });
  }

  const result = authService.login(
    req.body.email,
    req.body.password
  );

  if (!result) {
    if (!record || now - record.firstAttempt > 15 * 60 * 1000) {
      attempts.set(key, {
        count: 1,
        firstAttempt: now
      });
    } else {
      record.count += 1;
    }

    return res.status(401).json({
      error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
    });
  }

  attempts.delete(key);

  res.status(200).json(result);
});

export default router;