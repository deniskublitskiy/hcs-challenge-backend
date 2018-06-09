const mongoose = require('mongoose');

const { Schema } = mongoose;

const taskSchema = Schema({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    isDone: {
        type: Boolean,
        default: false,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        require: true,
    },
}, {
    timestamps: true,
    toObject: {
        virtuals: true,
    },
    toJSON: {
        virtuals: true,
    },
});

taskSchema.virtual('id').get(function getId() {
// eslint-disable-next-line no-underscore-dangle
    return this._id;
});

module.exports.Task = mongoose.model('Task', taskSchema);
