const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const dataset = require('./movie-dataset.js');
const { json } = require('express');
require('dotenv').config();


const app = express();


app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(function validateBearerToken(req, res, next) {
  const authToken = req.get('Authorization');
  const apiToken = process.env.API_TOKEN;
  console.log(apiToken);
  console.log('validate bearer token middleware')

  if (!authToken || authToken.split(' ')[1]  !== apiToken) {
    console.log('Im inside');
    return res.status(401).json({error: 'Unauthorized request' });
  }
  next();
});

app.get('/movie', (req, res) => {
  let searchType = '';
  let searchTerm = '';

  const searchGenre = req.query.genre;
  const searchCountry = req.query.country;
  const searchAvg_vote = req.query.avg_vote;

  if (req.query.genre && req.query.genre !== undefined) {
    searchType = 'genre';
    searchTerm = searchGenre.toLowerCase();
  }
  if (req.query.country && req.query.country !== undefined) {
    searchType = 'country';
    searchTerm = searchCountry.toLowerCase();
  }
  if (req.query.avg_vote && req.query.avg_vote !== undefined) {
    searchType = 'avg_vote';
    searchTerm = searchAvg_vote.toLowerCase();
  }
  console.log(`searchTerm: ${searchTerm}, searchType: ${searchType}`);

  let results;

  if (searchType === 'avg_vote') {
    results = dataset.filter(element => element[searchType] >= searchTerm);
  } else {
    results = dataset.filter(
      (element) => element[searchType].toLowerCase().includes(searchTerm)
    );
  }

  res.status(200).send(results);
});

app.listen(8080, () => {
  console.log('Listening on 8080!');
});
