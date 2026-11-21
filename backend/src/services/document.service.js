/**
 * DOCUMENT.SERVICE.JS — KHS & Transcript Document Generation with QR Code
 * SIAK UFD Enterprise SaaS
 */

const crypto = require('crypto');
const repo = require('../repositories/repository');
const config = require('../config/config');

class DocumentService {
  getKhsData(nim, semester = '2025/2026 Genap') {
    const student = repo.findOne('students', s => s.nim === nim);
    if (!student) {
      const err = new Error('Mahasiswa tidak ditemukan.');
      err.statusCode = 404;
      throw err;
    }

    const grades = repo.findBy('grades', g => g.nim === nim);
    const classes = repo.findAll('classes');

    const courseDetails = grades.map(g => {
      const cls = classes.find(c => c.id === g.class_id);
      return {
        kode_mk: cls ? cls.kode_mk : 'IF200',
        nama_mk: cls ? cls.nama_mk : 'Mata Kuliah',
        sks: cls ? cls.sks : 3,
        nilai_angka: g.nilai_akhir,
        nilai_huruf: g.huruf_mutu,
        bobot: g.bobot,
        mutu: (cls ? cls.sks : 3) * g.bobot
      };
    });

    const totalSks = courseDetails.reduce((sum, c) => sum + c.sks, 0);
    const totalMutu = courseDetails.reduce((sum, c) => sum + c.mutu, 0);
    const ips = totalSks > 0 ? Number((totalMutu / totalSks).toFixed(2)) : 0.0;

    // Generate Verification Hash
    const rawPayload = `${nim}|${semester}|${ips}|${totalSks}|SIAK_UFD_SECRET`;
    const docHash = crypto.createHash('sha256').update(rawPayload).digest('hex').substring(0, 16);

    return {
      document_type: 'KHS',
      semester,
      student: {
        nim: student.nim,
        nama: student.nama,
        program_studi: student.program_studi,
        dosen_pa: student.dosen_pa
      },
      academic_summary: {
        total_sks: totalSks,
        total_mutu: totalMutu,
        ips,
        ipk: student.ipk
      },
      courses: courseDetails,
      verification: {
        hash: docHash,
        verify_url: `${config.INSTITUTION.verifyUrlBase}/${docHash}`,
        signed_at: new Date().toISOString()
      }
    };
  }
}

module.exports = new DocumentService();
