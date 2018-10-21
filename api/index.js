'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const setupGithubApi = require('./setupHelpers/setupGithubApi');
const setupErrorHandling = require('./setupHelpers/setupErrorHandling');
const PrController = require('./controllers/pr');

const start = () => {
  // Load environment variables from .env file
  dotenv.load();

  const app = express();

  const githubApi = setupGithubApi();

  const port = process.env.PORT || 5000;

  app.set('port', port);
  app.set('github', githubApi);

  setupErrorHandling(app);

  app.use(bodyParser.json());

  const corsOptions = {
    origin: process.env.REACT_APP_HOSTNAME
  };

  app.use(cors(corsOptions));

  app.get('/prs', PrController.index);

  app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
  });
};

module.exports = start;
