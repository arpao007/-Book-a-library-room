import { verifyToken } from '../services/authService.js';

export function authenticate(req, res, next) {
  const header = req.get('Authorization') ?? '';

  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    res.set('WWW-Authenticate', 'Bearer');
    return res.status(401).json({
      error: 'ต้องเข้าสู่ระบบก่อน',
    });
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    return res.status(401).json({
      error: 'token ไม่ถูกต้องหรือหมดอายุ กรุณาเข้าสู่ระบบใหม่',
    });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      return res.status(403).json({
        error: 'ไม่มีสิทธิ์ทำรายการนี้',
      });
    }

    next();
  };
}