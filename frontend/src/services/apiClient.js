/**
 * ตัวกลางสำหรับคุยกับ API — ที่เดียวที่เรียก fetch()
 * ทุกฟังก์ชันใน requestService เรียกผ่านตรงนี้
 */

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? '';

/** error ที่รู้ว่ามาจาก API พร้อม status ที่ได้กลับมา */
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function parseError(response) {
  try {
    const body = await response.json();
    return body.error ?? `คำขอไม่สำเร็จ (${response.status})`;
  } catch {
    return `คำขอไม่สำเร็จ (${response.status})`;
  }
}

export async function apiFetch(path, options = {}) {
  let response;

  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new ApiError(
      'ติดต่อเซิร์ฟเวอร์ไม่ได้ — ตรวจว่าเปิด API ที่พอร์ต 3001 แล้วหรือยัง',
      0
    );
  }

  if (!response.ok) {
  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  throw new ApiError(await parseError(response), response.status);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}