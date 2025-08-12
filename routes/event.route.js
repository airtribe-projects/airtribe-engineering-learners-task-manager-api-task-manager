const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const { events } = require('../models/event.model');

// Middleware to extract token from Authorization header
const getTokenFromHeader = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;
    return authHeader;
};

// CREATE
router.post('/', (req, res) => {
    try {
        const token = getTokenFromHeader(req);
        const event = eventController.createEvent(token, req.body);
        res.json(event);
    } catch (err) {
        res.status(403).json({ error: err.message });
    }
});

// Get all Events
router.get('/', (req, res) => {
    res.send(events);
});

// Get one Event
router.get('/:id', (req, res) => {
    try {
        const event = eventController.getEventById(req.params.id);
        res.json(event);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

// UPDATE
router.put('/:id', (req, res) => {
    try {
        const token = getTokenFromHeader(req);
        const event = eventController.updateEvent(token, req.params.id, req.body);
        res.json(event);
    } catch (err) {
        res.status(403).json({ error: err.message });
    }
});

// DELETE
router.delete('/:id', (req, res) => {
    try {
        const token = getTokenFromHeader(req);
        const deletedEvent = eventController.deleteEvent(token, req.params.id);
        res.json(deletedEvent);
    } catch (err) {
        res.status(403).json({ error: err.message });
    }
});

router.post('/:id/register', (req, res) => {
    const token = getTokenFromHeader(req);
    eventController.registerForEvent(token, req.params.id)
        .then(updatedEvent => res.json(updatedEvent))
        .catch(err => res.status(403).json({ error: err.message }));
});


module.exports = router;
