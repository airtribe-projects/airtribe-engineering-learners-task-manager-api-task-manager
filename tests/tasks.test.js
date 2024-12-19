const request = require('supertest');
const app = require('../index');

describe('Task API', () => {
    it('should create a new task', async () => {
        const res = await request(app)
            .post('/tasks')
            .send({ title: 'Task 1', description: 'Description 1' });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
    });

    it('should fetch all tasks', async () => {
        const res = await request(app).get('/tasks');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
