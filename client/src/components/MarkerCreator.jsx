import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { UserContext } from './UserContext';
/*
  Title
  Creator name
  location as address
  date
  description
*/

// let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${URLencoded autocomplete address}}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`

const libraries = ['places'];
export default function MarkerCreator() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const {user} = useContext(UserContext);

  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [locName, setLocName] = useState('');

  // submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('in MARKER CREATOR user is: ', user.id);
      const { id } = user;
      const event = {
        title,
        address,
        locName,
        date,
        description,
        id,
      };
      const encoded = address.replaceAll(' ', '+');
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
      const response = await axios.get(url);
      const data = response.data.results[0];
      event.location = {
        lat: data.geometry.location.lat,
        lng: data.geometry.location.lng,
      };
      await axios.post('/api/events', event);
    } catch (err) {
      console.log('error in post: ', err.message);
    }
  };

  return (
    <div className="create-event-container">
      <h4>Create an Event</h4>
      <form id="add-event" className="create-form" onSubmit={handleSubmit}>
        <label className="screen-reader-text" htmlFor="event-title">
          Name your event:
        </label>
        <input placeholder="Title" id="event-title" type="text" onChange={(e) => setTitle(e.target.value)} value={title} required />
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
        <Autocomplete className="autocomplete-input">
          <input id="event-address" type="text" onChange={(e) => setAddress(e.target.value)} value={address} required />
        </Autocomplete>
        <label className="screen-reader-text" htmlFor="event-date">
          Date:
        </label>
        <input placeholder="Date and time" id="event-date" type="datetime-local" onChange={(e) => setDate(e.target.value)} value={date} required />
        <button>Submit</button>
      </form>
    </div>
  );
}
