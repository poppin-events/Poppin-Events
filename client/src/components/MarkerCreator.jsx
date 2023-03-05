import React, { useState } from 'react';
import axios from 'axios';
/*
  Title
  Creator name
  location as address
  date
  description
*/

export default function MarkerCreator() {
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  // submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const event = {
        title,
        address,
        date,
        description,
      };
      await axios.post('/api/events', event);
    } catch (e) {
      console.log('error in post: ', e.message);
    }
  };

  return (
    <>
      <header>
        <h4>Tell us about your event: </h4>
      </header>
      <body>
        <form id="add-event" onSubmit={handleSubmit}>
          <label htmlFor="event-title">
            Name your event:
            <input id="event-title" type="text" onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label htmlFor="event-description">
            Name your event:
            <input id="event-description" type="text" onChange={(e) => setDescription(e.target.value)} required />
          </label>
          <label htmlFor="event-address">
            Name your event:
            <input id="event-address" type="text" onChange={(e) => setAddress(e.target.value)} required />
          </label>
          <label htmlFor="event-date">
            Name your event:
            <input id="event-date" type="date" onChange={(e) => setDate(e.target.value)} required />
          </label>
          <input id="newEventSubmit" type="submit" />
        </form>
      </body>
    </>
  );
}
