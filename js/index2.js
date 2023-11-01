async function displayEvents() {
  const eventFeed = document.querySelector(".events__feed");

  try {
    const response = await fetch("http://localhost:7000/events");
    const events = await response.json();

    events.payload.forEach((event) => {
      const date = event.event_date;
      const dateFormatted = date;
      const time = event.time;
      const timeFormatted = time;
      eventFeed.innerHTML += `
        <div class="event__card">
          <p class="event__date">${dateFormatted}</p>
          <h2 class="event__title">${event.event_title}</h2>    
          <p class="event__time">${timeFormatted}</p>
          <p class="event__location">${event.location}</p>
          <p class="event__attendees">Attendees: ${event.attendees}</p>
          <button type="button" id="${event.id}" class="${event.event_type}__button">Attend</button>
        </div>
      `;
    });

    return events.payload;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

async function attendButtonFunction(button_id) {
  const API_URL = `http://localhost:7000/events/${button_id}`;

  try {
    const response = await fetch(API_URL, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PATCH",
    });

    if (response.ok) {
      console.log("Successfully attended the event.");
      // Handle the success here.
    } else {
      console.error("Failed to attend the event.");
      // Handle the failure here.
    }
  } catch (error) {
    console.error("Error:", error);
    // Handle the fetch error here.
  }
}

async function patchDisplay(event) {
  const button_id = event.target.id;
  await attendButtonFunction(button_id);
  document.location.reload();
}

async function init() {
  const myArray = await displayEvents();

  myArray.forEach((event) => {
    const button = document.getElementById(event.id);
    button.addEventListener("click", patchDisplay);
  });

  console.log(myArray);
}

init();
