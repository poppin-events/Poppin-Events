// import the user model
const jwt_decode = require('jwt-decode'); // ended up only using jwt_decode on front end
const db = require('../models/dbModel');

const userController = {};

// get user info from database
userController.login = async (req, res, next) => {
  try {
    // console.log('req body in userController.login', req.body);
    const { name, email, picture } = req.body;
    const query = `SELECT * FROM users WHERE email = '${email}'`;
    const user = await db.query(query);
    // if the user does not exist in the database, create them
    const userVals = [name, email, picture];
    if (user.rows.length) res.locals.id = user.rows[0].id;
    if (user.rows.length === 0) {
      const createUsr = 'INSERT INTO users (name, email, picture) VALUES ($1, $2, $3) RETURNING id';
      const newUser = await db.query(createUsr, userVals);
      res.locals.id = newUser.rows[0];
    } else if (user.rows[0].picture !== picture) {
      const updatePic = 'UPDATE users SET picture = $2 WHERE email = $1;';
      await db.query(updatePic, userVals.slice(1));
    }
    req.session.loggedIn = true;
    req.session.email = email;
    req.session.name = name;
    req.session.picture = picture;
    req.session.userID = res.locals.id;
    return next();
  } catch (e) {
    return next({
      log: 'Error in userController.login',
      status: 500,
      message: { error: e.message },
    });
  }
};

// get user info from database
userController.getUser = async (req, res, next) => {
  const { email } = req.params;
  const query = `SELECT * FROM users WHERE email = ${email}`;
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
