require('dotenv').config();
const jwt = require('jsonwebtoken');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');

// const token = `Bearer ${jwt.sign({ id: 'testuser123' }, process.env.JWT_SECRET, { expiresIn: '1d' })}`;
const token = `Bearer ${jwt.sign({ id: '6a20e02b18a5d331fafc37a5' }, process.env.JWT_SECRET, { expiresIn: '1d' })}`;
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('POST /transactions', () => {
  it('should create a new transaction', async () => {
    const res = await request(app)
      .post('/transactions')
      .set('Authorization', token)
      .send({
        type: 'income',
        category: 'Salary',
        amount: 5000,
        date: '2026-06-12',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.transaction).toHaveProperty('_id');
  });

  it('should fail validation with missing fields', async () => {
    const res = await request(app)
      .post('/transactions')
      .set('Authorization', token)
      .send({ type: 'income' });
    expect(res.statusCode).toBe(400);
  });
});

describe('GET /transactions', () => {
  it('should fetch all transactions', async () => {
    const res = await request(app)
      .get('/transactions')
      .set('Authorization', token);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('transactions');
  });
});

describe('GET /transactions/summary', () => {
  it('should return income/expense summary', async () => {
    const res = await request(app)
      .get('/transactions/summary')
      .set('Authorization', token);
    expect(res.statusCode).toBe(200);
    expect(res.body.summary).toHaveProperty('balance');
  });
});

describe('DELETE /transactions/:id', () => {
  it('should return 404 for invalid id', async () => {
    const res = await request(app)
      .delete('/transactions/000000000000000000000000')
      .set('Authorization', token);
    expect(res.statusCode).toBe(404);
  });
});