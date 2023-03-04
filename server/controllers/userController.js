// import the user model
const db = require('../models/dbModel');

const userController = {};

// get user info from database
userController.getUser = async (req, res, next) => {
  const { id } = req.params;
  const query = 'SELECT * FROM users WHERE google_id = $1'; // FIXME: Need google data format to know what to query
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
