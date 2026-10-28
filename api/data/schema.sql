-- ═══════════════════════════════════════════════════════════
-- Advisor Queue System — ระบบคิวพบอาจารย์ที่ปรึกษา
-- ═══════════════════════════════════════════════════════════

PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS advisor_appointments;
DROP TABLE IF EXISTS advisors;
DROP TABLE IF EXISTS users;

-- ตาราง users — นักศึกษาและเจ้าหน้าที่
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'requester'
    CHECK (role IN ('requester', 'staff')),
  password_hash TEXT
);

CREATE TABLE advisors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  room TEXT NOT NULL
);

CREATE TABLE advisor_appointments (
  id TEXT PRIMARY KEY,
  requester_id INTEGER NOT NULL,
  advisor_id INTEGER NOT NULL,
  request_type TEXT NOT NULL
    CHECK (
      request_type IN (
        'ปรึกษาโครงงาน',
        'วางแผนการเรียน',
        'ขอคำปรึกษาวิชาการ',
        'อื่น ๆ'
      )
    ),

  location TEXT NOT NULL,
  details TEXT NOT NULL,

  priority TEXT NOT NULL DEFAULT 'normal'
    CHECK (priority IN ('normal','urgent')),

  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','in-progress','completed')),

  created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),

FOREIGN KEY (requester_id) REFERENCES users(id),
FOREIGN KEY (advisor_id) REFERENCES advisors(id)
);

-- ข้อมูลผู้ใช้ตัวอย่าง
INSERT INTO users (name, department, email) VALUES

  ('ณัฐพล แซ่วั่ง',       'วิศวกรรมซอฟต์แวร์', 'student1@rmutl.ac.th'),
  ('สุวิมนต์ ไชยเดช',     'วิศวกรรมซอฟต์แวร์', 'student2@rmutl.ac.th'),
  ('กิตติศักดิ์ ใจดี',    'วิศวกรรมซอฟต์แวร์', 'student3@rmutl.ac.th'),
  ('อาจารย์ที่ปรึกษา',    'วิศวกรรมซอฟต์แวร์', 'advisor@rmutl.ac.th');

-- บัญชีเจ้าหน้าที่
INSERT INTO users (name, department, email, role, password_hash) VALUES
  ('เจ้าหน้าที่ฝ่ายบริการ', 'งานวิชาการ', 'staff@rmutl.ac.th', 'staff',
   'scrypt$5e1f0c3a9b7d2e4f6a8c0b1d3e5f7a9c$2f81bcd58254b475f16ddaf1e278338fa0990ed132f8b206d0a88cb4108b6b4f90df05c0d97166e2a108ab36bf3d81f7884165fff13d4ec42a67cfa36771bc38');

INSERT INTO advisors (name, room) VALUES
('อาจารย์ที่ปรึกษา', 'SW-401'),
('อาจารย์ประจำหลักสูตร', 'SW-402');

INSERT INTO advisor_appointments
(
  id,
  requester_id,
  advisor_id,
  request_type,
  location,
  details,
  priority,
  status
)
VALUES

('REQ-001', 1, 1,
 'ปรึกษาโครงงาน',
 'ห้องพักอาจารย์ SW-401',
 'ขอปรึกษาความคืบหน้าโครงงานวิชา ENGSE203',
 'normal',
 'pending'),

('REQ-002', 2, 1,
 'วางแผนการเรียน',
 'ห้องพักอาจารย์ SW-401',
 'ขอคำแนะนำเกี่ยวกับแผนการลงทะเบียนภาคการศึกษาถัดไป',
 'normal',
 'in-progress'),

('REQ-003', 3, 2,
 'ขอคำปรึกษาวิชาการ',
 'ห้องพักอาจารย์ SW-402',
 'ปรึกษาเรื่องการฝึกงานและการเตรียม Portfolio',
 'normal',
 'completed'),

('REQ-004', 1, 1,
 'ปรึกษาโครงงาน',
 'ห้องพักอาจารย์ SW-401',
 'ขอคำแนะนำเรื่องการออกแบบฐานข้อมูล',
 'urgent',
 'pending'),

('REQ-005', 2, 2,
 'อื่น ๆ',
 'ห้องพักอาจารย์ SW-403',
 'สอบถามเรื่องเอกสารประกอบการสำเร็จการศึกษา',
 'normal',
 'pending');

CREATE INDEX IF NOT EXISTS idx_advisor_appointments_status
ON advisor_appointments(status);

CREATE INDEX IF NOT EXISTS idx_advisor_appointments_requester
ON advisor_appointments(requester_id);

CREATE INDEX IF NOT EXISTS idx_advisor_appointments_advisor
ON advisor_appointments(advisor_id);
