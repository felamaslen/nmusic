import { Router as router } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';

// sub-routes
import auth from './auth';
import api from './api';

// Connect to database
import db from './db';

export default app => {
  const apiRouter = router();

  // use body parser so we can get info from POST and/or URL parameters
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // use morgan to log requests to the console
  if (process.env.DEVSERVER) {
    app.use(morgan('dev'));
  }

  // default headers
  app.all('/*', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Origin', '*');
  //  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  //  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,x-access-token,content-type');
  //  res.setHeader('Access-Control-Allow-Credentials', true);

    return next();
  });

  // Authentication
  auth(app, db.model, [apiRouter]);

  // API methods (i.e. actual data)
  api(apiRouter, db.model);

  app.use('/api', apiRouter);
};
