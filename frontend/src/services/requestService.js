import { apiFetch, ApiError } from './apiClient.js';

/**
 * Week 07 — เปลี่ยนจากอ่าน localStorage เป็นเรียก API จริง
 *
 * สังเกตว่า signature ของทุกฟังก์ชันเหมือนเดิมทุกตัว
 * → DashboardPage, RequestDetailPage, NewRequestPage ไม่ต้องแก้เลย
 * นี่คือประโยชน์ของ Service Layer ที่เราสร้างไว้ตั้งแต่ Week 05
 */

export { ApiError };

export async function getRequests(options = {}) {
  // scenario ยังใช้ได้เหมือนเดิม เพื่อให้ทดสอบสถานะต่าง ๆ ได้โดยไม่ต้องแกล้ง API
  if (options.scenario === 'error') {
    throw new ApiError('LAB scenario: จำลองการโหลดข้อมูลไม่สำเร็จ', 500);
  }
  if (options.scenario === 'empty') return [];

  const query = options.status ? `?status=${encodeURIComponent(options.status)}` : '';
  return apiFetch(`/api/advisor-appointments${query}`);
}

export async function getRequestById(requestId) {
  try {
    return await apiFetch(`/api/advisor-appointments/${encodeURIComponent(requestId)}`);
  } catch (error) {
    // 404 ไม่ใช่ความผิดพลาดของระบบ — แปลว่าไม่มีคำร้องรหัสนี้
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function addRequest(requestInput) {
  return apiFetch('/api/advisor-appointments', {
    method: 'POST',
    body: JSON.stringify(requestInput),
  });
}

export async function updateRequestStatus(requestId, status) {
  return apiFetch(`/api/advisor-appointments/${encodeURIComponent(requestId)}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

export async function deleteRequest(requestId) {
  await apiFetch(`/api/advisor-appointments/${encodeURIComponent(requestId)}`, { method: 'DELETE' });
  // คืนรายการล่าสุดจากเซิร์ฟเวอร์ เพื่อให้หน้าจอตรงกับข้อมูลจริงเสมอ
  return getRequests();
}

export async function resetRequests() {
  await apiFetch('/api/advisor-appointments/reset', {
    method: 'POST'
  });

  return getRequests();
}

