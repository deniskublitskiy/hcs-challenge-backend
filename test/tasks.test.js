const chai = require('chai');
const request = require('supertest');
const HttpStatus = require('http-status-codes');

const server = require('../src/index');

const { expect } = chai;

describe('Tasks API Integration Tests', () => {
    let token;

    const credentials = {
        name: 'testuser1',
        password: 'testuser1',
    };

    before(() => request(server)
        .post('/api/auth/signin')
        .send(credentials)
        .then((response) => {
            token = response.body.token;
        }));

    describe('#POST /tasks', () => {
        const task = {
            title: 'Test',
            dueDate: new Date(),
            description: 'Test',
        };

        const taskWithoutTitle = {
            dueDate: new Date(),
            description: 'Test',
        };

        const taskWithoutDate = {
            title: 'Test',
            description: 'Test',
        };

        const taskWithInvalidFormatFields = {
            title: 2,
            dueDate: 'Test',
            description: 2,
        };

        it('should get unauthorized status without token', () => request(server)
            .post('/api/tasks')
            .send(task)
            .expect(HttpStatus.UNAUTHORIZED));

        it('should get unauthorized status with wrong token', () => request(server)
            .post('/api/tasks')
            .send(task)
            .set('Authorization', 'Bearer WrongToken')
            .expect(HttpStatus.UNAUTHORIZED));

        it('should create task', () => request(server)
            .post('/api/tasks')
            .send(task)
            .set('Authorization', `Bearer ${token}`)
            .expect(HttpStatus.CREATED));

        it('should get "title" required error', () => request(server)
            .post('/api/tasks')
            .send(taskWithoutTitle)
            .set('Authorization', `Bearer ${token}`)
            .expect(HttpStatus.UNPROCESSABLE_ENTITY)
            .then((res) => {
                expect(res.body).to.have.property('errors');
                expect(res.body.errors).to.be.an('array');
                expect(res.body.errors[0]).to.have.property('param');
                expect(res.body.errors[0].param).to.equal('title');
            }));

        it('should get "dueDate" required error', () => request(server)
            .post('/api/tasks')
            .send(taskWithoutDate)
            .set('Authorization', `Bearer ${token}`)
            .expect(HttpStatus.UNPROCESSABLE_ENTITY)
            .then((res) => {
                expect(res.body).to.have.property('errors');
                expect(res.body.errors).to.be.an('array');
                expect(res.body.errors[0]).to.have.property('param');
                expect(res.body.errors[0].param).to.equal('dueDate');
            }));

        it('should get "title" to be a string and "dueDate" to be a date errors', () => request(server)
            .post('/api/tasks')
            .send(taskWithInvalidFormatFields)
            .set('Authorization', `Bearer ${token}`)
            .expect(HttpStatus.UNPROCESSABLE_ENTITY)
            .then((res) => {
                expect(res.body).to.have.property('errors');
                expect(res.body.errors).to.be.an('array').to.have.lengthOf(3);
                expect(res.body.errors[0]).to.have.property('param');
                expect(res.body.errors[0].param).to.equal('title');
                expect(res.body.errors[1]).to.have.property('param');
                expect(res.body.errors[1].param).to.equal('description');
                expect(res.body.errors[2]).to.have.property('param');
                expect(res.body.errors[2].param).to.equal('dueDate');
            }));
    });
});
