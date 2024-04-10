const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the event
const eventSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String, // You can use Date type if you want to store time as well
        required: true
    },
    details: {
        type: String,
        required: true
    }
});

// Create a model for the event schema
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
