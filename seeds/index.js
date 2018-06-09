require('dotenv').config();

const mongoose = require('mongoose');
const map = require('lodash/map');

const { usersSeeds } = require('./usersSeeds');
const { tasksSeeds } = require('./tasksSeeds');

const { logger } = require('../src/utils/logger');

const { MONGO_URI } = process.env;

const options = {
    autoReconnect: true,
};

const start = async () => {
    try {
        await mongoose.connect(MONGO_URI, options);
        logger.info('Connecting to Mongo...');
        mongoose.connection.on('error', (e) => {
            logger.error('Mongo error');
            logger.error(e);
        });
        logger.info('Connected to Mongo');

        logger.info('Clearing Database...');
        await mongoose.connection.db.dropDatabase();
        logger.info('Database cleared');

        logger.info('Seeding users...');
        const users = await usersSeeds();
        logger.info(`${users.length} users created`);

        logger.info('Seeding tasks...');
        const tasks = await tasksSeeds(map(users, '_id'));
        logger.info(`${tasks.length} tasks created`);
    } catch (e) {
        logger.error(e);
    }
};

start();
