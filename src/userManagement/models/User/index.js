const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// const { passwordValidator } = require('../../../utils/validators/password');

const { Schema } = mongoose;

const userSchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        editable: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
        // validators: {
        //     validator: passwordValidator,
        // },
    },
    jwtSecret: {
        type: String,
        required: true,
        select: false,
        default: () => crypto.randomBytes(256).toString('hex'),
    },
}, {
    timestamps: true,
});

userSchema.pre('save', async function beforeSave(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(this.password, salt);

        this.set('password', hash);
    }

    next();
});

module.exports.User = mongoose.model('User', userSchema);
