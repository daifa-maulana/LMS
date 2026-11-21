/**
 * CONFIG.JS — Backend Configuration
 * SIAK UFD Enterprise Academic ERP & SaaS
 */

module.exports = {
  PORT: process.env.PORT || 5000,
  DEFAULT_TENANT_ID: 'ten-ufd-prod',
  API_PREFIX: '/api/v1',
  JWT_SECRET: process.env.JWT_SECRET || 'siak-ufd-super-secret-jwt-key-2026',
  JWT_EXPIRY: '24h',
  ACADEMIC_YEAR: '2025/2026 Genap',
  INSTITUTION: {
    name: 'Universitas Fatmawati Digital',
    shortName: 'SIAK UFD',
    tagline: 'Terhubung, Tumbuh Bersama',
    city: 'Bandung',
    verifyUrlBase: 'https://verify.ufd.ac.id/doc'
  }
};
