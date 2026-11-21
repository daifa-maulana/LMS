/**
 * ERROR.MIDDLEWARE.JS — RFC 7807 Problem Details Error Formatter
 * SIAK UFD Enterprise SaaS
 */

module.exports = function errorMiddleware(err, req, res, next) {
  console.error('[Error Middleware]', err);

  const statusCode = err.statusCode || 500;
  const responseEnvelope = {
    success: false,
    code: statusCode,
    error_type: err.type || 'INTERNAL_SERVER_ERROR',
    title: err.title || 'Terjadi Kesalahan Server',
    detail: err.message || 'Sistem mengalami kendala saat memproses permintaan Anda.',
    instance: req.originalUrl,
    timestamp: new Date().toISOString()
  };

  if (err.invalidParams) {
    responseEnvelope.invalid_params = err.invalidParams;
  }

  res.status(statusCode).json(responseEnvelope);
};
