require('dotenv').config();

const mongoose = require('mongoose');

const { logger } = require('./utils/logger');
const { app } = require('./app');

const { PORT = 3000, MONGO_URI } = process.env;

let server = null;

// eslint-disable-next-line prefer-destructuring
process.title = process.argv[2];

process.on('uncaughtException', e => logger.error(e));
process.on('unhandledRejection', e => logger.error(e));

process.on('SIGTERM', async () => {
    logger.info('Shutdown started');

    logger.info('Stopping server...');
    await server.close();
    logger.info('Closing Mongo connection...');
    await mongoose.connection.close();

    logger.info('Process is stopping...');
});

const options = {
    autoReconnect: true,
};

const start = async () => {
    try {
        await mongoose.connect(MONGO_URI, options);
        mongoose.connection.on('error', (e) => {
            logger.error('Mongo error');
            logger.error(e);
        });
        logger.info('Connected to Mongo');

        server = app.listen(PORT, () => {
            logger.info(`Service started on port ${PORT}`);
        });
    } catch (e) {
        setTimeout(start, 2000);
        logger.error(e);
    }
};

start();

module.exports = app;
