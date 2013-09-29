'use strict';

angular.module('yt2getherApp')
  .controller('MainCtrl', function ($scope, socket) {
    var embedVideo
      , createRoom
      , parseVideoId
      , player
      , elCanvasWrapper = $("#player-canvas-wrapper")
      , elCanvas = $("#canvas")
      , size = { width: 640, height: 390 };

    $scope.room = {};
    $scope.canvasState = "on";

    // init canvas
    elCanvas.attr({
      width: size.width+"px",
      height: size.height+"px"
    }).on('click',function(event){
      var roomData = $scope.room;
      roomData.canvasSnapshot = elCanvas[0].toDataURL("image/png");
      socket.emit("rooms/update", roomData);
    }).sketch();

    parseVideoId = function(s){
      var match = s.match(/v=([^&]*)/)
      if(match){
        return match[1];
      }
      return s;
    };

    embedVideo = function(id){
      $("#player").replaceWith($("<div></div>", {id: "player"}));
      player = new YT.Player('player', {
        playerVars: {
          'controls': 1,
          'wmode': 'opaque'
        },
        height: size.height,
        width: size.width,
        videoId: id,
        events: {
          "onStateChange": function(s){
            var data = $scope.room
            data.state = s.data;
            data.time = s.target.getCurrentTime();
            data.ts = (new Date()).getTime();

            if(s.data === 2){ s.target.seekTo(data.time); }

            socket.emit("rooms/update", data);
          }
        }
      });
      window.pl = player;
    };

    createRoom = function(){
      var id = Math.random().toString(36).substring(7);

      $scope.room.id = id;
      $scope.room.url = window.location.origin+"/#/room/"+id;

      socket.emit("rooms/create", $scope.room);

      return $scope.room;
    };

    // public API

    $scope.submit = function(){
      if(!$scope.room.id) createRoom();

      $scope.room.videoId = parseVideoId($scope.room.videoId);

      embedVideo($scope.room.videoId);

      socket.emit("rooms/update", $scope.room);
    };

    $scope.toggleCanvas = function(e){
      e.preventDefault();
      elCanvasWrapper.toggle();
      $scope.canvasState = (elCanvasWrapper.is(":visible") ? "off" : "on");

    };
  });
