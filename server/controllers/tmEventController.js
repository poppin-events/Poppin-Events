const tmEventController = {};

// get all events in a specific city
tmEventController.getEvents = async (req, res, next) => {
  const { city, state } = res.locals; //Erika: I added state to this since you'll need to query city + state and changed req.params to res.locals!
  try {

    res.locals.events
    return next();
  } catch (error) {
    return next();
  }
};

module.exports = tmEventController;