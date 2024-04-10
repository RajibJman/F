const Event = require('../models/event');

async function createEvent(req, res) {
    const { date, time, details } = req.body;
    
    try {
        const existingEvent = await Event.findOne({ date, time, details });
        if (existingEvent) {
            return res.status(400).json({ error: 'Event already exists' });
        }
        
        const newEvent = new Event({
            date,
            time,
            details
        });

        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function updateEvent(req, res) {
    const { id } = req.params;
    const eventData = req.body;

    try {
        const updatedEvent = await Event.findByIdAndUpdate(id, eventData, { new: true });
        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function deleteEvent(req, res) {
    const { id } = req.params;

    try {
        const deletedEvent = await Event.findByIdAndDelete(id);
        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json({ message: 'Event deleted successfully', event: deletedEvent });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function getAllEvents(req, res) {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    createEvent,
    getAllEvents,
    updateEvent,
    deleteEvent
};
