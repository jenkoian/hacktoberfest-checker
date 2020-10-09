'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const setupGithubApi = require('./setupHelpers/setupGithubApi');
const setupErrorHandling = require('./setupHelpers/setupErrorHandling');
const PrController = require('./controllers/pr');
const path = require('path');
const compression = require('compression');

const start = () => {
  // Load environment variables from .env file
  dotenv.config();

  const app = express();

  const shouldCompress = (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  };

  const githubApi = setupGithubApi();

  const port = process.env.PORT || 5000;

  app.set('port', port);
  app.set('github', githubApi);

  setupErrorHandling(app);

  app.use(express.static(path.join(__dirname, '../build')));

  app.use(bodyParser.json());

  const corsOptions = {
    origin: process.env.REACT_APP_HOSTNAME,
  };

  app.use(cors(corsOptions));

  app.use(
    compression({
      filter: shouldCompress,
    })
  );

  app.get('/prs', PrController.index);

  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });

  app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
  });
};

module.exports = start;
