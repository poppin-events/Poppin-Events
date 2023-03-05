const sessionController = {};

sessionController.validateSession = (req, res, next) => {
  console.log('validating session...');
  console.log('req.session is currently: ', req.session);
  if (req.session.loggedIn) {
    res.locals = {
      name: req.session.name,
      email: req.session.email,
      picture: req.session.picture,
      loggedIn: req.session.loggedIn,
    };
  } else {
    res.locals.loggedIn = false;
  }
  next();
};
sessionController.deleteSession = (req, res, next) => {
  console.log('deleting session...');
  req.session.destroy(e => console.log(e));
  next();
};

module.exports = sessionController;
