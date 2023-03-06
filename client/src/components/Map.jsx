import '../stylesheets/App.css';
import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';
import axios from 'axios';
import MarkerCreator from './MarkerCreator';

function Map() {
  const [mapPos, setMapPos] = useState({ lat: 0.37766641e2, lng: -0.123098308e3 });
  const [markerData, setMarkerData] = useState([]);
  const [eventData, setEventData] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  // get all markers from database
  useEffect(() => {
    try {
      const getEvents = async () => {
        const response = await axios.get('/api/events');
        const { data } = response;
        setMarkerData(data);
      };
      getEvents();
    } catch (e) {
      console.log('error in getEvents: ', e.message);
    }
  }, []);

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

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="map-section">
      <GoogleMap
        zoom={10}
        center={mapPos}
        mapContainerClassName="map-container box-shadow-1"
      >
        <button className="current-location-button" onClick={() => currPosition()}>Go to current location</button>
        {markerData.length > 0 && markerData.map((place) => (
          <Marker
            key={place.id}
            title={place.name}
            position={place.location[0]}
            onClick={() => setEventData(place)}
          />
        ))}
      </GoogleMap>
      <MarkerCreator />
      {
        eventData &&
        (<div className="info-container">
          <ul className="info-list">
            <li className="info-list-item">Event Title: {eventData.name}</li>
            <li className="info-list-item">Organizer: {eventData.organizer}</li>
            <li className="info-list-item">Email: {eventData.email}</li>
            <li className="info-list-item">Location: {eventData.address}</li>
            <li className="info-list-item">Date: {(new Date(eventData.date)).toUTCString()}</li>
            <li className="info-list-item">Description: {eventData.description}</li>
          </ul>
        </div>)
      }

    </div>
  );
}

export default Map;
