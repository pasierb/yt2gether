"use strict";

var socketIO = require("socket.io")
  , http = require("http")
  , roomsController = require("./controllers/rooms")
  , app
  , io;

app = http.createServer(function(req, res){});
io = socketIO.listen(app);

io.sockets.on("connection", function(socket){
  roomsController.init(socket);
});

app.listen(3000);
