const express = require('express');
const userController = require('../controllers/userController');
const eventController = require('../controllers/eventController');

const router = express.Router();

// Responds with user info (location + events) when passed in the correct google id
router.get(
  '/user/:id',
  userController.getUser,
  (req, res) => res.status(200).json(res.locals.user),
);

// Create a new user in the database
router.post(
  '/user',
  userController.createUser,
  (req, res) => res.end(),
);

// Responds with all events in the database (Name, Location, Date, Description, Created By)
router.get(
  '/events',
  eventController.getEvents,
  (req, res) => res.status(200).json(res.locals.events),
);

// Create an event in the database
router.post(
  '/event',
  eventController.createEvent,
  (req, res) => res.sendStatus(200),
);

// Update an event in the database
router.put(
  '/event',
  eventController.updateEvent,
  (req, res) => res.sendStatus(200),
);

// Delete an event in the database
router.delete(
  '/event',
  eventController.deleteEvent,
  (req, res) => res.sendStatus(200),
);

module.exports = router;
