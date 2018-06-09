const HttpStatus = require('http-status-codes');

const { User } = require('../models/User');

class UserService {
    static async get(req, res) {
        const user = await User.findById(req.user.id);

        if (!user) {
            res.sendStatus(HttpStatus.NOT_FOUND);
            return;
        }

        res.status(HttpStatus.OK).json(user);
    }
}

module.exports.UserService = UserService;
