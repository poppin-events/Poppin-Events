/* eslint-disable camelcase */
// import the event model
const db = require('../models/dbModel');

const eventController = {};

// get all events from database
eventController.getEvents = async (req, res, next) => {
  try {
    const query = await db.query('SELECT e.id, e.name, e.description, e.date, e.address, jsonb_agg(json_build_object(\'lat\', e.lat, \'lng\', e.lng)) AS location, u.name AS organizer, u.email, u.picture FROM events e LEFT OUTER JOIN users u ON e.organizer_id = u.id group by e.id, u.name, u.email, u.picture');
    res.locals.events = query.rows;
    return next();
  } catch (error) {
    return next({
      log: 'eventController.getEvents error',
      message: { err: 'Erro getting events from database' },
    });
  }
};

// // POSTMAN TEST create a new event in the database w/o JWT
// eventController.createEvent = async (req, res, next) => {
//   try {
//     const { name, description, date, location, email } = req.body;
//     // insert the event into the database using a subquery for the organizer id
// eslint-disable-next-line max-len
//     const addEventQuery = 'INSERT INTO events (name, description, date, location, organizer_id) VALUES ($1, $2, $3, $4, (SELECT id FROM users WHERE email=$5))';
//     const newEventVals = [name, description, date, location, email];
//     await db.query(addEventQuery, newEventVals);
//     return next();
//   } catch (error) {
//     return next({
//       log: 'eventController.createEvent error',
//       message: { err: 'Error creating event in database' },
//     });
//   }
// };

// create a new event in the database
eventController.createEvent = async (req, res, next) => {
  try {
    const { name, description, date, address } = req.body;
    const { lat, lng } = req.body.location;
    // insert the event into the database using a subquery for the organizer id
    const addEventQuery = 'INSERT INTO events (name, description, date, location, lat, lng, organizer_id) VALUES ($1, $2, $3, $4, $5, $6, (SELECT id FROM users WHERE email=$7))';
    const newEventVals = [name, description, date, address, lat, lng, res.locals.email];
    await db.query(addEventQuery, newEventVals);
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
  const {
    name, description, date, location, organizer_id,
  } = req.body;
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
