import { apiFetch, ApiError } from './apiClient.js';

export { ApiError };

export async function getBookings(options = {}) {
  if (options.scenario === 'error') {
    throw new ApiError('โหลดรายการจองไม่สำเร็จ', 500);
  }
  if (options.scenario === 'empty') return [];

  const query = options.status
    ? `?status=${encodeURIComponent(options.status)}`
    : '';
  return apiFetch(`/api/bookings${query}`);
}

export async function getBookingById(bookingId) {
  try {
    return await apiFetch(`/api/bookings/${encodeURIComponent(bookingId)}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export function createBooking(booking) {
  return apiFetch('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(booking),
  });
}

export function updateBooking(bookingId, booking) {
  return apiFetch(`/api/bookings/${encodeURIComponent(bookingId)}`, {
    method: 'PUT',
    body: JSON.stringify(booking),
  });
}

export function cancelBooking(bookingId) {
  return apiFetch(`/api/bookings/${encodeURIComponent(bookingId)}`, {
    method: 'DELETE',
  });
}

export function approveBooking(bookingId) {
  return apiFetch(`/api/bookings/${encodeURIComponent(bookingId)}/approve`, {
    method: 'PATCH',
  });
}

export function rejectBooking(bookingId) {
  return apiFetch(`/api/bookings/${encodeURIComponent(bookingId)}/reject`, {
    method: 'PATCH',
  });
}

export async function getRooms() {
  return apiFetch('/api/rooms');
}

export async function getRoomById(roomId) {
  try {
    return await apiFetch(`/api/rooms/${encodeURIComponent(roomId)}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export function createRoom(room) {
  return apiFetch('/api/rooms', {
    method: 'POST',
    body: JSON.stringify(room),
  });
}

export function updateRoom(roomId, room) {
  return apiFetch(`/api/rooms/${encodeURIComponent(roomId)}`, {
    method: 'PUT',
    body: JSON.stringify(room),
  });
}

export function deleteRoom(roomId) {
  return apiFetch(`/api/rooms/${encodeURIComponent(roomId)}`, {
    method: 'DELETE',
  });
}

export function login(credentials) {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export function register(user) {
  return apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(user),
  });
}
