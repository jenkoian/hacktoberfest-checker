'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const setupGithubApi = require('./setupHelpers/setupGithubApi');
const setupErrorHandling = require('./setupHelpers/setupErrorHandling');
const IndexController = require('./controllers/index');

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

  app.get('/', IndexController.index);

  app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
  });
};

module.exports = start;
