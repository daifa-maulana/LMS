/**
 * BAK.SERVICE.JS — Academic Bureau (BAK) Workflow & Publication
 * SIAK UFD Enterprise SaaS
 */

const repo = require('../repositories/repository');

class BakService {
  getValidationQueue() {
    const classes = repo.findAll('classes');
    return classes.map(c => {
      const grades = repo.findBy('grades', g => g.class_id === c.id);
      return {
        ...c,
        total_graded: grades.length,
        status: c.status_penilaian || 'DRAFT'
      };
    });
  }

  validateClassGrades(classId, action, rejectionReason = '') {
    const targetClass = repo.findOne('classes', c => c.id === classId);
    if (!targetClass) {
      const err = new Error('Kelas tidak ditemukan.');
      err.statusCode = 404;
      throw err;
    }

    const newStatus = action === 'APPROVE' ? 'VALIDATED' : 'REJECTED';

    repo.update('classes', c => c.id === classId, {
      status_penilaian: newStatus,
      rejection_reason: action === 'REJECT' ? rejectionReason : null,
      validated_at: new Date().toISOString()
    });

    const grades = repo.findBy('grades', g => g.class_id === classId);
    for (const g of grades) {
      repo.update('grades', item => item.id === g.id, { status: newStatus });
    }

    return {
      class_id: classId,
      action,
      status: newStatus,
      message: action === 'APPROVE' 
        ? 'Nilai kelas berhasil divalidasi dan siap dipublikasikan ke KHS.' 
        : `Nilai kelas ditolak dengan catatan: ${rejectionReason}`
    };
  }

  publishGradesBatch(classIds) {
    const published = [];
    for (const id of classIds) {
      repo.update('classes', c => c.id === id, { status_penilaian: 'PUBLISHED', published_at: new Date().toISOString() });
      const grades = repo.findBy('grades', g => g.class_id === id);
      for (const g of grades) {
        repo.update('grades', item => item.id === g.id, { status: 'PUBLISHED' });
      }
      published.push(id);
    }

    return {
      published_classes: published,
      status: 'PUBLISHED',
      message: `${published.length} kelas berhasil dipublikasikan resmi ke KHS dan Transkrip mahasiswa.`
    };
  }

  executeGradeRevision(petition) {
    const log = repo.insert('grade_revisions', {
      id: `rev-${Date.now()}`,
      class_id: petition.class_id,
      nim: petition.nim,
      student_name: petition.student_name,
      old_grade: petition.old_grade,
      new_grade: petition.new_grade,
      reason: petition.reason,
      executed_by: 'Operator BAK',
      status: 'EXECUTED',
      timestamp: new Date().toISOString()
    });

    // Update grade entry
    repo.update(
      'grades',
      g => g.class_id === petition.class_id && g.nim === petition.nim,
      { huruf_mutu: petition.new_grade, revision_flag: true }
    );

    return log;
  }
}

module.exports = new BakService();
