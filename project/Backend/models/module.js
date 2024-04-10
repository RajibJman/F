const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moduleSchema = new Schema({
    moduleName: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    moduleStatus: {
        type: String,
        enum: ['pending', 'ongoing', 'complete'],
        default: 'pending'
    },
    quizId: {
        type: Schema.Types.ObjectId,
        ref: 'Quiz',
        required: false
    },
    trainer: [{
        register_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Register',
            required: false
        }
    }],
    level: {
        type: String,
        enum: ['basic', 'intermediate', 'advanced'],
        default: 'basic'
    },
    traineeCount: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Module', moduleSchema);
