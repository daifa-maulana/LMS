/**
 * ROUTES/INDEX.JS — API Router v1
 * SIAK UFD Enterprise SaaS
 */

const express = require('express');
const router = express.Router();
const controller = require('../controllers/api.controller');
const auth = require('../middlewares/auth.middleware');

// Public Root Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'SIAK UFD Enterprise Academic ERP API',
    version: '1.0.0',
    tenant: req.tenantId,
    timestamp: new Date().toISOString()
  });
});

// 1. Auth Module
router.post('/auth/login', controller.login);
router.post('/auth/switch-role', auth(), controller.switchRole);

// 2. Students Module
router.get('/students/:nim', auth(), controller.getStudentProfile);
router.get('/students/:nim/eligibility', auth(), controller.getStudentEligibility);
router.get('/students/:nim/krs', auth(), controller.getStudentKrs);
router.get('/students/:nim/attendance', auth(), controller.getAttendanceSummary);

// 3. KRS / FRS Module
router.get('/classes/available', auth(), controller.getAvailableClasses);
router.post('/krs/submissions', auth(), controller.submitKrs);
router.patch('/krs/submissions/:submission_id/approve', auth('dosen'), controller.approveKrs);

// 4. Attendance Module
router.post('/lectures/attendance/check-in', auth(), controller.checkInAttendance);
router.get('/lectures/sessions/:session_id/qr-token', auth(), controller.getQrToken);

// 5. Grading Module (Dosen)
router.get('/classes/:class_id/grades', auth(), controller.getClassGradeSheet);
router.put('/classes/:class_id/grades/draft', auth('dosen'), controller.saveGradeDraft);
router.post('/classes/:class_id/grades/submit', auth('dosen'), controller.submitGrades);

// 6. BAK Operations
router.get('/bak/validation-queue', auth(), controller.getBakValidationQueue);
router.post('/bak/validations/:class_id', auth('akademik'), controller.validateClassGrades);
router.post('/bak/publications/batch', auth('akademik'), controller.publishGradesBatch);
router.post('/bak/grade-revisions/execute', auth('akademik'), controller.executeGradeRevision);
router.get('/bak/grade-revisions/logs', auth(), controller.getGradeRevisionsAuditLog);

// 7. Academic Documents & KHS
router.get('/documents/khs/:nim', auth(), controller.getKhsDocument);

// 8. General & Announcements
router.get('/announcements', controller.getAnnouncements);

module.exports = router;
