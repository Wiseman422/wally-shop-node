/* eslint-disable eol-last */
const express = require('../../src/server');
const supertest = require('supertest');
const request = supertest(express);
const should = require('should');
const moment = require('moment');
const lolex = require('lolex');
const schemas = require('../../src/schemas');
const seedDB = require('../helpers/seed-db');
const lolexOptions = {shouldAdvanceTime: true, advanceTimeDelta: 50};

describe('Delivery winodows', async () => {

    before(async () => {
        await seedDB();
        const clock = lolex.install({
            shouldAdvanceTime: true,
            advanceTimeDelta: 50,
            now: moment.utc('2010-01-01 17:00:00').toDate()
        });
        await createFakeOrders(3, 'paid');
        clock.tick(1000 * 60 * 60);
        await createFakeOrders(3, 'paid');
        clock.tick(1000 * 60 * 60);
        await createFakeOrders(2, 'packaged');
        clock.tick(1000 * 60 * 60);
        await createFakeOrders(1, 'packaged');
        clock.tick(1000 * 60 * 60);
        await createFakeOrders(2, 'submitted');
        clock.tick(1000 * 60 * 60 * 23);
        await createFakeOrders(3, 'submitted');
        clock.uninstall();
    });

    describe('should return available time-blocks', () => {
        it('for today, if user time is before 1 PM', async () => {

            // console.log(moment('2010-01-01 12:00:00'));
            const result = await request.get('/api/delivery_windows')
                .query({
                    zip: '10011',
                    user_time: moment.utc('2010-01-01 14:00:00').toISOString(),
                })
                .expect(200);
            // console.log(result.body);
        });

        it('for next day, if user time is after 1 PM', async () => {
            const clock = lolex.install({...lolexOptions, ...{now: new Date('2010-01-01 14:00:00')}});
            clock.uninstall();
        });
    });

    describe('should set time-block availability', () => {
        it('as false, if it have 3 or more scheduled orders', async () => {

        });

        it('as true, if it have less than 3 scheduled orders', async () => {

        });
    });

    describe('should return error', () => {
        it('if invalid zip-code provided', async () => {
            await request.get('/api/delivery_windows')
                .query({
                    zip: '19911',
                    user_time: '2010-01-01 14:00:00',
                })
                .expect(400);
        });
    });
})
;

async function createFakeOrders(count, status, zip = '10011') {
    for (let i = 0; i < count; i++) {
        await schemas.Order.create({
            status,
            zip,
            delivery_time: moment.utc(),
        });
    }
}