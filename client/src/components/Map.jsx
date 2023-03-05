import '../stylesheets/App.css';
import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

// const script = document.createElement('script');
// script.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap';
// script.async = true;

function Map() {
  const [mapPos, setMapPos] = useState({ lat: 44, lng: -80 });
  const [markerData, setMarkerData] = useState([]);
  const [eventData, setEventData] = useState({title: "No Party", creator: "Derrick", location: {lat: 37.772, lng: -122.214}, date: "Dec 11", description: "ITS WORKING"});
  const [map, setMap] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  // if (!isLoaded) return <div>Loading...</div>;

  const markers = []; // every element is a marker jsx element
  // get all markers from database
  const data = [{title: "Party Time", creator: "Derrick", location: {lat: 44, lng: -80}, date: "Dec 11", description: "ITS WORKING"}, {title: "Party #2", creator: "Derrick", location: {lat: 43, lng: -80}, date: "Jan 1", description: "HELLO"}, {title: "Party 3!!!", creator: "Jonathan", location: {lat: 42, lng: -80}, date: "March 5th", description: "WORKING TEST!!!!"}];

  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => {
        setMarkerData(data);
      });
  }, []);

  const eventBox = (el) => {
    setEventData(el);
  };

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
        {markerData.map((place) => (
          <Marker title={place.title} position={place.location} onClick={() => eventBox(place)} />
        ))}
    </GoogleMap>
      {map}
    </div>
  );
}

export default Map;