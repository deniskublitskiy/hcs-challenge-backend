const HttpStatus = require('http-status-codes');
const pick = require('lodash/pick');

const { Task } = require('../models/Task');

class TaskService {
    static async get(req, res) {
        const query = { userId: req.user.id, _id: req.params.id };
        const task = await Task.findOne(query);

        if (!task) {
            res.sendStatus(HttpStatus.NOT_FOUND);
            return;
        }

        res.status(HttpStatus.OK).json(task);
    }

    static async getAll(req, res) {
        const query = { userId: req.user.id };
        const tasks = await Task.find(query).sort({ createdAt: -1 });

        res.status(HttpStatus.OK).json(tasks);
    }

    static async create(req, res) {
        const payload = {
            ...pick(req.body, ['title', 'dueDate', 'description']),
            userId: req.user.id,
        };

        let task = new Task(payload);
        task = await task.save();

        res.status(HttpStatus.CREATED).json(task);
    }

    static async update(req, res) {
        const payload = pick(req.body, ['title', 'isDone', 'dueDate']);
        const query = { userId: req.user.id, _id: req.params.id };

        const task = await Task.findOneAndUpdate(query, payload);

        if (task) {
            res.status(HttpStatus.OK).json(task);
            return;
        }

        res.sendStatus(HttpStatus.NOT_FOUND);
    }

    static async delete(req, res) {
        const query = { userId: req.user.id, _id: req.params.id };
        const task = await Task.findOneAndRemove(query);

        if (task) {
            res.sendStatus(HttpStatus.NO_CONTENT);
            return;
        }

        res.sendStatus(HttpStatus.NOT_FOUND);
    }

    static async deleteAll(req, res) {
        const query = { userId: req.user.id };
        await Task.remove(query);

        res.sendStatus(HttpStatus.NO_CONTENT);
    }
}

module.exports.TaskService = TaskService;
