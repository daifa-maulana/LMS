/**
 * API-CLIENT.JS — Universal Frontend API Client
 * Connects Frontend to SIAK UFD REST API with Automatic Offline Fallback
 * SIAK UFD Enterprise SaaS
 */

const API_BASE_URL = 'http://localhost:5000/api/v1';

class ApiClient {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.tenantId = 'ten-ufd-prod';
  }

  getHeaders() {
    const session = this.getSession();
    const headers = {
      'Content-Type': 'application/json',
      'X-Tenant-ID': this.tenantId
    };

    if (session && session.token) {
      headers['Authorization'] = `Bearer ${session.token}`;
      headers['X-User-Role'] = session.role || 'mahasiswa';
      headers['X-User-Id'] = session.username || '2023010042';
    }

    return headers;
  }

  getSession() {
    try {
      const raw = sessionStorage.getItem('ACADEMIC_OS_SESSION');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...(options.headers || {})
      }
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      return data;
    } catch (err) {
      console.warn(`[ApiClient] Network request to ${url} failed, falling back to local store:`, err.message);
      return { success: false, fallback: true, error: err.message };
    }
  }

  // 1. Auth API
  async login(username, password, role) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, role })
    });

    if (res.success && res.data) {
      sessionStorage.setItem('ACADEMIC_OS_SESSION', JSON.stringify({
        role: res.data.user.role,
        username: res.data.user.username,
        displayName: res.data.user.displayName,
        token: res.data.token,
        loginTime: new Date().toISOString()
      }));
    }

    return res;
  }

  // 2. Student & Eligibility API
  async getStudentProfile(nim) {
    return this.request(`/students/${nim}`);
  }

  async getStudentEligibility(nim) {
    return this.request(`/students/${nim}/eligibility`);
  }

  // 3. KRS / FRS API
  async getAvailableClasses() {
    return this.request('/classes/available');
  }

  async submitKrs(nim, classIds) {
    return this.request('/krs/submissions', {
      method: 'POST',
      body: JSON.stringify({ nim, class_ids: classIds })
    });
  }

  // 4. Attendance API
  async getAttendanceSummary(nim) {
    return this.request(`/students/${nim}/attendance`);
  }

  async checkInAttendance(nim, classId) {
    return this.request('/lectures/attendance/check-in', {
      method: 'POST',
      body: JSON.stringify({ nim, class_id: classId })
    });
  }

  // 5. Grading API (Dosen)
  async getClassGrades(classId) {
    return this.request(`/classes/${classId}/grades`);
  }

  async saveGradeDraft(classId, studentScores) {
    return this.request(`/classes/${classId}/grades/draft`, {
      method: 'PUT',
      body: JSON.stringify({ student_scores: studentScores })
    });
  }

  async submitGradesToBak(classId) {
    return this.request(`/classes/${classId}/grades/submit`, {
      method: 'POST'
    });
  }

  // 6. BAK Operations
  async getBakValidationQueue() {
    return this.request('/bak/validation-queue');
  }

  async validateClassGrades(classId, action, reason = '') {
    return this.request(`/bak/validations/${classId}`, {
      method: 'POST',
      body: JSON.stringify({ action, reason })
    });
  }

  async publishGradesBatch(classIds) {
    return this.request('/bak/publications/batch', {
      method: 'POST',
      body: JSON.stringify({ class_ids: classIds })
    });
  }

  // 7. Documents & KHS
  async getKhsDocument(nim, semester) {
    const q = semester ? `?semester=${encodeURIComponent(semester)}` : '';
    return this.request(`/documents/khs/${nim}${q}`);
  }

  // 8. Announcements
  async getAnnouncements() {
    return this.request('/announcements');
  }
}

// Global Singleton
window.siakApi = new ApiClient();
