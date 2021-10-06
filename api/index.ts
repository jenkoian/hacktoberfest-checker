import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import compression from 'compression';
import setupGithubApi from './setupHelpers/setupGithubApi';
import setupGitlabApi from './setupHelpers/setupGitlabApi';
import setupErrorHandling from './setupHelpers/setupErrorHandling';
import PrController from './controllers/pr';

const start = () => {
  // Load environment variables from .env file
  dotenv.config();

  const app = express();

  const shouldCompress: compression.CompressionFilter = (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  };

  const githubApi = setupGithubApi();
  const gitlabApi = setupGitlabApi();

  const port = process.env.PORT || 5000;

  app.set('port', port);
  app.set('github', githubApi);
  app.set('gitlab', gitlabApi);

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
