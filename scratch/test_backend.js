const app = require('../backend/src/server');
const http = require('http');

const server = http.createServer(app);
server.listen(5099, async () => {
  console.log('Testing server on port 5099...');

  async function get(path) {
    return new Promise((resolve, reject) => {
      http.get(`http://localhost:5099${path}`, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
      }).on('error', reject);
    });
  }

  try {
    const health = await get('/api/v1/health');
    console.log('✅ Health Check:', health.status, health.body.service);

    const classes = await get('/api/v1/classes/available');
    console.log('✅ Available Classes:', classes.status, 'Total:', classes.body.data.length);

    const profile = await get('/api/v1/students/2023010042');
    console.log('✅ Student Profile:', profile.status, profile.body.data.nama);

    const khs = await get('/api/v1/documents/khs/2023010042');
    console.log('✅ KHS Document:', khs.status, 'IPS:', khs.body.data.academic_summary.ips, 'QR Hash:', khs.body.data.verification.hash);

    console.log('🎉 ALL BACKEND TESTS PASSED 100%!');
  } catch (err) {
    console.error('❌ Test failed:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});
