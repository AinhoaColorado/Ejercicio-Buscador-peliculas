// Creamos unas variables globales a las que acudiremos a lo largo del proyecto
const API_ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYjNlYjIwZDM3YWM2NGVhZDZiOWI2Zjk0Y2M0OGZjZCIsIm5iZiI6MTc0NDkwNjE3NS4wMTksInN1YiI6IjY4MDEyN2JmODNjNmU1NjdjN2Q5OTQ5MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NbYSw94VJsawBMB-tXwG3vMu7e7OMrbuaW0NHU04STE";
const API_KEY = "3b3eb20d37ac64ead6b9b6f94cc48fcd";
const API_URL = "https://api.themoviedb.org/3/";

/**
 * En esta API en concreto necesitamos definir las opciones para cada petición. Aquí especificamos el tipo de petición HTTP y cabeceras.
 * En las cabeceras especificamos lo siguiente:
 *
 * - accept: El tipo de dato que queremos recibir de la API (json)
 * - Authorization: La autorización para poder utilizarla (en nuestro caso, el API_ACCESS_TOKEN)
 */
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_ACCESS_TOKEN}`,
  },
};

let generos = [];
fetch(
  `https://api.themoviedb.org/3/genre/movie/list?language=es`,
  options
).then(async (res) => {
  generos = (await res.json()).genres;
  console.log(generos);
});

// DOM
// Recuperamos el formulario de búsqueda para recuerar los datos que el usuario mete en el input, ej: Pocahontas.
const searchForm = document.getElementById("search_form");
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const input = searchForm.querySelector('input[type="search"]');
  const valor = input.value.trim();

  pedirDatosPelis(valor); // Aquí le pasamos la "pelota" con el valor de pocahontas a la función que se encargará de pedirle a la API los datos que ha ingresado el usuario en el imput.
});

// Funciones para las pelis
async function pedirDatosPelis(nombrePeli) {
  const paginaPelis = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${nombrePeli}`,
    options
  ).then((res) => res.json());

  console.log(paginaPelis);
  pintarPelisCards(paginaPelis.results); //results hace referencia a la parte del objeto que nos interesa recuperar. paginaPelis es un objeto que contiene page, results, total_pages y total_results.
}

// Pintar peliculas en el DOM (cards)

function pintarPelisCards(listaDePelis) {
  const moviesContainer = document.getElementById("moviesContainer");
  moviesContainer.innerHTML = ""; //limpiar lo que hubiera antes
  //crear las cards con la información nueva
  listaDePelis.forEach((peli) => {
    const badgetsDeCatergorias = peli.genre_ids.map((genreId) => {
      const generoDeLaPeli = generos.find(
        (elementoDelListadoGeneros) => elementoDelListadoGeneros.id === genreId
      );

      return `<span class="badge bg-primary">${generoDeLaPeli.name}</span>`;
    });

    moviesContainer.innerHTML += `
      <div class="card mb-3">
        <h3 class="card-header">${peli.title}</h3>
        <img src="https://image.tmdb.org/t/p/w500/${peli.poster_path}" />
        <div class="card-body">
          <p class="card-text">${peli.overview}</p>
        </div>
        
        <div class="card-footer text-muted">
          ${badgetsDeCatergorias.join(" ")}
        </div>
      </div>
    `;
  });
}
