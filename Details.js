document.addEventListener('DOMContentLoaded', async function() {
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get('id');

  // Función para obtener los datos de la API
  async function obtenerEventoDeLaAPI(id) {
    try {
      const response = await fetch('https://aulamindhub.github.io/amazing-api/events.json');
      const data = await response.json();
      return data.events.find(e => e._id.toString() === id);
    } catch (error) {
      console.error('Error al obtener los datos de la API:', error);
    }
  }

  // Obtenemos el evento de la API
  const evento = await obtenerEventoDeLaAPI(eventId);
  
  if (evento) {
    const card = document.getElementById('event-card');
    card.innerHTML = `
      <div class="col">
        <img src="${evento.image}" class="img-fluid rounded-start" alt="${evento.name}">
      </div>
      <div class="col">
          <p class="card-text">Name: ${evento.name}</p>
          <p class="card-text">Date: ${evento.date}</p>
          <p class="card-text">Description: ${evento.description}</p>
          <p class="card-text">Category: ${evento.category}</p>
          <p class="card-text">Place: ${evento.place}</p>
          <p class="card-text">Capacity: ${evento.capacity}</p>
          <p class="card-text">${evento.assistance ? 'Assistance: ' + evento.assistance : evento.estimate ? 'Estimate: ' + evento.estimate: ''}</p>
          <p class="card-text">Price: ${evento.price}</p>
        </div>
      </div>`;
  } else {
    document.getElementById('event-card').innerHTML = '<p>Event not found</p>';
  }
});
