/**
 * GRADE.SERVICE.JS — Multi-Component Assessment Formula
 * Formula: NA = Tugas*0.20 + Kuis*0.20 + UTS*0.25 + UAS*0.35
 * SIAK UFD Enterprise SaaS
 */

const repo = require('../repositories/repository');

class GradeService {
  computeFinalGrade(tugas, kuis, uts, uas) {
    const na = (tugas * 0.20) + (kuis * 0.20) + (uts * 0.25) + (uas * 0.35);
    const finalNa = Number(na.toFixed(2));

    let letter = 'E';
    let point = 0.0;

    if (finalNa >= 85.0) {
      letter = 'A'; point = 4.0;
    } else if (finalNa >= 80.0) {
      letter = 'AB'; point = 3.5;
    } else if (finalNa >= 75.0) {
      letter = 'B'; point = 3.0;
    } else if (finalNa >= 70.0) {
      letter = 'BC'; point = 2.5;
    } else if (finalNa >= 65.0) {
      letter = 'C'; point = 2.0;
    } else if (finalNa >= 55.0) {
      letter = 'D'; point = 1.0;
    } else {
      letter = 'E'; point = 0.0;
    }

    return { nilai_akhir: finalNa, huruf_mutu: letter, bobot: point };
  }

  getClassGrades(classId) {
    return repo.findBy('grades', g => g.class_id === classId);
  }

  saveDraft(classId, studentScores) {
    const results = [];
    for (const score of studentScores) {
      const computed = this.computeFinalGrade(score.tugas, score.kuis, score.uts, score.uas);
      let existing = repo.findOne('grades', g => g.class_id === classId && g.nim === score.nim);

      if (existing) {
        existing = repo.update('grades', g => g.id === existing.id, {
          tugas: score.tugas,
          kuis: score.kuis,
          uts: score.uts,
          uas: score.uas,
          ...computed,
          status: 'DRAFT',
          updated_at: new Date().toISOString()
        });
        results.push(existing);
      } else {
        const created = repo.insert('grades', {
          id: `grd-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          class_id: classId,
          nim: score.nim,
          student_name: score.student_name || 'Mahasiswa',
          tugas: score.tugas,
          kuis: score.kuis,
          uts: score.uts,
          uas: score.uas,
          ...computed,
          status: 'DRAFT',
          created_at: new Date().toISOString()
        });
        results.push(created);
      }
    }

    repo.update('classes', c => c.id === classId, { status_penilaian: 'DRAFT' });
    return results;
  }

  submitGradesToBak(classId) {
    const grades = repo.findBy('grades', g => g.class_id === classId);
    if (!grades.length) {
      const err = new Error('Tidak ada data nilai yang dapat diajukan untuk kelas ini.');
      err.statusCode = 400;
      throw err;
    }

    // Lock grades as SUBMITTED
    for (const g of grades) {
      repo.update('grades', item => item.id === g.id, { status: 'SUBMITTED' });
    }

    repo.update('classes', c => c.id === classId, {
      status_penilaian: 'SUBMITTED',
      submitted_to_bak_at: new Date().toISOString()
    });

    return {
      class_id: classId,
      total_students: grades.length,
      status: 'SUBMITTED',
      message: 'Nilai kelas berhasil diajukan ke Biro Administrasi Akademik (BAK) untuk divalidasi.'
    };
  }
}

module.exports = new GradeService();
