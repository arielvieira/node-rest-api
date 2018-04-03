const expect = require('expect');
const request = require('supertest');

const app = require('./../../app');
const User = require('./../models/user');
const { users, populateUsers } = require('./seed/userSeed');

describe('Usuarios', () => {
    beforeEach(populateUsers);
    describe('POST /usuarios', () => {
        it('should create a user', (done) => {
            const email = 'test@test.com';
            const password = '123zxc!';

            request(app)
                .post('/usuarios')
                .send({ email, password })
                .expect(201)
                .end(done);
        });

        it('should return validation errors if request parameters is invalid', (done) => {
            request(app)
                .post('/usuarios')
                .send({ email: 'ariel', password: '123' })
                .expect(400)
                .expect((res) => {
                    expect(res.body.error.password).toBeTruthy()
                    expect(res.body.error.email).toBeTruthy()
                })
                .end(done);
        });

        it('should not create user if email is already in use', (done) => {
            request(app)
                .post('/usuarios')
                .send({
                    email: users[0].email,
                    password: 'zxc123!'
                })
                .expect(409)
                .end(done);
        });
    });

    describe('POST /usuarios/login', () => {
        it('should login user and return auth token', (done) => {
            request(app)
                .post('/usuarios/login')
                .send({
                    email: users[1].email,
                    password: users[1].password
                })
                .expect(200)
                .expect((res) => expect(res.body.token).toBeTruthy())
                .end(done);
        });

        it('should reject invalid login', (done) => {
            request(app)
                .post('/usuarios/login')
                .send({
                    email: users[1].email,
                    password: "1111119"
                })
                .expect(401)
                .expect((res) => {
                    expect(res.body.token).toBeFalsy();
                    expect(res.body).toEqual({});
                })
                .end(done);
        });
    });
});
