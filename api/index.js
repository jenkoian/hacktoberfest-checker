'use strict';

const express = require('express');
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const setupGithubApi = require('./setupHelpers/setupGithubApi');
const setupErrorHandling = require('./setupHelpers/setupErrorHandling');
const PrController = require('./controllers/pr');
const path = require('path');

const start = () => {
  const app = next({ dev });
  const handle = app.getRequestHandler();

  const githubApi = setupGithubApi();

  app.prepare().then(() => {
    // Load environment variables from .env file
    dotenv.load();
    const port = process.env.PORT || 5000;

    const server = express();

    server.set('port', port);
    server.set('github', githubApi);

    setupErrorHandling(server);

    server.use(express.static(path.join(__dirname, '../build')));

    server.use(bodyParser.json());

    const corsOptions = {
      origin: process.env.REACT_APP_HOSTNAME
    };

    server.use(cors(corsOptions));

    server.get('/prs', PrController.index);

    server.get('/*', (req, res) => {
      return handle(req, res)
    });

    server.listen(port, () => {
      console.log(`Express server listening on port ${port}`);
    });
  }).catch((ex) => {
    console.error(ex.stack);
    process.exit(1)
  });
};

module.exports = start;
