/**
 * SERVER.JS — SIAK UFD REST API Entry Point
 * Multi-Tenant Academic ERP & SaaS Backend
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');
const tenantMiddleware = require('./middlewares/tenant.middleware');
const errorMiddleware = require('./middlewares/error.middleware');
const apiRoutes = require('./routes/index');

const app = express();

// Global Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-ID', 'X-User-Role', 'X-User-Id']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multi-Tenant Scoping Middleware
app.use(tenantMiddleware);

// Mount API v1 Routes
app.use(config.API_PREFIX, apiRoutes);

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.json({
    name: config.INSTITUTION.name,
    tagline: config.INSTITUTION.tagline,
    system: config.INSTITUTION.shortName,
    api_docs: `${config.API_PREFIX}/health`,
    academic_year: config.ACADEMIC_YEAR
  });
});

// Global Error Handler
app.use(errorMiddleware);

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.PORT, () => {
    console.log(`==================================================================`);
    console.log(`🚀 SIAK UFD Backend API Server running at http://localhost:${config.PORT}`);
    console.log(`📡 Health Check: http://localhost:${config.PORT}${config.API_PREFIX}/health`);
    console.log(`🏛️ Default Tenant: ${config.DEFAULT_TENANT_ID}`);
    console.log(`==================================================================`);
  });
}

module.exports = app;
