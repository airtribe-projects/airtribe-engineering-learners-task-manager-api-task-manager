<!-- Features -->
# User registration and login (bcrypt hashed passwords + JWT).
# Role-based access: organizer and attendee.
# In-memory data models for users and events:
# Events store: id, title, description, date, time, organizerEmail, participants.
# Event CRUD — only accessible to authenticated organizers.
# Participant registration for events (adds email to event participants).
# Email notification sent asynchronously on registration (nodemailer + SMTP provider like Brevo).
# Simple, RESTful APIs (see Endpoints).

<!-- Serve/Run the app -->
use node app.js to serve the app.

<!-- User Endpoints -->
1. POST : /register
Example Expected Body: {"name": "Nitish","email": "nitish@example.com","password": "strongPassword","role": "attendee"   // or "organizer"}

2. POST : /login
Example Expected Body:{"email": "nitish@example.com","password": "strongPassword"}
// Returns jwt token to enable role base access.

<!-- Events Endpoints -->
Authenticates the user first
1. GET:  /events
returns list of all events.

2. GET: /events/:id
returns the event based on id

3. POST: /events (organizer only)
Expected Example body: {"title": "Webinar","description": "About X","date": "2025-08-20","time": "18:30"}

4. PUT: /events/:id (organizer only)
update event (only if organiserEmail matches token).

5. DELETE: /events/:id (organizer only)
Delete event (only if organiserEmail matches token).

6. POST: /events/:id/register (authenticated)
# Register authenticated user for event. The server:
# Validates token and extracts email.
# Prevents duplicates (participants array).
# Pushes the user's email into participants.
# Asynchronously sends confirmation email; registration persists even if email sending fails.
# Request body: none. Header: Authorization: Bearer <token>.
# Success returns updated event.

