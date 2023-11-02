// Function to fetch filtered events
// filterEvents(eventType): This asynchronous function fetches events of a specific type (eventType) from the server using an HTTP GET request to http://localhost:7000/events?type=${eventType}. It then clears the existing events displayed on the webpage and calls displayFilteredEvents(eventsArray) to display the filtered events.

async function filterEvents(eventType) {
  if (eventType === "All") {
    const eventFeed = document.querySelector(".events__feed");
    eventFeed.innerHTML = '<h2 class="events__title">Upcoming Events</h2>';
    await displayEvents();
  } else {
    const response = await fetch(
      `https://codecampusserver.onrender.com/events/${eventType}`
    );
    const events = await response.json();
    const eventsArray = events.payload;
    console.log(eventsArray);
    // Clear existing events before displaying filtered events
    const eventFeed = document.querySelector(".events__feed");
    eventFeed.innerHTML = '<h2 class="events__title">Upcoming Events</h2>';
    await displayFilteredEvents(eventsArray);
  }
}

// Function to display filtered events

// displayFilteredEvents(filteredEvents): This asynchronous function takes an array of events (filteredEvents), clears the existing events displayed on the webpage, and dynamically generates HTML content for each event based on the event type. It then appends this HTML content to the ".events__feed" element.

async function displayFilteredEvents(filteredEvents) {
  // Clear existing events before displaying filtered events
  try {
    const eventFeed = document.querySelector(".events__feed");
    eventFeed.innerHTML = '<h2 class="events__title">Filtered Events</h2>';

    await filteredEvents.forEach((event) => {
      // image conditional
      let imgUrl = "";
      if (event.event_type === "Tech") {
        imgUrl = "./assets/green.png";
      } else if (event.event_type === "Social") {
        imgUrl = "./assets/yellow.png";
      } else {
        imgUrl = "./assets/purple.png";
      }

      const date = event.date;
      const dateFormatted = date.slice(0, 10);
      const time = event.time;
      const timeFormatted = time.slice(0, 5);
      const eventFeed = document.querySelector(".events__feed");
      eventFeed.innerHTML += `
    <div class="event__card">
    <p class="event__date">${dateFormatted} · ${timeFormatted}</p>
      <h2 class="event__title">${event.event_title}</h2>
      <p class="event__location">${event.location}</p>
      <p class="event__attendees">Attendees: ${event.attendees}</p>
      <button type="button" id="${event.id}" class="button__small">Attend</button>
      <img class="events__image" src="${imgUrl}" alt="Social__Icon">
      </div>
    `;
    });
    return filteredEvents;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

// Displays all the events function

// displayEvents(): This asynchronous function fetches all events from the server using an HTTP GET request to http://localhost:7000/events. It formats the date and time for each event, determines the appropriate image URL based on the event type, and appends the event information as HTML content to the ".events__feed" element.

async function displayEvents() {
  // fetches the events from the server
  try {
    const response = await fetch(
      `https://codecampusserver.onrender.com/events/`
    );
    const events = await response.json();
    // loops over the array of events and displays html for each event
    await events.payload.forEach((event) => {
      // grabs the date and time from each event and formats it for display
      const date = event.date;
      const dateFormatted = date.slice(0, 10);
      const time = event.time;
      const timeFormatted = time.slice(0, 5);
      console.log(dateFormatted);

      // image conditional
      let imgUrl = "";
      if (event.event_type === "Tech") {
        imgUrl = "./assets/green.png";
      } else if (event.event_type === "Social") {
        imgUrl = "./assets/yellow.png";
      } else {
        imgUrl = "./assets/purple.png";
      }

      // grabs the event feed from the DOM
      const eventFeed = document.querySelector(".events__feed");

      // appends html for each event to the DOM
      eventFeed.innerHTML += `
    <div class="event__card">
    <p class="event__date">${dateFormatted} · ${timeFormatted}</p>
      <h2 class="event__title">${event.event_title}</h2>
      <p class="event__location">${event.location}</p>
      <p class="event__attendees">Attendees: ${event.attendees}</p>
      <button type="button" id="${event.id}" class="button__small">Attend</button>
      <img class="events__image" src="${imgUrl}" alt="Social__Icon">
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

// init(): This function initializes the event handling for different buttons ("Social__button", "Tech__button", and "Online__button"). When these buttons are clicked, they call the filterEvents(eventType) function with the corresponding event type ("Social", "Tech", or "Online") to filter and display events of that type.

async function init() {
  const myArray = await displayEvents();

  myArray.forEach((event) => {
    const button = document.getElementById(event.id);
    button.addEventListener("click", patchDisplay);
  });

  console.log(myArray);

  const allButton = document.querySelector(".All__button");
  allButton.addEventListener("click", async () => await filterEvents("All"));

  const socialButton = document.querySelector(".Social__button");
  socialButton.addEventListener(
    "click",
    async () => await filterEvents("Social")
  );

  const techButton = document.querySelector(".Tech__button");
  techButton.addEventListener("click", async () => await filterEvents("Tech"));

  const onlineButton = document.querySelector(".Online__button");
  onlineButton.addEventListener(
    "click",
    async () => await filterEvents("Online")
  );
}

init();

// const response = {
//   success: true,
//   payload: [
//     {
//       id: 1,
//       event_title: "Bootcamper Meet Up",
//       event_date: "Thursday, April 26, 2023",
//       time: "10:00",
//       location: "Zoom",
//       event_type: "Social",
//       attendees: 30,
//     },
//     {
//       id: 2,
//       event_title: "Junior Devs Networking",
//       event_date: "Thursday, April 26, 2023",
//       time: "19:00",
//       location: "London",
//       event_type: "Tech",
//       attendees: 5,
//     },
//     {
//       id: 3,
//       event_title: "Bootcamper Meet Up",
//       event_date: "Thursday, April 26, 2023",
//       time: "10:00",
//       location: "Zoom",
//       event_type: "Social",
//       attendees: 15,
//     },
//     {
//       id: 4,
//       event_title: "Introduction to ReactJS",
//       event_date: "Thursday, April 26, 2023",
//       time: "10:00",
//       location: "Zoom",
//       event_type: "Online",
//       attendees: 7,
//     },
//   ],
// };
