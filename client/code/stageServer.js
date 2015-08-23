const express = require('express');

const app = express();

/*
import { COOKIE_SECRET } from './js/config';

// Cookies
app.use(express.cookieParser(COOKIE_SECRET));

app.use('/', (req, res, next) => {

  next();
});
*/

app.use('/', express.static('./code/html'));

app.listen(process.env.PORT || 3000);
