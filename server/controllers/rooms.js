"use strict";

var rooms = {}
  , roomSockets = {}
  , roomsController;

roomsController = {
  init: function(socket){
    socket.on("rooms/create", function(data){
      var roomData = data;
      roomData.director = socket.id;

      rooms[data.id] = roomData;

      roomSockets[data.id] = [socket.id];
    });

    socket.on("rooms/update", function(data){
      rooms[data.id] = data;

      if(roomSockets[data.id]){
        for(var s in roomSockets[data.id]){
          socket.manager.sockets.socket(roomSockets[data.id][s]).emit("rooms/set", rooms[data.id]);
        }
      }
    });

    socket.on("rooms/show", function(data){
      var roomData = rooms[data.id];
      roomSockets[data.id].push(socket.id);
      socket.emit("rooms/set", roomData);
    });
  }
}

module.exports = roomsController;
