const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    count: {
        type: Number,
        required: true
    },
    log: []
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;