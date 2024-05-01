const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    exercise: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Exercise"
    },
    log: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Log'
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;