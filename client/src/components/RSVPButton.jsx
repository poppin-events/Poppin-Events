import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

function RSVPButton(props) {
  async function handleClick(e) {
    const messageBody = { userId: props.user.id };

    try {
      const response = await axios.post(
        `/api/attendees/${props.eventData.id}`,
        messageBody
      );
      console.log(`RESPONSE RESPONSE RESPONSE:`, response);
      props.setUserEventList(response.data);
    } catch (err) {
      console.log('error in post: ', err.message);
    }
  }

  return (
    <button className="rsvp-button" onClick={handleClick}>
      RSVP
    </button>
  );
}

export default RSVPButton;
