// import the event model
const db = require('../models/model');

const eventController = {};

// get all events from database
eventController.getEvents = async (req, res, next) => {
  try {
    const query = await db.query('SELECT * FROM events');
    res.locals.events = query.rows;
    return next();
  } catch (error) {
    return next({
      log: 'eventController.getEvents error',
      message: { err: 'Erro getting events from database' },
    });
  }
};

// create a new event in the database
eventController.createEvent = async (req, res, next) => {
  const { name, description, date, location, organizer_id } = req.body;
  const values = [name, description, date, location, organizer_id];
  const text = 'INSERT INTO events (name, description, date, location, orgaizer_id) VALUES ($1, $2, $3, $4, $5) RETURNING *';
  try {
    await db.query(text, values);
    return next();
  } catch (error) {
    return next({
      log: 'eventController.createEvent error',
      message: { err: 'Error creating event in database' },
    });
  }
};

// update an event in the database
eventController.updateEvent = async (req, res, next) => {
  const { name, description, date, location, organizer_id } = req.body;
  const values = [name, description, date, location, organizer_id];
  const text = 'UPDATE events SET name = $1, description = $2, date = $3, location = $4, organizer_id = $5 WHERE id = $6';
  try {
    await db.query(text, values);
    return next();
  } catch (error) {
    return next({
      log: 'eventController.updateEvent error',
      message: { err: 'Error updating event in database' },
    });
  }
};

// delete an event from the database
eventController.deleteEvent = async (req, res, next) => {
  const { id } = req.body;
  const values = [id];
  const text = 'DELETE FROM events WHERE id = $1';
  try {
    await db.query(text, values);
    return next();
  } catch (error) {
    return next({
      log: 'eventController.deleteEvent error',
      message: { err: 'Error deleting event from database' },
    });
  }
};

module.exports = eventController;
