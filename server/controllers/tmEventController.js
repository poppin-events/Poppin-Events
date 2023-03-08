const tmEventController = {};

// get all events in a specific city
tmEventController.getEvents = (req, res, next) => {
  const { city, state } = res.locals;
  const { TICKETMASTER_API_KEY } = process.env;
  // console.log('city: ', city);
  // console.log('state: ', state);
  // console.log('tm API key: ', TICKETMASTER_API_KEY);

  fetch(`https://app.ticketmaster.com/discovery/v2/events.json?city=${city}&state=${state}&size=25&apikey=${TICKETMASTER_API_KEY}`)
    .then((response) => response.json())
    .then((data) => {
      const myEvents = data._embedded.events;
      // console.log('myEvents from ticketmaster: ', myEvents);
      const extracted = {};

      // only pull the first 10 events
      for (let i = 0; i < 25; i += 1) {
        // console.log('i value', i);
        // console.log('eventID: ', myEvents[i].id);
        // console.log('event name: ', myEvents[i].name);
        // console.log('event start date: ', myEvents[i].dates.start.dateTime);
        // console.log('locname: ', myEvents[i]._embedded.venues[0].name);
        // console.log('address: ', `${myEvents[i]._embedded.venues[0].address.line1}, ${myEvents[i]._embedded.venues[0].city.name}, ${myEvents[i]._embedded.venues[0].state.stateCode}, ${myEvents[i]._embedded.venues[0].postalCode}`);
        // console.log('lat: ', myEvents[i]._embedded.venues[0].location.latitude);
        // console.log('lng: ', myEvents[i]._embedded.venues[0].location.longitude);
        // console.log('url: ', myEvents[i].url);

        // each event details
        const details = {
          userID: 1,
          name: myEvents[i].name,
          date: myEvents[i].dates.start.dateTime,
          locname: myEvents[i]._embedded.venues[0].name,
          address: `${myEvents[i]._embedded.venues[0].address.line1}, ${myEvents[i]._embedded.venues[0].city.name}, ${myEvents[i]._embedded.venues[0].state.stateCode} ${myEvents[i]._embedded.venues[0].postalCode}`,
          lat: myEvents[i]._embedded.venues[0].location.latitude,
          lng: myEvents[i]._embedded.venues[0].location.longitude,
          description: '',
          rsvp: myEvents[i].url,
          picture: myEvents[i].images[0].url,
        };
        extracted[myEvents[i].id] = details;
      }
      // console.log('extracted events object: ', extracted);
      res.locals.events = extracted;
      return next();
    })
    .catch((error) => next({
      log: 'tmEventController.getEvents error: Error getting events from ticketmaster.',
      status: 404,
      message: { err: error },
    }));
};

module.exports = tmEventController;
