function renderEvents(events) {
  const eventListElem = document.getElementById("event-table");
  for (const event of events) {
    const eventElem = createEventElem(event);
    eventListElem.appendChild(eventElem);
  }
}
(function initApp() {
  eventAPI.getEvents().then((events) => {
    renderEvents(events);
  });
  addEvent();
})();

function createEventElem(event) {
  const eventRowElem = document.createElement("tr");
  const eventNameElem = document.createElement("td");
  const eventStartElem = document.createElement("td");
  const eventEndElem = document.createElement("td");
  const eventActionsElem = document.createElement("td");

  const cancelButton = document.createElement("button");
  cancelButton.setAttribute("class", "cancel-button");
  cancelButton.innerHTML = `<svg focusable="false" aria-hidden="true" viewBox="0 0 32 32"
             version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M19.587 16.001l6.096 6.096c0.396
              0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097
               6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 
               0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396
                1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396
                 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path></svg>`;
  const saveButton = document.createElement("button");
  saveButton.setAttribute("class", "save-button");
  saveButton.innerHTML = `<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21,20V8.414a1,1,0,0,0-.293-.707L16.293,3.293A1,1,0,0,0,15.586,3H4A1,1,0,0,0,3,4V20a1,1,0,0,0,1,1H20A1,1,0,0,0,21,20ZM9,8h4a1,1,0,0,1,0,2H9A1,1,0,0,1,9,8Zm7,11H8V15a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Z"/></svg>`;
  const eventNameInput = document.createElement("input");
  eventNameInput.setAttribute("type", "text");
  eventNameInput.setAttribute("id", "eventNameInput");

  eventNameInput.setAttribute("required", "true");
  eventNameInput.value = event.eventName;
  const eventStartDateInput = document.createElement("input");
  eventStartDateInput.value = event.startDate;
  eventStartDateInput.setAttribute("type", "date");
  eventStartDateInput.setAttribute("id", "eventStartDate");
  const eventEndDateInput = document.createElement("input");
  eventEndDateInput.setAttribute("type", "date");
  eventEndDateInput.value = event.endDate;
  eventEndDateInput.setAttribute("id", "eventEndDate");

  const editButton = document.createElement("button");
  editButton.setAttribute("class", "edit-button");
  editButton.innerHTML = `<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24"
             data-testid="EditIcon" aria-label="fontSize small">
             <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02
              0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z">
              </path></svg>`;
  editButton.addEventListener("click", async () => {
    eventNameElem.textContent = "";
    eventStartElem.textContent = "";
    eventEndElem.textContent = "";
    editButton.remove();
    deleteButton.remove();
    eventNameInput.value = event.eventName;
    eventStartDateInput.value = event.startDate;
    eventEndDateInput.value = event.endDate;
    eventNameElem.append(eventNameInput);
    eventStartElem.append(eventStartDateInput);
    eventEndElem.append(eventEndDateInput);
    eventActionsElem.append(saveButton, cancelButton);
    saveButton.addEventListener("click", async (e) => {
      e.preventDefault();
      const eventName = eventNameInput.value;
      const startDate = eventStartDateInput.value;
      const endDate = eventEndDateInput.value;
      const newEvent = {
        eventName,
        startDate,
        endDate,
      };
      if (validateInput(newEvent)) {
        const updatedEvent = await eventAPI.editEvent(event.id, newEvent);
        eventNameElem.textContent = `${updatedEvent.eventName}`;
        eventStartElem.textContent = `${updatedEvent.startDate}`;
        eventEndElem.textContent = `${updatedEvent.endDate}`;
        event.eventName = updatedEvent.eventName;
        event.startDate = updatedEvent.startDate;
        event.endDate = updatedEvent.endDate;
        cancelButton.remove();
        saveButton.remove();
        eventActionsElem.append(editButton, deleteButton);
      }
    });
    cancelButton.addEventListener("click", () => {
      eventNameInput.remove();
      eventStartDateInput.remove();
      eventEndDateInput.remove();
      saveButton.remove();
      cancelButton.remove();

      eventNameElem.textContent = `${event.eventName}`;
      eventStartElem.textContent = `${event.startDate}`;
      eventEndElem.textContent = `${event.endDate}`;
      eventActionsElem.append(editButton, deleteButton);

      eventRowElem.append(
        eventNameElem,
        eventStartElem,
        eventEndElem,
        eventActionsElem
      );
    });
    eventRowElem.append(
      eventNameElem,
      eventStartElem,
      eventEndElem,
      eventActionsElem
    );
  });
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.innerHTML = `<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24"
               data-testid="DeleteIcon" aria-label="fontSize small"><path d="M6 19c0 1.1.9 2 2
                2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>`;
  deleteButton.setAttribute("class", "delete-button");
  deleteButton.addEventListener("click", async () => {
    await eventAPI.deleteEvent(event.id);
    eventRowElem.remove();
  });
  eventActionsElem.append(editButton, deleteButton);

  eventNameElem.textContent = `${event.eventName}`;
  eventStartElem.textContent = `${event.startDate}`;
  eventEndElem.textContent = `${event.endDate}`;
  eventRowElem.append(
    eventNameElem,
    eventStartElem,
    eventEndElem,
    eventActionsElem
  );
  return eventRowElem;
}

