const { Router } = require('express');
const { body } = require('express-validator/check');

const { TaskService } = require('../services/task');

const { asyncHandler } = require('../../utils/express/asyncHandler');
const { validateMiddleware } = require('../../utils/express/validateMiddleware');

const { isDateValidator } = require('../../utils/validators/isDate');

const router = Router();

const taskCreateValidators = [
    body('title').exists().isString(),
    body('description').exists().isString(),
    body('dueDate').exists().custom(isDateValidator),
];

const taskUpdateValidators = [
    ...taskCreateValidators,
    body('isDone').isBoolean(),
];

router.route('/')
    .get(asyncHandler(TaskService.getAll))
    .post(taskCreateValidators, validateMiddleware, asyncHandler(TaskService.create))
    .delete(asyncHandler(TaskService.deleteAll));

router.route('/:id')
    .get(asyncHandler(TaskService.get))
    .put(taskUpdateValidators, validateMiddleware, asyncHandler(TaskService.update))
    .delete(asyncHandler(TaskService.delete));


module.exports = router;
