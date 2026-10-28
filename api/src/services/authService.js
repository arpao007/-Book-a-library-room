import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { findUserByEmail } from './requestService.js';
import { verifyPassword } from '../utils/password.js';

export function login(email, password) {
  // Production ใช้ ENV
  if (config.isProd) {
    if (
      email !== config.staffEmail ||
      password !== config.staffPassword
    ) {
      return null;
    }

    const payload = {
      sub: 'staff',
      name: 'เจ้าหน้าที่',
      role: 'staff',
    };

    const token = jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    return {
      token,
      user: {
        id: 'staff',
        name: 'เจ้าหน้าที่',
        role: 'staff',
      },
    };
  }

  // Development / Test ใช้แบบเดิม
  const user = findUserByEmail(email);

  if (
    !user ||
    user.role !== 'staff' ||
    !verifyPassword(password, user.passwordHash)
  ) {
    return null;
  }

  const payload = {
    sub: String(user.id),
    name: user.name,
    role: user.role,
  };

  const token = jwt.sign(
    payload,
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
    },
  };
}
export function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret);
}