import React, { useState, useEffect, useContext } from 'react';

function EventList(props) {
  const userId = props.user.id;

  // Compare entire event data array to the user's list of events and create
  // a list element for each one
  const events = [];
  props.markerData.forEach((event) => {
    props.userEventList.forEach((eventID) => {
      if (event.id === eventID) {
        // Reformat date
        let formattedDate = new Date(event.date);
        formattedDate = formattedDate.toLocaleDateString('en-us', {
          day: 'numeric',
          year: 'numeric',
          month: 'short',
        });
        events.push(
          <div
            key={event.id}
            id={event.id}
            className="event-list-item"
            onClick={() => props.setEventData(event)}
          >
            <div className="event-list-item-data">
              <p className="small-titles">Event</p>
              <p className="small-text">{event.name}</p>
            </div>
            <div className="event-list-item-data">
              <p className="small-titles">Location</p>
              <p className="small-text">{event.locname}</p>
            </div>
            <div className="event-list-item-data">
              <p className="small-titles">Date</p>
              <p className="small-text">{formattedDate}</p>
            </div>
          </div>
        );
      }
    });
  });

  return (
    <div className="event-list-cont create-event-container box-shadow-1">
      <h4>Your Events</h4>
      {events}
    </div>
  );
}

export default EventList;