function addEvent() {
  document
    .getElementById("add_event_button")
    .addEventListener("click", async (e) => {
      e.preventDefault();
      generateNewRow();
    });
}

function generateNewRow() {
  const eventListElem = document.getElementById("event-table");
  const eventRowElem = document.createElement("tr");
  const eventNameElem = document.createElement("td");
  const eventStartElem = document.createElement("td");
  const eventEndElem = document.createElement("td");
  const eventActionsElem = document.createElement("td");

  const addButton = document.createElement("button");
  addButton.setAttribute("class", "create-event-button");
  addButton.innerHTML = `<svg focusable viewBox="0 0 24 24" aria-hidden="true 
            xmlns="http://www.w3.org/2000/svg"><path d="M12 6V18M18 12H6" stroke="#FFFFFF"
             stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const cancelButton = document.createElement("button");
  cancelButton.setAttribute("class", "cancel-button");
  cancelButton.innerHTML = `<svg focusable="false" aria-hidden="true" viewBox="0 0 32 32"
             version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M19.587 16.001l6.096 6.096c0.396
              0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097
               6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 
               0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396
                1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396
                 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path></svg>`;

  eventActionsElem.append(addButton, cancelButton);

  const eventNameInput = document.createElement("input");
  eventNameInput.setAttribute("type", "text");
  eventNameInput.setAttribute("id", "eventNameInput");

  eventNameInput.setAttribute("required", "true");
  const eventStartDateInput = document.createElement("input");
  eventStartDateInput.setAttribute("type", "date");
  eventStartDateInput.setAttribute("id", "eventStartDate");
  const eventEndDateInput = document.createElement("input");
  eventEndDateInput.setAttribute("type", "date");
  eventEndDateInput.setAttribute("id", "eventEndDate");

  eventStartElem.append(eventStartDateInput);
  eventEndElem.append(eventEndDateInput);
  eventNameElem.append(eventNameInput);

  eventRowElem.append(
    eventNameElem,
    eventStartElem,
    eventEndElem,
    eventActionsElem
  );

  addButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const eventName = document.getElementById("eventNameInput").value;
    const startDate = document.getElementById("eventStartDate").value;
    const endDate = document.getElementById("eventEndDate").value;
    
    const newEvent = {
      eventName,
      startDate,
      endDate,
    };
    if (validateInput(newEvent)) {
      const newEvent1 = await eventAPI.postEvent(newEvent);
      const eventListElem = document.getElementById("event-table");
      eventRowElem.remove();
      const eventElem = createEventElem(newEvent1);
      eventListElem.append(eventElem);
    }
  });

  cancelButton.addEventListener("click", () => {
    eventRowElem.remove();
  });
  eventListElem.appendChild(eventRowElem);
}

function validateInput(event) {
  if (
    event.startDate === "" ||
    event.endDate === "" ||
    event.startDate > event.endDate
  ) {
    alert("event field is not valid");
    return false;
  } else {
    return true;
  }
}
