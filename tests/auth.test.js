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

  test('POST /api/auth/login logs a user in with email', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'testuser@example.com',
      password: '123456'
    });

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.token);
  });

  test('POST /api/auth/login accepts phone number as identifier', async () => {
    const signupRes = await request(app).post('/api/auth/signup').send({
      fullName: 'Phone User',
      email: 'phoneuser@example.com',
      password: '654321',
      phone: '+994507778899'
    });

    assert.equal(signupRes.statusCode, 201);

    const loginRes = await request(app).post('/api/auth/login').send({
      identifier: '+994507778899',
      password: '654321'
    });

    assert.equal(loginRes.statusCode, 200);
    assert.equal(loginRes.body.success, true);
    assert.equal(loginRes.body.user.phone, '+994507778899');
  });

  test('GET /api/listings supports keyword and category search filters', async () => {
    const createRes = await request(app).post('/api/listings').set('Authorization', `Bearer ${jwtSignForAdmin()}`).send({
      title: 'Bakı mənzil axtarışı',
      description: 'Mərkəzə yaxın, rahat 2 otaqlı mənzil',
      price: 1200,
      category: 'apartment',
      city: 'Bakı',
      location: 'Nərimanov',
      listingType: 'rent'
    });

    assert.equal(createRes.statusCode, 201);

    const res = await request(app).get('/api/listings?search=rahat&category=apartment&city=Bakı');
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.some((listing) => listing.title.toLowerCase().includes('bakı')));
  });

  test('POST /api/listings allows admin to publish listings and rejects non-admin users', async () => {
    const adminLogin = await request(app).post('/api/auth/login').send({
      email: 'safaraliyevziya@gmail.com',
      password: 'Admin123!'
    });

    assert.equal(adminLogin.statusCode, 200);
    assert.equal(adminLogin.body.user.role, 'admin');

    const adminCreate = await request(app)
      .post('/api/listings')
      .set('Authorization', `Bearer ${adminLogin.body.token}`)
      .send({
        title: 'Admin deyeri',
        description: 'Admin tərəfindən əlavə olunub',
        price: 1800,
        category: 'villa',
        city: 'Bakı',
        listingType: 'rent'
      });

    assert.equal(adminCreate.statusCode, 201);
    assert.equal(adminCreate.body.success, true);

    const userSignup = await request(app).post('/api/auth/signup').send({
      fullName: 'No Access User',
      email: 'noaccess@example.com',
      password: '123456',
      phone: '+994505554433'
    });

    const userCreate = await request(app)
      .post('/api/listings')
      .set('Authorization', `Bearer ${userSignup.body.token}`)
      .send({
        title: 'Forbidden listing',
        description: 'Normal user should not publish',
        price: 900,
        category: 'room',
        city: 'Gəncə',
        listingType: 'rent'
      });

    assert.equal(userCreate.statusCode, 403);
    assert.equal(userCreate.body.success, false);
  });
});

function jwtSignForAdmin() {
  const jwt = require('jsonwebtoken');
  const db = require('../src/config/db');
  const admin = db.users.find((user) => user.email === 'safaraliyevziya@gmail.com');

  if (!admin) {
    return '';
  }

  return jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, process.env.JWT_SECRET || 'development-secret');
}
