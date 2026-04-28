const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'https://example.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'test-service-role-key';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@laundry.com';
process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const app = require('../src/app');

let server;
let baseUrl;

test.before(async () => {
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

test.after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('GET /api/health returns success payload', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);

  const body = await res.json();
  assert.equal(body.success, true);
  assert.equal(body.message, 'Laundry API is running');
  assert.ok(body.timestamp);
});

test('POST /api/auth/login succeeds with demo credentials', async () => {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    }),
  });

  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.ok(body.data?.token);
});

test('POST /api/auth/login rejects invalid credentials', async () => {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      email: 'wrong@laundry.com',
      password: 'wrong-password',
    }),
  });

  assert.equal(res.status, 401);
  const body = await res.json();
  assert.equal(body.success, false);
});

test('GET /api/orders rejects requests without token', async () => {
  const res = await fetch(`${baseUrl}/api/orders`);
  assert.equal(res.status, 401);
  const body = await res.json();
  assert.equal(body.success, false);
});
