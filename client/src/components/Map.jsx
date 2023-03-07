import '../stylesheets/App.css';
import React, { useState, useEffect, useContext} from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, Autocomplete} from '@react-google-maps/api';

import axios from 'axios';
import MarkerCreator from './MarkerCreator';
import MarkerUpdator from './MarkerUpdator';
import { UserContext } from './UserContext';

function Map() {
  const [mapPos, setMapPos] = useState({ lat: 0.37766641e2, lng: -0.123098308e3 });
  const [markerData, setMarkerData] = useState([]);
  const [eventData, setEventData] = useState(null);
  const { user } = useContext(UserContext);
  // const [map, setMap] = useState(null);
  const [updating, setUpdating] = useState(false);
  const userID = user === null ? null : user.id;

  console.log('in MAP at TOP .... user is: ', user);
  console.log('in MAP at TOP .... eventData is: ', eventData);

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

  const handleUpdate = () => {
    setUpdating(true);
  };

  const handleDelete = async (eID, uID) => {
    // create the object for the db query on backend
    const deleteReq = {
      eventID: eID,
      userID: uID,
    };
    // const test = {hi: 'hi'};
    // send object to the server
    console.log('eID is : ', eID);
    console.log('uID is : ', uID);
    const response = await axios.delete('/api/events', {
      data: { deleteReq }});
    // await axios.delete('/api/events', {data: deleteReq, headers:{Authorization: "token"}})
    // filter the removed event from the marker data array
    setMarkerData(prevMarkerData => {
      return prevMarkerData.filter(event => {
        return event.id !== eID;
      });
    });
    setEventData(null);
  };

  console.log('RERENDERING MAP NOW');
  console.log('IN MAP, markerdata STATE ARRAY IS: ', markerData);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="map-section">
      <GoogleMap
        zoom={14}
        center={mapPos}
        mapContainerClassName="map-container box-shadow-1"
      >
        <button className="current-location-button" onClick={() => currPosition()}>Go to current location</button>
        {markerData.length > 0 && markerData.map((event) => (
          <MarkerF
            key={event.id}
            title={event.name}
            position={event.location[0]}
            onClick={() => setEventData(event)}
          />
        ))}
      </GoogleMap>
      <div className="right-section">
        {!updating && <MarkerCreator setMarkerData={setMarkerData} />}
        {updating
          && (
          <MarkerUpdator
            eventData={eventData}
            setEventData={setEventData}
            setUpdating={setUpdating}
          />
          )}
      
        {
          eventData &&
          (
            <div className="info-container box-shadow-1">

  
              <h2 className="event-title">{eventData.name}</h2>
              <p className="event-description"> {eventData.description}</p>
              <ul className="info-list">
                <li className="info-list-item">Organizer: {eventData.organizer}</li>
                <li className="info-list-item">Location: {eventData.address}</li>
                <li className="info-list-item">Date: {(new Date(eventData.date)).toUTCString()}</li>
                <li className="info-list-item">RSVP: {eventData.email}</li>
              </ul>
              {
                eventData.email === user.email && (
                  <div className="event-buttons-container">
                    <button className="edit-button" type="button" onClick={handleUpdate}> Edit </button>
                    <button className="delete-button" type="button" onClick={() => handleDelete(eventData.id, user.id)}> Delete </button>
                  </div>
                )
              }
            </div>
          )
        }
      </div>
    </div>
  );
}

export default Map;
