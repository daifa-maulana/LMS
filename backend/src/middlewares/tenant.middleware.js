/**
 * TENANT.MIDDLEWARE.JS — Multi-Tenant Scoping
 * SIAK UFD Enterprise SaaS
 */

const config = require('../config/config');

module.exports = function tenantMiddleware(req, res, next) {
  // Extract tenant ID from header or query or use default
  const tenantId = req.headers['x-tenant-id'] || req.query.tenant_id || config.DEFAULT_TENANT_ID;
  
  req.tenantId = tenantId;
  res.setHeader('X-Tenant-ID', tenantId);
  next();
};
