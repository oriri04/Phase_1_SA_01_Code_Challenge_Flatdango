document.addEventListener('DOMContentLoaded', function () {
  // Fetch all films and populate the film list
  fetch('http://127.0.0.1:3000/films')
      .then(response => response.json())
      .then(films => {
          const filmsList = document.getElementById('films');
          filmsList.innerHTML = ''; // Clear placeholder

          films.forEach(film => {
              // Fetch film details for each film
              fetchFilmDetails(film.id);

              const listItem = document.createElement('li');
              listItem.classList.add('film', 'item', 'grid-item'); // Add 'grid-item' class
              listItem.innerHTML = `
                  <div class="grid-container">
                      <img src="${film.poster}" alt="${film.title}" class="film-poster">
                      <div class="film-details">
                          <div>
                              <h3>${film.title}</h3>
                              <p>${film.description}</p>
                              <ul id="filmDetails-${film.id}"></ul>
                          </div>
                          <button onclick="buyTicket(${film.id}, ${film.tickets_sold}, ${film.capacity})">Buy Ticket</button>
                      </div>
                  </div>
              `;
              filmsList.appendChild(listItem);
          });
      })
      .catch(error => console.error('Error fetching films:', error));
});

function fetchFilmDetails(filmId) {
  fetch(`http://127.0.0.1:3000/films/${filmId}`)
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
      })
      .then(film => {
          console.log('Fetched Film Details:', film);
          const availableTickets = film.capacity - film.tickets_sold;

          const filmDetailsContainer = document.getElementById(`filmDetails-${film.id}`);
          // Append the new content to the existing content
          filmDetailsContainer.innerHTML = `
              <li><strong>Runtime:</strong> ${film.runtime} minutes</li>
              <li><strong>Showtime:</strong> ${film.showtime}</li>
              <li><strong>Tickets Sold:</strong> ${film.tickets_sold}</li>
              <li><strong>Capacity:</strong> ${film.capacity}</li>
              <li><strong>Available Tickets:</strong> ${availableTickets}</li>
          `;
      })
      .catch(error => console.error(`Error fetching film details for filmId ${filmId}:`, error));
}

function buyTicket(filmId, ticketsSold, capacity) {
  const availableTickets = capacity - ticketsSold;

  if (availableTickets > 0) {
      // Decreases the available tickets and updates the frontend
      const updatedTicketsSold = ticketsSold + 1;

      fetch(`http://127.0.0.1:3000/films/${filmId}`, {
          method: 'PATCH', // Assuming you have an endpoint to update tickets_sold
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tickets_sold: updatedTicketsSold }),
      })
          .then(response => {
              if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json();
          })
          .then(updatedFilm => {
              
              const updatedAvailableTickets = updatedFilm.capacity - updatedFilm.tickets_sold;

              if (updatedAvailableTickets > 0) {
                  
                  fetchFilmDetails(filmId);
                  alert('Ticket booked successfully!');
              } else {
                  alert('Sorry, sold out!');
              }
          })
          .catch(error => console.error('Error buying ticket:', error));
  } else {
      alert('Sorry, sold out!');
  }
}
