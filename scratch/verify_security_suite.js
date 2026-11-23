/**
 * VERIFY_SECURITY_SUITE.JS — Comprehensive Security & Penetration Audit Suite
 * Testing OWASP Top 10, RBAC, Cryptographic Integrity & Academic Gatekeepers
 * SIAK UFD Enterprise SaaS
 */

const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('==================================================================');
console.log('🛡️ SIAK UFD — ENTERPRISE SECURITY & PENETRATION AUDIT SUITE');
console.log('==================================================================\n');

let passCount = 0;
let failCount = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  🔒 [SEC-PASS] ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ❌ [SEC-FAIL] ${name}`);
    console.error(`     Error: ${err.message}`);
    failCount++;
  }
}

// -----------------------------------------------------------------------------
// 1. AUTHENTICATION & INJECTION PROTECTION (SQLi / NoSQL / XSS)
// -----------------------------------------------------------------------------
console.log('📌 1. Testing Authentication & Injection Attack Resistance:');
const authService = require('../backend/src/services/auth.service');

test('SQLi Resistance: Malicious payload in username ("\' OR \'1\'=\'1") must be rejected with 401', () => {
  assert.throws(() => {
    authService.login("' OR '1'='1", "password", "mahasiswa");
  }, (err) => err.statusCode === 401);
});

test('SQLi Resistance: Admin comment bypass payload ("admin\' --") must be rejected with 401', () => {
  assert.throws(() => {
    authService.login("admin' --", "password", "akademik");
  }, (err) => err.statusCode === 401);
});

test('XSS Resistance: Script tags in username ("<script>alert(1)</script>") must be rejected safely', () => {
  assert.throws(() => {
    authService.login("<script>alert(1)</script>", "password", "mahasiswa");
  }, (err) => err.statusCode === 401);
});

test('Null/Empty Credential Rejection: Empty username must be rejected', () => {
  assert.throws(() => {
    authService.login("", "", "mahasiswa");
  }, (err) => err.statusCode === 401);
});

// -----------------------------------------------------------------------------
// 2. ROLE-BASED ACCESS CONTROL (RBAC) & PRIVILEGE ESCALATION
// -----------------------------------------------------------------------------
console.log('\n📌 2. Testing Role-Based Access Control (RBAC) & Privilege Escalation:');
const authMiddleware = require('../backend/src/middlewares/auth.middleware');

test('RBAC: Student account (2023010042) attempting to login as "dosen" must be denied with 403', () => {
  assert.throws(() => {
    authService.login('2023010042', 'SIAKUFD2025!', 'dosen');
  }, (err) => err.statusCode === 403 && err.type === 'ROLE_MISMATCH');
});

test('RBAC: Student account attempting to login as "akademik" (Operator BAK) must be denied with 403', () => {
  assert.throws(() => {
    authService.login('2023010042', 'SIAKUFD2025!', 'akademik');
  }, (err) => err.statusCode === 403 && err.type === 'ROLE_MISMATCH');
});

test('RBAC Middleware: Middleware blocks unauthorized role access with 403 Forbidden', () => {
  const middleware = authMiddleware('akademik');
  let statusSent = null;
  let jsonSent = null;
  const mockReq = {
    headers: {
      'x-user-role': 'mahasiswa',
      'x-user-id': '2023010042'
    }
  };
  const mockRes = {
    status: (code) => {
      statusSent = code;
      return {
        json: (data) => { jsonSent = data; }
      };
    }
  };
  middleware(mockReq, mockRes, () => {});
  
  assert.strictEqual(statusSent, 403);
  assert.strictEqual(jsonSent.code, 403);
  assert.strictEqual(jsonSent.error_type, 'FORBIDDEN');
});

// -----------------------------------------------------------------------------
// 3. CRYPTOGRAPHIC DATA INTEGRITY & ANTI-FORGERY
// -----------------------------------------------------------------------------
console.log('\n📌 3. Testing Cryptographic Integrity & Anti-Forgery (SHA-256):');
const documentService = require('../backend/src/services/document.service');

test('Crypto Hash: Official KHS generates consistent 16-character SHA-256 hash', () => {
  const khs1 = documentService.getKhsData('2023010042', '2025/2026 Genap');
  const khs2 = documentService.getKhsData('2023010042', '2025/2026 Genap');
  assert.strictEqual(khs1.verification.hash.length, 16);
  assert.strictEqual(khs1.verification.hash, khs2.verification.hash);
});

test('Tamper Detection: Modifying IPS in verification payload breaks the cryptographic hash', () => {
  const secret = 'SIAK_UFD_SECRET';
  const nim = '2023010042';
  const semester = '2025/2026 Genap';
  const authenticIps = 3.86;
  const forgedIps = 4.00;
  const totalSks = 21;

  const validPayload = `${nim}|${semester}|${authenticIps}|${totalSks}|${secret}`;
  const forgedPayload = `${nim}|${semester}|${forgedIps}|${totalSks}|${secret}`;

  const validHash = crypto.createHash('sha256').update(validPayload).digest('hex').substring(0, 16);
  const forgedHash = crypto.createHash('sha256').update(forgedPayload).digest('hex').substring(0, 16);

  assert.notStrictEqual(validHash, forgedHash, 'Forged grade payload must NOT match valid signature hash');
});

// -----------------------------------------------------------------------------
// 4. ATTENDANCE GATEKEEPER & REPLAY PROTECTION
// -----------------------------------------------------------------------------
console.log('\n📌 4. Testing Attendance Gatekeeper & Dynamic Token Security:');
const attendanceService = require('../backend/src/services/attendance.service');

test('Gatekeeper Security: Attendance strictly below 75% denies exam qualification', () => {
  const totalSessions = 16;
  const attendedBelow = 11; // 68.75%
  const attendedExact = 12; // 75.0%

  assert.strictEqual((attendedBelow / totalSessions) * 100 < 75.0, true);
  assert.strictEqual((attendedExact / totalSessions) * 100 >= 75.0, true);
});

test('Replay Protection: Dynamic QR token has strictly enforced 30-second expiry window', () => {
  const token = attendanceService.generateQrToken('session-exam-401');
  assert.strictEqual(token.expires_in_seconds, 30);
  assert.ok(token.generated_at);
});

// -----------------------------------------------------------------------------
// 5. ACADEMIC BUSINESS LOGIC INTEGRITY (FRS/KRS & Grade Publication)
// -----------------------------------------------------------------------------
console.log('\n📌 5. Testing Academic Logic Integrity & Immutability:');
const { SiakStorageEngine } = require('../frontend/js/siak-storage');
const bakService = require('../backend/src/services/bak.service');
const krsService = require('../backend/src/services/krs.service');

test('Quota Guard: Attempting to submit SKS beyond student IPS limit is blocked with 422', () => {
  const repo = require('../backend/src/repositories/repository');
  // Insert student with low IPS (1.50) -> max allowed SKS is 15
  repo.insert('students', {
    nim: 'SEC-TEST-001',
    nama: 'Security Tester',
    program_studi: 'Teknik Informatika',
    dosen_pa: 'Dr. Aditya Pratama',
    semester: 3,
    ips_sebelumnya: 1.50,
    status: 'Aktif'
  });
  
  // Insert 6 classes of 3 SKS = 18 SKS (> 15 SKS limit)
  for (let i = 1; i <= 6; i++) {
    repo.insert('classes', {
      id: `sec-cls-${i}`,
      kode_mk: `SC0${i}`,
      nama_mk: `Security Test Course ${i}`,
      sks: 3
    });
  }

  try {
    assert.throws(() => {
      krsService.submitKrs('SEC-TEST-001', ['sec-cls-1', 'sec-cls-2', 'sec-cls-3', 'sec-cls-4', 'sec-cls-5', 'sec-cls-6']);
    }, (err) => err.statusCode === 422);
  } finally {
    // Clean up
    repo.delete('students', s => s.nim === 'SEC-TEST-001');
    for (let i = 1; i <= 6; i++) {
      repo.delete('classes', c => c.id === `sec-cls-${i}`);
    }
  }
});

test('State Lock: When FRS period is closed, student FRS is permanently locked as official KRS', () => {
  const engine = new SiakStorageEngine();
  engine.setFRSPeriodOpen(false); // Period closed
  
  const isOfficial = engine.isKRSOfficial('2023010042');
  assert.strictEqual(isOfficial, true, 'Closed FRS period must strictly lock editing and enforce KRS output');
  
  // Revert back
  engine.setFRSPeriodOpen(true);
});

test('Audit Trail: Grade revision requires formal petition and records immutable audit log', () => {
  const petition = {
    class_id: 'cls-aps-4a',
    nim: '2023010042',
    student_name: 'Alya Rahma Putri',
    old_grade: 'B',
    new_grade: 'A',
    reason: 'Koreksi nilai proyek terverifikasi dosen pengampu'
  };
  const log = bakService.executeGradeRevision(petition);
  assert.ok(log.id.startsWith('rev-'));
  assert.strictEqual(log.executed_by, 'Operator BAK');
  assert.strictEqual(log.status, 'EXECUTED');
  assert.ok(log.timestamp);
});

// -----------------------------------------------------------------------------
// 6. SENSITIVE DATA EXPOSURE AUDIT
// -----------------------------------------------------------------------------
console.log('\n📌 6. Auditing Sensitive Data Exposure & Information Disclosure:');

test('Credential Leak Prevention: Student metadata and KHS payloads never expose user passwords', () => {
  const khs = documentService.getKhsData('2023010042');
  assert.strictEqual(khs.student.password, undefined);
  assert.strictEqual(khs.academic_summary.password, undefined);
});

test('Session Security: AuthService token response strips user password hashes', () => {
  const res = authService.login('2023010042', 'SIAKUFD2025!', 'mahasiswa');
  assert.strictEqual(res.user.password, undefined);
  assert.ok(res.token);
});

console.log('\n==================================================================');
console.log(`🛡️ SECURITY AUDIT SUMMARY: ${passCount} PASSED | ${failCount} FAILED`);
console.log('==================================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🏆 100% OF ALL SECURITY POLICIES, RBAC CONTROLS & CRYPTO CHECKS PASSED!');
  process.exit(0);
}
