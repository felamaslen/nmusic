import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { SUPERSECRET } from './config';

export default (app, db) => {
  app.post('/authenticate', (req, res) => {
    db.User.findOne({
      username: req.body.username
    }, (errorFindingUser, user) => {
      if (error) {
        throw errorFindingUser;
      }

      if (!!user) {
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
};
