const express = require('express');
const axios = require('axios');
const path = require('path');
const ejs = require('ejs');

const app = express();
const port = 5000;

const URL = 'https://api.themoviedb.org/3/movie/now_playing';

const params = {
    api_key: 'TMDB_API_KEY',
    region: 'IN',  // India
};

app.get('/', async (req, res) => {
  try {
      const response = await axios.get(URL, { params });
      const data = response.data;

      if (response.status === 200) {
          const nowPlayingMovies = data.results;

          const movieData = nowPlayingMovies.map(movie => ({
              title: movie.title,
              release_date: movie.release_date,
              overview: movie.overview,
              poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          }));

          res.render('index', { movies: movieData });
      } else {
          res.status(response.status).send(`Unable to fetch data from TMDB. Status code: ${response.status}`);
      }
  } catch (error) {
      res.status(500).send(`An error occurred: ${error.message}`);
  }
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
