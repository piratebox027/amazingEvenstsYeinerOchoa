import { generarFiltrosCategorias, crearTarjetas } from './common.js';

// Función para filtrar eventos futuros
function esEventoFuturo(evento, currentDate) {
  return new Date(evento.date) >= currentDate;
}

// Función para aplicar filtros y búsqueda específicos para eventos futuros
function aplicarFiltrosEventosFuturos(eventos, currentDate) {
  const searchValue = document.getElementById("search-input").value.toLowerCase();
  const selectedCategories = Array.from(document.querySelectorAll("#filtros-categorias input:checked"))
    .map(input => input.value);

  const eventosFiltrados = eventos.filter(evento => {
    const matchesSearch = evento.name.toLowerCase().includes(searchValue) ||
                          evento.description.toLowerCase().includes(searchValue);
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(evento.category);
    return matchesSearch && matchesCategory && esEventoFuturo(evento, currentDate);
  });

  crearTarjetas(eventosFiltrados, searchValue, currentDate, esEventoFuturo);
}

// Función para obtener los datos de la API
async function obtenerDatosDeLaAPI() {
  try {
    const response = await fetch('https://aulamindhub.github.io/amazing-api/events.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener los datos de la API:', error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  // Obtenemos los datos de la API
  const data = await obtenerDatosDeLaAPI();

  if (data) {
    const currentDate = new Date(data.currentDate);
    const eventosFuturos = data.events.filter(evento => esEventoFuturo(evento, currentDate));

    generarFiltrosCategorias({ events: eventosFuturos });
    crearTarjetas(eventosFuturos, "", currentDate, esEventoFuturo);

    document.getElementById("search-input").addEventListener("input", () => aplicarFiltrosEventosFuturos(eventosFuturos, currentDate));
    document.getElementById("filtros-categorias").addEventListener("change", () => aplicarFiltrosEventosFuturos(eventosFuturos, currentDate));
  }
});
 