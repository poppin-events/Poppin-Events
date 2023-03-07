import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useJsApiLoader } from '@react-google-maps/api';
import { UserContext } from './UserContext';
import Autocomplete from 'react-google-autocomplete';
/*
  Title
  Creator name
  location as address
  date
  description
*/

// let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${URLencoded autocomplete address}}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`

const libraries = ['places'];
export default function MarkerUpdator(props) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const { user } = useContext(UserContext);
  
  const [name, setName] = useState(props.eventData.name);
  const [address, setAddress] = useState(props.eventData.address);
  const [date, setDate] = useState(props.eventData.date);
  const [description, setDescription] = useState(props.eventData.description);
  const [locName, setLocName] = useState(props.eventData.locName ? props.eventData.locName : props.eventData.locname);
  let autocomplete = null;
  console.log(props.eventData);

  // "2023-03-09T00:52:00.000Z" database format
  // 2023-03-08T19:52 date format

  // cancel handler
  const cancelHandler = () => {
    props.setUpdating(false);
  }

  // submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('in MARKER CREATOR user is: ', user.id);
      const { id, email, name: username } = user;
      // name, address (actual), organizer (name), email, date, description, location (coords), id 
      const event = {
        name,
        address,
        locName,
        date,
        description,
        userID: id,
        eventID: props.eventData.id
      };
      const encoded = address.replaceAll(' ', '+');
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=AIzaSyBCOm76ZZYuU7YSbYUmDRwhdj8XTW5K5jk`;
      const response = await axios.get(url);
      const data = response.data.results[0];
      event.location = [{
        lat: data.geometry.location.lat,
        lng: data.geometry.location.lng,
      }];
      const eventID = await axios.put('/api/events', event);
      event.eventID = eventID.data;
      event.email = email;
      event.organizer = username;
      props.setUpdating(false);
      // props.setMarkerData(prevMarkerData => {
      //   console.log('TRYING TO UPDATE STATE ARRAY...');
      //   console.log('prevMarkerData is ', prevMarkerData);
      //   console.log('event is: ', event);
      //   return [...prevMarkerData, event];
      // });
      //console.log('most recent marker is: ', markerData[markerData.length - 1]);
      // email from context and organizer from context
      // get event id to store in state
    } catch (err) {
      console.log('error in post: ', err.message);
    }
  };

  function onLoad(ac) {
    console.log('here in ONLOAD, ac is: ', ac);
    autocomplete = ac;
  }

  function handleChange() {
    
    console.log('autocomplete is currently: ', autocomplete);
    if(autocomplete !== null) console.log('autocomplete place is: ', autocomplete.getPlace());
    // if (e !== null) {
    //   console.log(e.getPlace());
    // } else {
    //   console.log('Autocomplete is not loaded yet!');
    // }
  }

  return (
    <div className="create-event-container box-shadow-1">
      <h4>Edit your Event</h4>
      <form id="add-event" className="create-form" onSubmit={handleSubmit}>
        <label className="screen-reader-text" htmlFor="event-name">
          Name your event:
        </label>
        <input placeholder="Name" id="event-name" type="text" onChange={(e) => setName(e.target.value)} value={name} required />
        <label className="screen-reader-text" htmlFor="event-description">
          Describe your event:
        </label>
        <input placeholder="Description" id="event-description" type="text" onChange={(e) => setDescription(e.target.value)} value={description} required />
        <label className="screen-reader-text" htmlFor="event-location">
          Event Location:
        </label>
        <input placeholder="Location" id="event-location" type="text" onChange={(e) => setLocName(e.target.value)} value={locName} required />
        <label className="screen-reader-text" htmlFor="event-address">
          Event Address:
        </label>
        <Autocomplete
          apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
          options={{ types: [] }}
          onPlaceSelected={(place) => {
            console.log('PLACE in autocomplete IS: ', place);
            setAddress(place.formatted_address);
          }}
          value={address}
        />
        {/* <Autocomplete className="autocomplete-container" onLoad={onLoad} onPlaceChanged={handleChange}>
          <input className="autocomplete-input" type="text" required />
        </Autocomplete> */}
        <label className="screen-reader-text" htmlFor="event-date">
          Date:
        </label>
        <input placeholder="Date and time" id="event-date" type="datetime-local" onChange={(e) => setDate(e.target.value)} value={date} required />
        <button className="button-primary">Submit</button>
      </form>
      <button className="button-primary" onClick={cancelHandler}>Cancel</button>
    </div>
  );
}
