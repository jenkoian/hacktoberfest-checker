'use strict';

// Module dependencies
const express = require('express');
const path = require('path');
const logger = require('morgan');
const compression = require('compression');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const exphbs = require('express-handlebars');
const setupGithubApi = require('./lib/setupGithubApi');

// Load environment variables from .env file
dotenv.load();

// Controllers
const IndexController = require('./controllers/index');

const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  helpers: {
    ifeq(a, b, options) {
      if (a === b) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    toJSON(object) {
      return JSON.stringify(object);
    },
    exists(variable, options) {
      if (typeof variable !== 'undefined') {
        return options.fn(this);
      }
    },
    timeago: require('helper-timeago')
  },
  extname: 'hbs'
});

const github = setupGithubApi();

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('port', process.env.PORT || 5000);
app.set('github', github);

// Production error handler
if (process.env.NODE_ENV === 'production') {
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.sendStatus(err.status || 500);
  });
} else {
  app.use(logger('dev'));
}

app.use(compression());
app.use(bodyParser.json());

app.get('/', IndexController.index);

app.listen(app.get('port'), () => {
  console.log(`Express server listening on port ${app.get('port')}`);
});

// export module
module.exports = app;
