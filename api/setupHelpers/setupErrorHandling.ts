import express, { ErrorRequestHandler } from 'express';
import logger from 'morgan';

const setupErrorHandling = (app: express.Express) => {
  // Production error handler
  if (process.env.NODE_ENV === 'production') {
    const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
      console.error(err.stack);
      res.sendStatus(err.status || 500);
    };

    app.use(errorHandler);
    return app;
  }

  app.use(logger('dev'));
  return app;
};

export default setupErrorHandling;
