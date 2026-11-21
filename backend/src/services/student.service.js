/**
 * STUDENT.SERVICE.JS — Student Academic Profile & Eligibility
 * SIAK UFD Enterprise SaaS
 */

const repo = require('../repositories/repository');

class StudentService {
  getProfile(nim) {
    const student = repo.findOne('students', s => s.nim === nim);
    if (!student) {
      const err = new Error(`Mahasiswa dengan NIM ${nim} tidak ditemukan.`);
      err.statusCode = 404;
      err.type = 'STUDENT_NOT_FOUND';
      throw err;
    }
    return student;
  }

  getEligibility(nim) {
    const student = this.getProfile(nim);
    
    // Formula for max SKS based on previous IPS:
    let maxSks = 18;
    if (student.ips_sebelumnya >= 3.50) maxSks = 24;
    else if (student.ips_sebelumnya >= 3.00) maxSks = 22;
    else if (student.ips_sebelumnya >= 2.50) maxSks = 20;
    else if (student.ips_sebelumnya >= 2.00) maxSks = 18;
    else maxSks = 15;

    return {
      nim: student.nim,
      nama: student.nama,
      ips_sebelumnya: student.ips_sebelumnya,
      max_sks_allowed: maxSks,
      status_akademik: student.status,
      eligible_for_krs: student.status === 'Aktif',
      dosen_pa: student.dosen_pa
    };
  }
}

module.exports = new StudentService();
