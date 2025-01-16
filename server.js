const http = require('http');
const app = require('./app');

// variable for the listening port of the server
const port = process.env.PORT || 3000;

const server = http.createServer(app);

// server listen port
server.listen(port);