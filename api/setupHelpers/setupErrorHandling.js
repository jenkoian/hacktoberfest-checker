'use strict';

const logger = require('morgan');

const setupErrorHandling = (app) => {
  // Production error handler
  if (process.env.NODE_ENV === 'production') {
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.sendStatus(err.status || 500);
    });
    return app;
  }

  app.use(logger('dev'));
  return app;
};

module.exports = setupErrorHandling;
