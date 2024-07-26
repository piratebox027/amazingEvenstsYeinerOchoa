// common.js

export function generarFiltrosCategorias(data) {
  const categoriasUnicas = [...new Set(data.events.map(evento => evento.category))];
  const contenedorFiltros = document.getElementById("filtros-categorias");

  categoriasUnicas.forEach(categoria => {
    const label = document.createElement('label');
    label.className = "form-check-label";
    label.innerHTML = `
      <input type="checkbox" class="form-check-input" value="${categoria}"> ${categoria}
    `;
    contenedorFiltros.appendChild(label);
  });
}

export function crearTarjetas(eventos, terminoBusqueda, currentDate, filtroFecha) {
  let contenedor = document.getElementById("tarjetasDinamicas");
  const mensajeNoResultados = document.getElementById("mensaje-no-resultados");

  contenedor.innerHTML = '';  // Limpia el contenedor antes de añadir nuevas tarjetas

  if (eventos.length > 0) {
    mensajeNoResultados.classList.remove('mostrar');  // Oculta el mensaje de no resultados
    eventos.forEach(evento => {
      if (filtroFecha(evento, currentDate)) {
        let tarjeta = document.createElement('div');
        tarjeta.className = "col-12 col-md-6 col-lg-3 mb-4";
        tarjeta.innerHTML = `
          <div class="card h-100">
            <img src="${evento.image}" alt="${evento.name}" class="card-img-top">
            <div class="card-body d-flex flex-column justify-content-end">
              <h5 class="card-title">${evento.name}</h5>
              <p class="card-text">${evento.description}</p>
              <div class="d-flex justify-content-between align-items-center">
                <p>Price: ${evento.price}</p>
                <a href="Details.html?id=${evento._id}" class="btn btn-primary">Details</a>
              </div>
            </div>
          </div>`;
        contenedor.appendChild(tarjeta);
      }
    });
  } else {
    mensajeNoResultados.innerHTML = `
      <h3>No hay publicaciones que coincidan con tu búsqueda.</h3>
      <ul>
        <li>Revisa la ortografía de la palabra.</li>
        <li>Utiliza palabras más genéricas o menos palabras.</li>
        <li>Navega por las categorías para encontrar un producto similar.</li>
      </ul>
    `;
    mensajeNoResultados.classList.add('mostrar');  // Muestra el mensaje de no resultados
  }
}

export function aplicarFiltros(data, filtroFecha) {
  const searchValue = document.getElementById("search-input").value.toLowerCase();
  const selectedCategories = Array.from(document.querySelectorAll("#filtros-categorias input:checked"))
    .map(input => input.value);

  const eventosFiltrados = data.events.filter(evento => {
    const matchesSearch = evento.name.toLowerCase().includes(searchValue) ||
                          evento.description.toLowerCase().includes(searchValue);
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(evento.category);
    return matchesSearch && matchesCategory && filtroFecha(evento, new Date(data.currentDate));
  });

  crearTarjetas(eventosFiltrados, searchValue, new Date(data.currentDate), filtroFecha);
}
