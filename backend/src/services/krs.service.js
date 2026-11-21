/**
 * KRS.SERVICE.JS — Academic Study Plan (KRS / FRS) Engine
 * SIAK UFD Enterprise SaaS
 */

const repo = require('../repositories/repository');
const studentService = require('./student.service');

class KrsService {
  getAvailableClasses() {
    return repo.findAll('classes');
  }

  getStudentEnrollments(nim) {
    return repo.findBy('krs_enrollments', k => k.nim === nim);
  }

  submitKrs(nim, classIds) {
    const eligibility = studentService.getEligibility(nim);
    const allClasses = repo.findAll('classes');
    
    // Deduplicate class IDs to prevent duplicate enrollment in same class
    const uniqueClassIds = [...new Set(classIds)];

    // Resolve classes and calculate total SKS
    const selectedClasses = [];
    for (const id of uniqueClassIds) {
      const found = allClasses.find(c => c.id === id);
      if (found) {
        selectedClasses.push(found);
      }
    }

    const totalSks = selectedClasses.reduce((sum, c) => sum + c.sks, 0);

    if (totalSks > eligibility.max_sks_allowed) {
      const err = new Error(`Total SKS yang diajukan (${totalSks} SKS) melebihi batas maksimal yang diizinkan (${eligibility.max_sks_allowed} SKS).`);
      err.statusCode = 422;
      err.type = 'BUSINESS_RULE_VIOLATION';
      err.title = 'Batas SKS Terlampaui';
      err.invalidParams = [{ field: 'total_sks', reason: `Maksimal SKS adalah ${eligibility.max_sks_allowed}` }];
      throw err;
    }

    // Clear previous draft and insert new enrollments
    repo.delete('krs_enrollments', k => k.nim === nim);

    const newEnrollments = selectedClasses.map(c => {
      return repo.insert('krs_enrollments', {
        id: `krs-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        nim,
        class_id: c.id,
        kode_mk: c.kode_mk,
        nama_mk: c.nama_mk,
        sks: c.sks,
        status: 'SUBMITTED',
        submitted_at: new Date().toISOString()
      });
    });

    return {
      nim,
      total_sks: totalSks,
      status: 'SUBMITTED',
      message: 'Rencana Studi (KRS) berhasil diajukan ke Dosen PA.',
      enrollments: newEnrollments
    };
  }

  approveKrsByDpa(krsId, isApproved, note = '') {
    const updated = repo.update(
      'krs_enrollments',
      k => k.id === krsId,
      {
        status: isApproved ? 'APPROVED_PA' : 'REVISED',
        dpa_review_note: note,
        reviewed_at: new Date().toISOString()
      }
    );

    if (!updated) {
      const err = new Error('Pengajuan KRS tidak ditemukan.');
      err.statusCode = 404;
      throw err;
    }

    return updated;
  }
}

module.exports = new KrsService();
