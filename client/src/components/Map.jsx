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

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  //if (!isLoaded) return <div>Loading...</div>;

  const markers = []; // every element is a marker jsx element
  // get all markers from database
  const data = [{title: "Party Time", creator: "Derrick", location: {lat: 37.772, lng: -122.214}, date: "Dec 11", description: "ITS WORKING"}];
  useEffect(() => {
    // fetch('/api/markers')
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setMarkerData(data);
    //   });
    
    setMarkerData(data);
  }, []); // [{name : "name", location:}, {name : "name", location:}, {name : "name", location:}]

  const eventBox = (el) => {
    // TODO: change state for info box stuff when marker is clicked
    setEventData(el);
  };

  // for every marker from database invoke a function that creates a marker jsx element
  markerData.forEach((el) => {
    const {
      title, creator, location, date, description } = el;
      // convert location string to lat and lng
    markers.push(<Marker title={title} position={location} onClick={() => eventBox(el)} />);
  });

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
      <div className="info">
        <p>Event Title: {eventData.title}</p>
        <p>Event Creator: {eventData.creator}</p>
        <p>Event Location: {eventData.location}</p>
        <p>Event Date: {eventData.date}</p>
        <p>Event Description: {eventData.description}</p>
      </div>
      <input type="button" onClick={() => currPosition()} />
      <GoogleMap
        zoom={10}
        center={mapPos}
        mapContainerClassName="map-container"
      >
        {markers}
      </GoogleMap>
    </div>
  );
}

export default Map;
