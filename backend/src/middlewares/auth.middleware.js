/**
 * AUTH.MIDDLEWARE.JS — Authentication & RBAC Guard
 * SIAK UFD Enterprise SaaS
 */

module.exports = function authMiddleware(requiredRole = null) {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    // For local prototype & demo, allow requests with Bearer token or fallback mock session
    let token = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // Attach user context to request
    req.user = {
      role: req.headers['x-user-role'] || (token ? 'authenticated' : 'guest'),
      username: req.headers['x-user-id'] || '2023010042'
    };

    if (requiredRole && req.user.role !== 'guest' && req.user.role !== requiredRole && req.headers['x-user-role']) {
      return res.status(403).json({
        success: false,
        code: 403,
        error_type: 'FORBIDDEN',
        title: 'Akses Ditolak',
        detail: `Operasi ini memerlukan hak akses [${requiredRole}], peran Anda saat ini: [${req.user.role}].`
      });
    }

    next();
  };
};
