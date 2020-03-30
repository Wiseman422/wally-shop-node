require('dotenv').load({path: process.env.DOTENV || '.test.env'});
const config = require('config');
const seed = require('../mocks/seed');
const lolex = require('lolex');
const schemas = require('../../src/schemas');
const mongoose = require('mongoose');

module.exports = async () => {
    await mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`,
        config.db.options,
        async () => await mongoose.connection.db.dropDatabase()
    );

    let clock = lolex.install({shouldAdvanceTime: true, advanceTimeDelta: 50, now: new Date('2010-01-01 00:00:00')});
    await seedUsers();
    await seedProducts();
    await seedInventoryItems();
    await seedCategories();
    await seedPackagins();
    await seedOrders();
    clock.uninstall();
};

async function seedPackagins() {
    for (const key in seed.packagings) await schemas.Packaging.create(seed.packagings[key]);
}

async function seedUsers() {
    for (const key in seed.users) await schemas.User.create(seed.users[key]);
}

async function seedProducts() {
    for (const key in seed.products) await schemas.Product.create(seed.products[key]);
}

async function seedInventoryItems() {
    for (const key in seed.inventoryItems) await schemas.InventoryItem.create(seed.inventoryItems[key]);
}

async function seedCategories() {
    for (const key in seed.categories) await schemas.Category.create(seed.categories[key]);
}

async function seedOrders() {
    for (const key in seed.orders) await schemas.Order.create(seed.orders[key]);
}

