import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { SUPERSECRET } from './config';

export default (app, db, authRoutes) => {
  // route to authenticate a user
  app.post('/authenticate', (req, res) => {
    db.User.findOne({
      username: req.body.username
    }, (errorFindingUser, user) => {
      if (errorFindingUser) {
        throw errorFindingUser;
      }

      if (!!user && !!user.password && !!req.body.password) {
        // check if password matches
        bcrypt.compare(req.body.password, user.password, (errorBcrypt, bCryptRes) => {
          if (errorBcrypt) {
            throw errorBcrypt;
          }

          if (bCryptRes === true) {
            // Logged in
            const token = jwt.sign(user, SUPERSECRET, {
              expiresInMinutes: 60 * 24
            });

            res.json({
              success: true,
              message: 'Logged in',
              token: token
            });
          } else {
            res.json({
              success: false,
              message: 'Authentication failed. Wrong password.'
            });
          }
        });
      } else {
        res.json({
          success: false,
          message: 'Authentication failed. User not found.'
        });
      }
    });
  });

  // route middleware to verify a token
  authRoutes.forEach(route => {
    route.use((req, res, next) => {
      // check header or url parameters or post parameters for token
      const token = req.body.token || req.query.token
        || req.headers['x-access-token'];

      let returnValue;

      if (token) {
        jwt.verify(token, SUPERSECRET, (error, decoded) => {
          if (error) {
            res.statusCode = 403;

            returnValue = res.json({
              success: false,
              message: 'Failed to authenticate token.'
            });
          } else {
            req.decoded = decoded;
            next();
          }
        });
      } else {
        res.statusCode = 403;

        returnValue = res.json({
          success: false,
          message: 'No token provided.'
        });
      }

      if (typeof returnValue !== 'undefined') {
        return returnValue;
      }
    });
  });
};
