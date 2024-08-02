import { generarFiltrosCategorias, crearTarjetas, aplicarFiltros } from './common.js';

function filtroFechaHome(date, currentDate) {
  return true; // No filtra por fecha en home
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

  // Verificamos que data no sea undefined antes de continuar
  if (data) {
    generarFiltrosCategorias(data);
    crearTarjetas(data.events, "", new Date(), filtroFechaHome);

    document.getElementById("search-input").addEventListener("input", () => aplicarFiltros(data, filtroFechaHome));
    document.getElementById("filtros-categorias").addEventListener("change", () => aplicarFiltros(data, filtroFechaHome));
  }
});
