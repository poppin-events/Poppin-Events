import React, { useState, useContext, useRef} from 'react';
import axios from 'axios';
import { useJsApiLoader } from '@react-google-maps/api';
import { UserContext } from './UserContext';
import Autocomplete from 'react-google-autocomplete';

const libraries = ['places'];
export default function MarkerCreator(props) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const { user } = useContext(UserContext);
  // state
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [locName, setLocName] = useState('');
  let autocomplete = null;

  // submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('in MARKER CREATOR user is: ', user.id);
      const { id, email, name: username } = user;
      // new event object for database
      const event = {
        name,
        address,
        locName,
        date,
        description,
        userID: id,
      };
      // encode the address
      const encoded = address.replaceAll(' ', '+');
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=AIzaSyBCOm76ZZYuU7YSbYUmDRwhdj8XTW5K5jk`;
      // geocode the address
      const response = await axios.get(url);
      const data = response.data.results[0];
      event.location = [{
        lat: data.geometry.location.lat,
        lng: data.geometry.location.lng,
      }];
      // send the post request to the server
      const eventID = await axios.post('/api/events', event);
      // add other pairs to the event object for the front-end to read
      event.id = eventID.data.id;
      event.email = email;
      event.organizer = username;
      // add the new event into state to rerender the map
      props.setMarkerData(prevMarkerData => {
        return [...prevMarkerData, event];
      });
    } catch (err) {
      console.log('error in post: ', err.message);
    }
  };

  // autocomplete onLoad
  function onLoad(ac) {
    console.log('here in ONLOAD, ac is: ', ac);
    autocomplete = ac;
  }

  // autocomplete change handler
  function handleChange() {
    console.log('autocomplete is currently: ', autocomplete);
    if(autocomplete !== null) console.log('autocomplete place is: ', autocomplete.getPlace());
  }

  // <Autocomplete /> component imported from @react-google-maps/api to have autocomplete address
  return (
    <div className="create-event-container box-shadow-1">
      <h4>Create an Event</h4>
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
        />
        <label className="screen-reader-text" htmlFor="event-date">
          Date:
        </label>
        <input placeholder="Date and time" id="event-date" type="datetime-local" onChange={(e) => setDate(e.target.value)} value={date} required />
        <button className="button-primary">Submit</button>
      </form>
    </div>
  );
}
