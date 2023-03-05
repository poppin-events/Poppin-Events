import '../stylesheets/App.css';
import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

// import * as dotenv from 'dotenv'
// dotenv.config()
// require('dotenv').config;

// const script = document.createElement('script');
// script.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap';
// script.async = true;

function Map() {
  const [mapPos, setMapPos] = useState({ lat: 44, lng: -80 });
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyBCOm76ZZYuU7YSbYUmDRwhdj8XTW5K5jk',
  });

  if (!isLoaded) return <div>Loading...</div>;

  const currPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          // change map center positioning state
          setMapPos(pos);
        },
      );
    }
  };

  return (
    <div>
      <input type="button" onClick={(e)=>currPosition()} />
      <GoogleMap
        zoom={10}
        center={mapPos}
        mapContainerClassName="map-container"
      >
      </GoogleMap>
    </div>
  );
}

export default Map;
