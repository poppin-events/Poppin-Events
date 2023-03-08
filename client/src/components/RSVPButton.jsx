import React, { useState, useEffect, useContext} from 'react';
import axios from 'axios';

function RSVPButton(props) {

  async function handleClick(e) {
    const messageBody = {userId: props.user.id, eventId: props.eventData.id}

    try {
      const response = await axios.post('/api/rsvp', messageBody);
      props.setUserEventData(response.userEventData)
    } catch (err) {
      console.log('error in post: ', err.message);
    }
  }

  return (
    <button className='rsvp-button' onClick={handleClick}>RSVP</button>
  )
  
}

export default RSVPButton