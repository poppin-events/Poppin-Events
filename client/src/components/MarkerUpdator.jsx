import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useJsApiLoader } from '@react-google-maps/api';
import { UserContext } from './UserContext';
import Autocomplete from 'react-google-autocomplete';

const libraries = ['places'];
export default function MarkerUpdator(props) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const { user } = useContext(UserContext);

  const [name, setName] = useState(props.eventData.name);
  const [address, setAddress] = useState(props.eventData.address);
  const [date, setDate] = useState(
    props.eventData.date.slice(0, props.eventData.date.length - 8)
  );
  const [description, setDescription] = useState(props.eventData.description);
  const [locName, setLocName] = useState(
    props.eventData.locName ? props.eventData.locName : props.eventData.locname
  );
  let autocomplete = null;
  console.log(props.eventData);

  // "2023-03-22T20:21:00.000Z" database format
  // 2023-03-22T20:21 date format
  // Wed, 22 Mar 2023 20:21:00 GMT
  // props.eventData.date.slice(0,props.eventData.date.length-8)
  // graveyard of broken souls

  // "023-03-22T20:21"
  // cancel handler
  const cancelHandler = () => {
    props.setUpdating(false);
  };

  // submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('in MARKER CREATOR user is: ', user.id);
      const { id, email, name: username } = user;
      // event object for the database
      const event = {
        name,
        address,
        locName,
        date,
        description,
        userID: id,
        eventID: props.eventData.id,
      };
      // encode the address and geocode it
      const encoded = address.replaceAll(' ', '+');
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${
        import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      }`;
      const response = await axios.get(url);
      const data = response.data.results[0];
      event.location = [
        {
          lat: data.geometry.location.lat,
          lng: data.geometry.location.lng,
        },
      ];
      // send the update request to the database
      const eventID = await axios.put('/api/events', event);
      event.eventID = eventID.data;
      event.email = email;
      event.organizer = username;
      // replace the MarkerData in state with the updated array
      props.setMarkerData((prevMarkerData) => {
        // remove the edited event
        // could make more performant with map instead of filter
        const updatedMarkers = prevMarkerData.filter((event) => {
          return event.id !== event.eventID;
        });
        // spread in the filtered old events with the new event added in
        return [...updatedMarkers, event];
      });
      // update window closes and is replaced with add event
      props.setUpdating(false);
      //console.log('most recent marker is: ', markerData[markerData.length - 1]);
      // email from context and organizer from context
      // get event id to store in state
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
    if (autocomplete !== null)
      console.log('autocomplete place is: ', autocomplete.getPlace());
  }

  function eventAddressChangeHandler(e) {
    // console.log(`INSIDE CHANGE HANDLER FOR ADDRESS`);
    // console.log(e.target.value);
    setAddress(e.target.value);
  }

  return (
    <div className="create-event-container box-shadow-1">
      <h4>Edit your Event</h4>
      <form id="add-event" className="create-form" onSubmit={handleSubmit}>
        <label className="screen-reader-text" htmlFor="event-name">
          Name your event:
        </label>
        <input
          placeholder="Name"
          id="event-name"
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
          required
        />
        <label className="screen-reader-text" htmlFor="event-description">
          Describe your event:
        </label>
        <input
          placeholder="Description"
          id="event-description"
          type="text"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          required
        />
        <label className="screen-reader-text" htmlFor="event-location">
          Event Location:
        </label>
        <input
          placeholder="Location"
          id="event-location"
          type="text"
          onChange={(e) => setLocName(e.target.value)}
          value={locName}
          required
        />
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
          onChange={eventAddressChangeHandler}
        />
        <label className="screen-reader-text" htmlFor="event-date">
          Date:
        </label>
        <input
          placeholder="Date and time"
          id="event-date"
          type="datetime-local"
          onChange={(e) => setDate(e.target.value)}
          value={date}
          required
        />
        <button className="button-primary">Submit</button>
      </form>
      <button className="cancel-button button-primary" onClick={cancelHandler}>
        Cancel
      </button>
    </div>
  );
}
