const express = require('express');
const bodyParser = require('body-parser');
const { errorHandler } = require('./utils/express/errorHandler');
const bearerToken = require('express-bearer-token');
const morgan = require('morgan');
const cors = require('cors');

const authRouter = require('./userManagement/routes/auth');
const usersRouter = require('./userManagement/routes/users');
const tasksRouter = require('./taskManagement/routes/tasks');

const { AuthService } = require('./userManagement/services/auth');

const app = express();

app.disable('x-powered-by');

app.use(cors());
app.use(bearerToken());
app.use(morgan('short'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/auth', authRouter);
app.use('/api/user', AuthService.verify, usersRouter);
app.use('/api/tasks', AuthService.verify, tasksRouter);


app.use(errorHandler);

module.exports = { app };
