const geocodeController = {};

geocodeController.reverseGeocode = (req, res, next) => {
  // variables to use
  const { lat, lng } = req.params;
  console.log('lat: ', lat);
  console.log('lng: ', lng);
  const { VITE_GOOGLE_MAPS_API_KEY } = process.env;
  console.log('VITE_GOOGLE_MAPS_API_KEY', VITE_GOOGLE_MAPS_API_KEY);

  // fetch from Google Geocode API
  fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${VITE_GOOGLE_MAPS_API_KEY}`)
    .then((response) => response.json())
    .then((locationData) => {
      console.log('locationData: ', locationData);

      for (let i = 0; i < locationData.results[0].address_components.length; i += 1) {
        locationData.results[0].address_components[i].types.forEach((type) => {
          if (type.includes('locality')) {
            res.locals.city = locationData.results[0].address_components[i].long_name;
          }
          if (type.includes('administrative_area_level_1')) {
            res.locals.state = locationData.results[0].address_components[i].long_name;
          }
        });
      }
      if (res.locals.city && res.locals.state) {
        return next();
      }
      return next({
        log: 'Error in geocodeController.reverseGeocode middleware',
        status: 500,
        message: { err: 'Error in geocodeController.reverseGeocode middleware' },
      });
    })
    .catch((error) => {
      next({
        log: 'Error in geocodeController.reverseGeocode: city not found from Google Geocode API fetch',
        status: 404,
        message: { err: error },
      });
    });
};

module.exports = geocodeController;
