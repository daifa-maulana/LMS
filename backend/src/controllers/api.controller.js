/**
 * API.CONTROLLER.JS — Unified REST API Controllers
 * Formats responses with standard enterprise envelopes
 * SIAK UFD Enterprise SaaS
 */

const authService = require('../services/auth.service');
const studentService = require('../services/student.service');
const krsService = require('../services/krs.service');
const attendanceService = require('../services/attendance.service');
const gradeService = require('../services/grade.service');
const bakService = require('../services/bak.service');
const documentService = require('../services/document.service');
const repo = require('../repositories/repository');

function ok(res, data, message = 'Operasi berhasil dieksekusi', meta = {}) {
  return res.status(200).json({
    success: true,
    code: 200,
    message,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta
    }
  });
}

function created(res, data, message = 'Data berhasil dibuat') {
  return res.status(201).json({
    success: true,
    code: 201,
    message,
    data,
    meta: {
      timestamp: new Date().toISOString()
    }
  });
}

class ApiController {
  // 1. Auth
  async login(req, res, next) {
    try {
      const { username, password, role } = req.body;
      const result = authService.login(username, password, role);
      return ok(res, result, 'Login berhasil, sesi autentikasi diterbitkan');
    } catch (err) {
      next(err);
    }
  }

  async switchRole(req, res, next) {
    try {
      const { user_id, new_role } = req.body;
      const result = authService.switchRole(user_id, new_role);
      return ok(res, result, 'Peran aktif berhasil dialihkan');
    } catch (err) {
      next(err);
    }
  }

  // 2. Students & Profile
  async getStudentProfile(req, res, next) {
    try {
      const { nim } = req.params;
      const profile = studentService.getProfile(nim);
      return ok(res, profile, 'Profil mahasiswa berhasil dimuat');
    } catch (err) {
      next(err);
    }
  }

  async getStudentEligibility(req, res, next) {
    try {
      const { nim } = req.params;
      const eligibility = studentService.getEligibility(nim);
      return ok(res, eligibility, 'Data kelayakan beban SKS berhasil dihitung');
    } catch (err) {
      next(err);
    }
  }

  // 3. KRS
  async getAvailableClasses(req, res, next) {
    try {
      const classes = krsService.getAvailableClasses();
      return ok(res, classes, 'Katalog kelas perkuliahan berhasil dimuat');
    } catch (err) {
      next(err);
    }
  }

  async getStudentKrs(req, res, next) {
    try {
      const { nim } = req.params;
      const krs = krsService.getStudentEnrollments(nim);
      return ok(res, krs, 'Rencana studi mahasiswa berhasil dimuat');
    } catch (err) {
      next(err);
    }
  }

  async submitKrs(req, res, next) {
    try {
      const { nim, class_ids } = req.body;
      if (!nim || !class_ids || !Array.isArray(class_ids)) {
        const err = new Error('Field nim dan class_ids (array) wajib disertakan.');
        err.statusCode = 400;
        throw err;
      }
      const result = krsService.submitKrs(nim, class_ids);
      return created(res, result, 'Pengajuan KRS berhasil dikirim ke Dosen PA');
    } catch (err) {
      next(err);
    }
  }

  async approveKrs(req, res, next) {
    try {
      const { submission_id } = req.params;
      const { is_approved, note } = req.body;
      const result = krsService.approveKrsByDpa(submission_id, is_approved, note);
      return ok(res, result, 'Persetujuan KRS berhasil diperbarui oleh Dosen PA');
    } catch (err) {
      next(err);
    }
  }

  // 4. Attendance
  async getAttendanceSummary(req, res, next) {
    try {
      const { nim } = req.params;
      const attendances = attendanceService.getAttendanceByNim(nim);
      return ok(res, attendances, 'Rekapitulasi presensi perkuliahan berhasil dimuat');
    } catch (err) {
      next(err);
    }
  }

  async checkInAttendance(req, res, next) {
    try {
      const { nim, class_id } = req.body;
      const result = attendanceService.checkIn(nim, class_id);
      return ok(res, result, 'Presensi kehadiran berhasil dicatat');
    } catch (err) {
      next(err);
    }
  }

  async getQrToken(req, res, next) {
    try {
      const { session_id } = req.params;
      const token = attendanceService.generateQrToken(session_id);
      return ok(res, token, 'Token QR dinamis 30 detik berhasil dibangkitkan');
    } catch (err) {
      next(err);
    }
  }

  // 5. Grading
  async getClassGradeSheet(req, res, next) {
    try {
      const { class_id } = req.params;
      const grades = gradeService.getClassGrades(class_id);
      return ok(res, grades, 'Lembar penilaian kelas berhasil dimuat');
    } catch (err) {
      next(err);
    }
  }

  async saveGradeDraft(req, res, next) {
    try {
      const { class_id } = req.params;
      const { student_scores } = req.body;
      const result = gradeService.saveDraft(class_id, student_scores);
      return ok(res, result, 'Draft penilaian berhasil disimpan sementara');
    } catch (err) {
      next(err);
    }
  }

  async submitGrades(req, res, next) {
    try {
      const { class_id } = req.params;
      const result = gradeService.submitGradesToBak(class_id);
      return ok(res, result, 'Nilai kelas berhasil disubmit ke antrean validasi BAK');
    } catch (err) {
      next(err);
    }
  }

  // 6. BAK Operations
  async getBakValidationQueue(req, res, next) {
    try {
      const queue = bakService.getValidationQueue();
      return ok(res, queue, 'Antrean validasi nilai kelas berhasil dimuat');
    } catch (err) {
      next(err);
    }
  }

  async validateClassGrades(req, res, next) {
    try {
      const { class_id } = req.params;
      const { action, reason } = req.body;
      const result = bakService.validateClassGrades(class_id, action, reason);
      return ok(res, result, result.message);
    } catch (err) {
      next(err);
    }
  }

  async publishGradesBatch(req, res, next) {
    try {
      const { class_ids } = req.body;
      const result = bakService.publishGradesBatch(class_ids || []);
      return ok(res, result, result.message);
    } catch (err) {
      next(err);
    }
  }

  async executeGradeRevision(req, res, next) {
    try {
      const log = bakService.executeGradeRevision(req.body);
      return created(res, log, 'Revisi nilai berhasil dieksekusi dan dicatat di audit log');
    } catch (err) {
      next(err);
    }
  }

  async getGradeRevisionsAuditLog(req, res, next) {
    try {
      const logs = repo.findAll('grade_revisions');
      return ok(res, logs, 'Daftar jejak audit koreksi nilai berhasil dimuat');
    } catch (err) {
      next(err);
    }
  }

  // 7. Documents & Transcripts
  async getKhsDocument(req, res, next) {
    try {
      const { nim } = req.params;
      const semester = req.query.semester;
      const doc = documentService.getKhsData(nim, semester);
      return ok(res, doc, 'Dokumen KHS resmi dan token verifikasi QR berhasil dimuat');
    } catch (err) {
      next(err);
    }
  }

  // 8. General Announcements & Stats
  async getAnnouncements(req, res, next) {
    try {
      const list = repo.findAll('announcements');
      return ok(res, list, 'Pengumuman akademik berhasil dimuat');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ApiController();
