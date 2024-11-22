const eventAPI = (() => {
  const EVENT_API_URL = "http://localhost:3000/events";
  async function getEvents() {
    const response = await fetch(EVENT_API_URL);
    const events = await response.json();
    console.log(events);

    return events;
  }

  async function postEvent(newEvent) {
    const response = await fetch(EVENT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEvent),
    });
    const event = await response.json();
    return event;
  }

  async function deleteEvent(eventId) {
    const response = await fetch(`${EVENT_API_URL}/${eventId}`, {
      method: "DELETE",
    });
    await response.json();
    return eventId;
  }

  async function editEvent(eventId, newEvent) {
    const response = await fetch(`${EVENT_API_URL}/${eventId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEvent),
    });

    const updatedEvent = await response.json();
    return updatedEvent;
  }

  return {
    getEvents,
    postEvent,
    deleteEvent,
    editEvent,
  };
})();
