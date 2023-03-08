const db = require('../models/dbModel');

const attendeeController = {};

// add eventID to the attendee table

attendeeController.addAttendee = async (req, res, next) => {
  // need to get event ID from req.params
  // need to get the user ID from req.body
  console.log('inside of addAttendee');
  const { eventID } = req.params;
  const { userID } = req.body;
  const addAttendeeQuery =
    'INSERT INTO attendees (events_id, users_id) VALUES ($1, $2)'
  const newAttendeeRow = [ eventID, userID ];
  try {
    const response = await db.query(addAttendeeQuery, newAttendeeRow);
    console.log('response is', response);
    res.locals.addedAttendee = response;
    return next();
  } catch (error) {
    return next({
      log: 'attendeeController.addAttendee error',
      message: { err: 'Error adding attendee in database'}
    });
  }
};

// gets the list of attendees for an event, returning their 
attendeeController.getAttendees = async (req, res, next) => {
  const { eventID } = req.params;
  const { userID } = req.body;
  const query = 'SELECT * FROM users WHERE id IN (SELECT users_id FROM attendees WHERE events_id = ($1)'
  const values = [eventID];

  try {
    const response = await db.query(query, values);
    console.log('response is', response);
    // at this point response should be an array of user IDs
    // from users table, get a list of users where userID is 
    return next();
  } catch (err) {
    return next({
      log: 'attendeeController.getAttendees error',
      message: {
        err: err
      }
    });
  };
};



// delete attendees from attendee table
attendeeController.deleteAttendee = async (req, res, next) => {
  try {
    const { eventID } = req.params;
    const deleteQuery = 'DELETE FROM attendees WHERE events_id = ($1)';
    const values = [ eventID ]
    await db.query(deleteQuery, values);
    return next();
  } catch (error) {
      return next({
        log: 'attendeeController.deleteAttendee error',
        message: { err: 'Error deleting attendee in database'}
      })
  }
};

module.exports = attendeeController;