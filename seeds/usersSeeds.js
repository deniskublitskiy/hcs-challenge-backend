const times = require('lodash/times')

const { User } = require('../src/userManagement/models/User');

const getUsers = count => times(count, i => User.create({
    name: `testuser${i + 1}`,
    password: `testuser${i + 1}`,
}));

const usersSeeds = () => Promise.all(getUsers(5));

module.exports.usersSeeds = usersSeeds;
