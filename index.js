import axios from 'axios';
import 'dotenv/config';

const API_KEY = process.env.OMDB_API_KEY;
const BASE_URL = 'http://www.omdbapi.com/';

// Buscar una película por título exacto
async function obtenerPeliculaPorTitulo(titulo) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        apikey: API_KEY,
        t: titulo,        // 't' busca un título exacto
        plot: 'full'      // 'full' para sinopsis completa o 'short' para corta
      }
    });

    if (response.data.Response === "False") {
      console.log(`Error: ${response.data.Error}`);
      return;
    }

    const p = response.data;
    console.log(`\n=== ${p.Title} (${p.Year}) ===`);
    console.log(`Director: ${p.Director}`);
    console.log(`Elenco: ${p.Actors}`);
    console.log(`Rating IMDb: ${p.imdbRating}`);
    console.log(`Sinopsis: ${p.Plot}\n`);
  } catch (error) {
    console.error('Error al conectar con OMDb:', error.message);
  }
}

// Buscar una lista de películas por palabra clave
async function buscarPeliculas(palabraClave) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        apikey: API_KEY,
        s: palabraClave   // 's' realiza una búsqueda general (retorna lista)
      }
    });

    if (response.data.Response === "False") {
      console.log(`Error: ${response.data.Error}`);
      return;
    }

    console.log(`\nResultados para "${palabraClave}":`);
    response.data.Search.forEach(pelicula => {
      console.log(`- ${pelicula.Title} (${pelicula.Year}) [ID: ${pelicula.imdbID}]`);
    });
  } catch (error) {
    console.error('Error al conectar con OMDb:', error.message);
  }
}

// Pruebas
await obtenerPeliculaPorTitulo('The Matrix');
await buscarPeliculas('Batman');