/* eslint-disable camelcase */
// import the event model
const db = require('../models/dbModel');

const eventController = {};

// get all events from database
eventController.getEvents = async (req, res, next) => {
  try {
    // select event information, using jsonb_agg to create a json object out of lat and lng by declaring key/value pairs
    const query = await db.query(
      "SELECT e.id, e.name, e.description, e.date, e.loc_name AS locName, e.address, jsonb_agg(json_build_object('lat', e.lat, 'lng', e.lng)) AS location, u.name AS organizer, u.email, u.picture FROM events e LEFT OUTER JOIN users u ON e.organizer_id = u.id group by e.id, u.name, u.email, u.picture"
    );
    res.locals.events = query.rows;
    // query shape: {something: x, rows:[{data}, {data2}], blah: y, ....}
    return next();
  } catch (error) {
    return next({
      log: 'eventController.getEvents error',
      message: { err: 'Error getting events from database' },
    });
  }
};

// create a new event in the database
eventController.createEvent = async (req, res, next) => {
  try {
    console.log('in event creator with req: ', req.body);
    const { name, description, date, locName, address, userID } = req.body;
    const { lat, lng } = req.body.location[0];
    // insert the event into the database using a subquery for the organizer id
    const addEventQuery =
      'INSERT INTO events (name, description, date, loc_name, address, lat, lng, organizer_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id';
    const newEventVals = [
      name,
      description,
      date,
      locName,
      address,
      lat,
      lng,
      userID,
    ];
    console.log('hello we made it here');
    const newEvent = await db.query(addEventQuery, newEventVals);
    // **note - that rows[0] will actually be an OBJECT containing {id: <some number>} ** !
    res.locals.id = newEvent.rows[0];
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
  const { name, description, date, locName, address, userID, eventID } =
    req.body;
  const { lat, lng } = req.body.location[0];
  const values = [
    name,
    description,
    date,
    locName,
    address,
    lat,
    lng,
    userID,
    eventID,
  ];
  const text =
    'UPDATE events SET name = $1, description = $2, date = $3, loc_name = $4, address = $5, lat = $6, lng = $7 WHERE organizer_id = $8 AND id = $9;';
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
  const { eventID, userID } = req.body.deleteReq;
  const values = [eventID, userID];
  const text = 'DELETE FROM events WHERE id = $1 AND organizer_id = $2';
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

// getting all the events associated BASED ON PARTICULAR USER
eventController.getUsersEvents = async (req, res, next) => {
  const onlyEvents = [];
  const { userID } = req.params;
  const getUsersQuery = 'SELECT events_id FROM attendees WHERE users_id = ($1)';
  const values = [userID];
  try {
    const usersEvents = await db.query(getUsersQuery, values);
    usersEvents.rows.map((event) => {
      onlyEvents.push(event.events_id);
      return onlyEvents;
    });
    console.log(onlyEvents);
    res.locals.usersEvents = onlyEvents;
    return next();
  } catch (error) {
    return next({
      log: 'eventController.getUsersEvents error',
      message: { err: 'Error getting all of users events from database' },
    });
  }
};

// getting all events BASED ON EVENT
eventController.getEvents2 = async (req, res, next) => {
  // console.log('res.locals.addedAttendee is', res.locals.addedAttendee);
  // console.log('WHY ARE YOU NOT PRINTING');
  const onlyEvents = [];
  const { userId } = req.body;
  const getUsersQuery = 'SELECT events_id FROM attendees WHERE users_id = ($1)';
  const values = [userId];
  try {
    const usersEvents = await db.query(getUsersQuery, values);
    usersEvents.rows.map((event) => {
      onlyEvents.push(event.events_id);
      return onlyEvents;
    });
    res.locals.usersEvents = onlyEvents;
    return next();
  } catch (error) {
    return next({
      log: 'eventController.getUsersEvents error',
      message: { err: 'Error getting all of users events from database' },
    });
  }
};

module.exports = eventController;
