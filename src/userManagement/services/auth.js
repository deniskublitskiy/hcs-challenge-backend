const HttpStatus = require('http-status-codes');
const pick = require('lodash/pick');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const { User } = require('../models/User');

const { TOKEN_EXPIRY } = process.env;

class AuthService {
    static async signUp(req, res) {
        const user = new User(pick(req.body, ['name', 'password']));
        await user.save();

        const payload = {
            userId: user.id,
        };

        const token = jwt.sign(payload, user.jwtSecret, { expiresIn: TOKEN_EXPIRY });
        const response = { token };

        res.status(HttpStatus.CREATED).json(response);
    }

    static async signIn(req, res) {
        const { name, password } = req.body;
        const query = { name };
        const user = await User.findOne(query, 'password jwtSecret');

        if (!user) {
            res.status(HttpStatus.BAD_REQUEST).json({
                errors: [{
                    code: 'INVALID_NAME',
                    message: 'Invalid name',
                }],
            });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(HttpStatus.BAD_REQUEST).json({
                errors: [{
                    code: 'INVALID_PASSWORD',
                    message: 'Invalid password',
                }],
            });
            return;
        }

        const payload = {
            userId: user.id,
        };
        const token = jwt.sign(payload, user.jwtSecret, { expiresIn: TOKEN_EXPIRY });
        const response = { token };

        res.status(HttpStatus.OK).json(response);
    }

    static async logOut(req, res) {
        const payload = { jwtSecret: crypto.randomBytes(256).toString('hex') };
        const user = await User.findByIdAndUpdate(req.user.id, payload);

        if (!user) {
            res.sendStatus(HttpStatus.NOT_FOUND);
        }

        res.sendStatus(HttpStatus.OK);
    }

    static async verify(req, res, next) {
        const { token } = req;

        if (!token) {
            res.sendStatus(HttpStatus.UNAUTHORIZED);
            return;
        }

        const payload = jwt.decode(token);

        if (!payload) {
            res.sendStatus(HttpStatus.UNAUTHORIZED);
            return;
        }

        const user = await User.findById(payload.userId, 'jwtSecret');

        if (!user) {
            res.sendStatus(HttpStatus.UNAUTHORIZED);
            return;
        }

        jwt.verify(token, user.jwtSecret);

        req.user = {
            id: user.id,
        };

        next();
    }
}

module.exports.AuthService = AuthService;
