const { events } = require('../models/event.model');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/email');

const authorizeOrganizer = (token) => {
    if (!token) throw new Error('No token provided');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'organizer') {
        throw new Error('Only organizers can perform this action');
    }
    return decoded.email;
};

// CREATE event
const createEvent = (token, { title, description, date, time }) => {
    const organizerEmail = authorizeOrganizer(token);
    const event = {
        id: uuidv4(),
        title,
        description,
        date,
        time,
        organizerEmail,
        participants: []
    };
    events.push(event);
    return event;
};

// READ single event
const getEventById = (id) => {
    const event = events.find(e => e.id === id);
    if (!event) throw new Error('Event not found');
    return event;
};

// UPDATE event
const updateEvent = (token, id, updatedData) => {
    const organizerEmail = authorizeOrganizer(token);
    const event = events.find(e => e.id === id);
    if (!event) throw new Error('Event not found');
    if (event.organizerEmail !== organizerEmail) throw new Error('Unauthorized to edit this event');

    Object.assign(event, updatedData);
    return event;
};

// DELETE event
const deleteEvent = (token, id) => {
    const organizerEmail = authorizeOrganizer(token);
    const index = events.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Event not found');
    if (events[index].organizerEmail !== organizerEmail) throw new Error('Unauthorized to delete this event');

    return events.splice(index, 1)[0];
};

const registerForEvent = (token, eventId) => {
    if (!token) throw new Error('No token provided');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const event = events.find(e => e.id === eventId);
    if (!event) throw new Error('Event not found');

    if (event.participants.includes(decoded.email)) {
        throw new Error('User already registered for this event');
    }

    event.participants.push(decoded.email);

    // Prepare email
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: decoded.email,
        subject: `Registration confirmed for ${event.title}`,
        text: `Hello, you have successfully registered for "${event.title}" on ${event.date} at ${event.time}.`
    };
    // Send email and return promise
    return sendEmail(mailOptions)
        .then(info => {
            return event; // return updated event after email sent
        })
        .catch(err => {
            return event; // still return event even if email fails
        });
};

module.exports = { createEvent, getEventById, updateEvent, deleteEvent, registerForEvent, events };
