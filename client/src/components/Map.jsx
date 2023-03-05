import '../stylesheets/App.css';
import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import axios from 'axios';

// const script = document.createElement('script');
// script.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap';
// script.async = true;

function Map() {
  const [mapPos, setMapPos] = useState({ lat: 44, lng: -80 });
  const [markerData, setMarkerData] = useState([]);
  const [eventData, setEventData] = useState({title: "No Party", creator: "Derrick", location: {lat: 37.772, lng: -122.214}, date: "Dec 11", description: "ITS WORKING"});

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  // get all markers from database
  // const data = [{title: "Party Time", creator: "Derrick", location: {lat: 44, lng: -80}, date: "Dec 11", description: "ITS WORKING"}, {title: "Party #2", creator: "Derrick", location: {lat: 43, lng: -80}, date: "Jan 1", description: "HELLO"}, {title: "Party 3!!!", creator: "Jonathan", location: {lat: 42, lng: -80}, date: "March 5th", description: "WORKING TEST!!!!"}];

  useEffect(() => {
    const getEvents = async () => {
      const response = await axios.get('/api/events');
      console.log('IN USE EFFECT response is: ', response);
      const { data } = response;
      setMarkerData(data);
    };
    getEvents();
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
    <div>
      <div className="info">
        <p>Event Title: {eventData.name}</p>
        <p>Event Creator: {eventData.creator}</p>
        <p>Event Location: {eventData.location.lat} {eventData.location.lng}</p>
        <p>Event Date: {eventData.date}</p>
        <p>Event Description: {eventData.description}</p>
      </div>
      <input type="button" onClick={() => currPosition()} />
      <GoogleMap
        zoom={10}
        center={mapPos}
        mapContainerClassName="map-container"
      >
        {markerData.length > 0 && markerData.map((place) => (
          <Marker key={place.id} title={place.name} position={place.location[0]} onClick={() => setEventData(place)} />
        ))}
    </GoogleMap>
    </div>
  );
}

export default Map;