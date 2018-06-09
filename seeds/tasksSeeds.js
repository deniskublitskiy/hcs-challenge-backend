const faker = require('faker');
const times = require('lodash/times');
const sample = require('lodash/sample');
const { Task } = require('../src/taskManagement/models/Task');

const getTasks = (count, usersIds) => times(count, () => ({
    userId: sample(usersIds),
    title: faker.lorem.words(),
    description: faker.lorem.text(),
    isDone: faker.random.boolean(),
    dueDate: faker.date.future(),
}));

const tasksSeeds = usersIds => Task.insertMany(getTasks(300, usersIds));

module.exports.tasksSeeds = tasksSeeds;
