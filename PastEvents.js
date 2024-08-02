import { generarFiltrosCategorias, crearTarjetas } from './common.js';

// Función para filtrar eventos pasados
function esEventoPasado(evento, currentDate) {
  return new Date(evento.date) < currentDate;
}

// Función para aplicar filtros y búsqueda específicos para eventos pasados
function aplicarFiltrosEventosPasados(eventos, currentDate) {
  const searchValue = document.getElementById("search-input").value.toLowerCase();
  const selectedCategories = Array.from(document.querySelectorAll("#filtros-categorias input:checked"))
    .map(input => input.value);

  const eventosFiltrados = eventos.filter(evento => {
    const matchesSearch = evento.name.toLowerCase().includes(searchValue) ||
                          evento.description.toLowerCase().includes(searchValue);
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(evento.category);
    return matchesSearch && matchesCategory && esEventoPasado(evento, currentDate);
  });

  crearTarjetas(eventosFiltrados, searchValue, currentDate, esEventoPasado);
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
    const eventosPasados = data.events.filter(evento => esEventoPasado(evento, currentDate));

    generarFiltrosCategorias({ events: eventosPasados });
    crearTarjetas(eventosPasados, "", currentDate, esEventoPasado);

    document.getElementById("search-input").addEventListener("input", () => aplicarFiltrosEventosPasados(eventosPasados, currentDate));
    document.getElementById("filtros-categorias").addEventListener("change", () => aplicarFiltrosEventosPasados(eventosPasados, currentDate));
  }
});
