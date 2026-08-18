const assert = require('node:assert/strict');
const { describe, test } = require('node:test');
const request = require('supertest');
const app = require('../src/app');

describe('Kire API', () => {
  test('GET /api/health returns success', async () => {
    const res = await request(app).get('/api/health');
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
  });

  test('POST /api/auth/signup registers a user', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      fullName: 'Test User',
      email: 'testuser@example.com',
      password: '123456',
      phone: '+994501234567'
    });

    assert.equal(res.statusCode, 201);
    assert.equal(res.body.success, true);
    assert.equal(res.body.user.email, 'testuser@example.com');
  });

  test('POST /api/auth/login logs a user in', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'testuser@example.com',
      password: '123456'
    });

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.token);
  });
});
