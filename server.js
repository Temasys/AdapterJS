/* Copyright Temasys Communications, 2014 */
var connect = require('connect');
var fs = require('fs');
var https = require('https');
var app = connect();
app.use(connect.static(__dirname));

connect.createServer().listen(8081);
https.createServer({
  key: fs.readFileSync('certificates/server.key'),
  cert: fs.readFileSync('certificates/server.crt')
}, app).listen(8082);
console.log("Server start @ 8081 (HTTP) 8082 (HTTPS)");