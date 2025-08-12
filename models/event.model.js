// models/event.model.js
const events = []; // In-memory store

/**
 * Event structure:
 * {
 *   id: string,
 *   title: string,
 *   description: string,
 *   date: string (YYYY-MM-DD),
 *   time: string (HH:mm),
 *   organizerEmail: string,
 *   participants: [string] // array of attendee emails
 * }
 */

module.exports = { events };
