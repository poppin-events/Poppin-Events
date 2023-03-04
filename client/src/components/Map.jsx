import '../stylesheets/App.css';
import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
require('dotenv').config;

function Map() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <GoogleMap zoom={10} center={{lat: 44, lng: -80}} mapContainerClassName="map-container"></GoogleMap>;
}

export default Map;
