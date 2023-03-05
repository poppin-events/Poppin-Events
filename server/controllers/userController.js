// import the user model
const jwt_decode = require('jwt-decode');
const db = require('../models/dbModel');

const userController = {};

// decode jwt data for the requester's email
userController.getInfo = (req, res, next) => {
  // parse the jwt from the body of the request
  const {name, email} = jwt_decode(req.body.jwt);
  res.locals.email = token.email;
  res.locals.name = token.name;
  return next();
};

// get user info from database
userController.login = async (req, res, next) => {
  const query = `SELECT * FROM users WHERE email = ${res.locals.email}`; // FIXME: Need google data format to know what to query
  const user = await db.query(query);
  // if the user does not exist in the database, create them
  if (user === []) {
    const createUsr = 'INSERT INTO users (name, email) VALUES ($1, $2)';
    const userVals = [res.locals.name, res.locals.email];
    await db.query(createUsr, userVals);
  }
  return next();
};

// get user info from database
userController.getUser = async (req, res, next) => {
  const { email } = req.params;
  const query = `SELECT * FROM users WHERE email = ${email}`; // FIXME: Need google data format to know what to query
  const value = [id];
  const user = await db.query(query, value);
  // use array destructuring to get the first element of the array
  [res.locals.user] = user.rows;
  return next();
};

// create a new user in the database
// userController.createUser = async (req, res, next) => {

// }

module.exports = userController;
