/**
 * ATTENDANCE.SERVICE.JS — Lecture Sessions & Attendance Gatekeeper
 * SIAK UFD Enterprise SaaS
 */

const repo = require('../repositories/repository');

class AttendanceService {
  getAttendanceByNim(nim) {
    return repo.findBy('attendances', a => a.nim === nim);
  }

  checkIn(nim, classId) {
    let record = repo.findOne('attendances', a => a.nim === nim && a.class_id === classId);
    
    if (!record) {
      record = repo.insert('attendances', {
        id: `att-${Date.now()}`,
        class_id: classId,
        nim,
        total_sessions: 16,
        attended: 1,
        percentage: (1 / 16) * 100,
        eligible_for_exam: false
      });
    } else {
      const newAttended = Math.min(record.attended + 1, record.total_sessions);
      const percentage = (newAttended / record.total_sessions) * 100;
      record = repo.update('attendances', a => a.id === record.id, {
        attended: newAttended,
        percentage: Number(percentage.toFixed(2)),
        eligible_for_exam: percentage >= 75.0,
        last_check_in: new Date().toISOString()
      });
    }

    return record;
  }

  generateQrToken(sessionId) {
    // Dynamic token expiring in 30 seconds
    const token = `QR_${sessionId}_${Date.now()}`;
    return {
      session_id: sessionId,
      token,
      expires_in_seconds: 30,
      generated_at: new Date().toISOString()
    };
  }
}

module.exports = new AttendanceService();
