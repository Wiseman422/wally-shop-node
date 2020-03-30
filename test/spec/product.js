/* eslint-disable eol-last */
const express = require('../../src/server');
const supertest = require('supertest');
const request = supertest(express);
const seed = require('../mocks/seed');
const should = require('should');
const seedDB = require('../helpers/seed-db');

describe('Product', async () => {

    before(async () => {
        // await seedDB();
    });

    describe('Inventory items', () => {
        describe('should be returned as available_inventories', () => {
            it('if they have live status = true and time conditions corresponds to user time', async () => {

            });
        });
        describe('should be returned as unavailable_inventories', () => {
            it('if they have live status = false', async () => {

            });
            it('or day_of_week not corresponding to current day of week', async () => {

            });
            it('or start time is greater than current user time', async () => {

            });
            it('or end time is less current user time', async () => {

            });
        });
    });

    describe('', () => {
        it('', async () => {

        });
    });
});