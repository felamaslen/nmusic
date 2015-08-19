var Express = require('express');

var server = Express();
server.use('/', Express.static('./code/html'));
server.listen(process.env.PORT || 3000);