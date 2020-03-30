/* eslint-disable eol-last */
const express = require('../../src/server');
const supertest = require('supertest');
const request = supertest(express);
const seed = require('../mocks/seed');
const should = require('should');
const seedDB = require('../helpers/seed-db');

describe('Authentication', async () => {

    before(async () => {
        await seedDB();
    });

    describe('User with valid credendials', () => {
        it('shoud be able to login', async () => {
            const user = seed.users.user;
            await request.post('/api/login')
                .send({email: user.email, password: user.password})
                .then(async result => {
                    result.status.should.equal(200);
                    result.body.should.have.property('token');
                    result.body.should.have.property('user');
                });
        });
    });

    describe('User with valid login, not valid password', () => {
        it('shoud be not able to login (response status = 401)', async () => {
            const user = seed.users.user;
            user.password = '';
            await request.post('/api/login')
                .send({email: user.email, password: user.password}).expect(401);
        });
    });

    describe('User with invalid login', () => {
        it('shoud be not able to login (response status = 404)', async () => {
            const user = seed.users.user;
            user.email = '';
            await request.post('/api/login')
                .send({email: user.email, password: user.password}).expect(404);
        });
    });
});