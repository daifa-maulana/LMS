/**
 * AUTH.SERVICE.JS — Authentication Domain Logic
 * SIAK UFD Enterprise SaaS
 */

const repo = require('../repositories/repository');

class AuthService {
  login(username, password, role) {
    const user = repo.findOne('users', u => u.username === username);

    if (!user) {
      const err = new Error('Username atau kredensial akun tidak terdaftar.');
      err.statusCode = 401;
      err.type = 'AUTHENTICATION_FAILED';
      err.title = 'Kredensial Tidak Valid';
      throw err;
    }

    // Role check if provided
    if (role && user.role !== role) {
      const err = new Error(`Akun ini tidak memiliki hak akses sebagai [${role}].`);
      err.statusCode = 403;
      err.type = 'ROLE_MISMATCH';
      err.title = 'Peran Tidak Sesuai';
      throw err;
    }

    // Mock token generation
    const token = `siak_token_${user.id}_${Date.now()}`;
    return {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        displayName: user.display_name,
        email: user.email
      },
      token,
      expires_in: '24h'
    };
  }

  switchRole(userId, newRole) {
    const user = repo.findOne('users', u => u.id === userId);
    if (!user) {
      const err = new Error('Pengguna tidak ditemukan.');
      err.statusCode = 404;
      throw err;
    }

    return {
      user: {
        id: user.id,
        username: user.username,
        role: newRole,
        displayName: user.display_name
      },
      activeRole: newRole
    };
  }
}

module.exports = new AuthService();
