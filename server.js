/* Copyright Temasys Communications, 2014 */
var connect = require('connect');
connect.createServer(connect.static(__dirname)).listen(8021);
console.log("Server start @ 8021");