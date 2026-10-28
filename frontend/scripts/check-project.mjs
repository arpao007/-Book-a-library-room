import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const checks = [];

async function fileExists(file) {
  try {
    await access(path.join(root, file));
    return true;
  } catch {
    return false;
  }
}

async function source(file) {
  return readFile(path.join(root, file), 'utf8');
}

function check(condition, message) {
  checks.push({ passed: Boolean(condition), message });
}

const requiredFiles = [
  'src/App.jsx',
  'src/services/bookingService.js',
  'src/pages/DashboardPage.jsx',
  'src/pages/RoomListPage.jsx',
  'src/pages/RoomDetailsPage.jsx',
  'src/pages/BookingHistoryPage.jsx',
  'src/pages/StaffBookingManagementPage.jsx',
  'src/pages/BookingDetailPage.jsx',
  'src/components/BookingForm.jsx',
  'src/components/BookingList.jsx',
];

for (const file of requiredFiles) {
  check(await fileExists(file), `Required Library Room Booking file exists: ${file}`);
}

const app = await source('src/App.jsx');
for (const route of [
  'rooms',
  'rooms/:roomId',
  'bookings/new',
  'bookings/history',
  'bookings/:bookingId',
  'staff/bookings',
]) {
  check(app.includes(`path="${route}"`), `Route configured: /${route}`);
}

const service = await source('src/services/bookingService.js');
for (const endpoint of [
  '/api/bookings',
  '/api/rooms',
  '/api/auth/login',
  '/api/auth/register',
]) {
  check(service.includes(endpoint), `API service uses ${endpoint}`);
}

const allFrontendFiles = [
  ...requiredFiles,
  'src/components/AppHeader.jsx',
  'src/components/BookingCard.jsx',
];
const staleTerms = /\b(?:New Request|Request List|Request ID|Request Type|Requester|คำร้อง|นัดหมาย)\b/i;
for (const file of allFrontendFiles) {
  const contents = await source(file);
  check(!staleTerms.test(contents), `No request-management labels in ${file}`);
}

const failed = checks.filter((entry) => !entry.passed);
for (const entry of checks) {
  console.log(`${entry.passed ? '✓' : '✗'} ${entry.message}`);
}

if (failed.length) {
  console.error(`\n${failed.length} frontend checks failed.`);
  process.exitCode = 1;
} else {
  console.log(`\n${checks.length} frontend checks passed.`);
}
