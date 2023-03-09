const express = require('express');
const userController = require('../controllers/userController');
const eventController = require('../controllers/eventController');
const sessionController = require('../controllers/sessionController');
const attendeeController = require('../controllers/attendeeController');

const router = express.Router();

// Responds with user info (location + events) when passed in the correct google id
// router.get(
//   '/user/:id',
//   userController.getUser,
//   (req, res) => res.status(200).json(res.locals.user),
// );

// Log in or a new user in the database
router.post('/users', userController.login, (req, res) =>
  res.status(200).json(res.locals.id)
);

// Responds with all events in the database (Name, Location, Date, Description, Created By)
router.get('/events', eventController.getEvents, (req, res) =>
  res.status(200).json(res.locals.events)
);

// Create an event in the database
router.post('/events', eventController.createEvent, (req, res) =>
  res.status(200).json(res.locals.id)
);

// Update an event in the database
router.put('/events', eventController.updateEvent, (req, res) =>
  res.sendStatus(200)
);

// Delete an event in the database
router.delete('/events', eventController.deleteEvent, (req, res) =>
  res.sendStatus(200)
);

router.get(
  '/userEventData/:userID',
  eventController.getUsersEvents,
  (req, res) => res.status(200).json(res.locals.usersEvents)
);

// Create an attendee in the database
router.post(
  '/attendees/:eventID',
  attendeeController.addAttendee,
  eventController.getEvents2,
  (req, res) => res.status(200).json(res.locals.usersEvents)
);

// Get the list of attendees for an event
router.get(
  '/attendees/:eventID',
  attendeeController.getAttendees,
  (req, res) => {
    return res.status(200).json(res.locals.eventsAttendees);
  }
);

// stretch goal
// router.delete('/attendees/:eventId',
//   attendeeController.deleteAttendee,
//   (req, res) => {
//     // should we return the deletedAttendee?
//     res.sendStatus(200)
//   },
// );

// Checks for active sessions
router.get('/sessions', sessionController.validateSession, (req, res) =>
  res.status(200).send(res.locals)
);
router.delete('/sessions', sessionController.deleteSession, (req, res) =>
  res.sendStatus(200)
);

module.exports = router;
