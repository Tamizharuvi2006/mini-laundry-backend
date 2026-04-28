const http = require('node:http');
const assert = require('node:assert/strict');

process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'https://example.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'test-service-role-key';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@laundry.com';
process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const app = require('../src/app');

async function run() {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    const healthRes = await fetch(`${baseUrl}/api/health`);
    assert.equal(healthRes.status, 200);
    const healthBody = await healthRes.json();
    assert.equal(healthBody.success, true);
    assert.equal(healthBody.message, 'Laundry API is running');

    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      }),
    });
    assert.equal(loginRes.status, 200);
    const loginBody = await loginRes.json();
    assert.equal(loginBody.success, true);
    assert.ok(loginBody.data?.token);

    const invalidLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: 'wrong@laundry.com',
        password: 'wrong-password',
      }),
    });
    assert.equal(invalidLoginRes.status, 401);

    const protectedRes = await fetch(`${baseUrl}/api/orders`);
    assert.equal(protectedRes.status, 401);

    console.log('PASS: health, auth, and protected-route checks');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

run().catch((error) => {
  console.error('FAIL:', error.message);
  process.exit(1);
});
