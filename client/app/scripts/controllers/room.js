'use strict';

angular.module('yt2getherApp')
  .controller('RoomCtrl', function ($scope, $routeParams, socket, $q) {
    var embedVideo
      , executeCommand
      , player
      , roomState
      , elCanvasWrapper = $("#player-canvas-wrapper");

    $scope.room = { id: $routeParams.id };

    embedVideo = function(id){
      $("#player").replaceWith($("<div></div>", {id: "player"}));
      new YT.Player('player', {
        playerVars: {
          'controls': 0,
          'wmode': 'opaque'
        },
        height: '390',
        width: '640',
        videoId: id,
        events: {
          'onReady': function(e){
            player = e.target;
            if(roomState) executeCommand(roomState);
          }
        }
      });
    };

    executeCommand = function(data){
      var ts = (new Date()).getTime();

      // load video
      if($scope.room.videoId !== data.videoId) embedVideo(data.videoId);

      // playback controll
      if(player){
        // play
        if(data.state === 1){
          player.seekTo(data.time+((ts-data.ts)/1000)+0.5).playVideo();
        }

        // pause
        if(data.state === 2){
          player.pauseVideo().seekTo(data.time);
        }
      }

      // canvas
      if(data.canvasSnapshot){
        elCanvasWrapper.html($("<img />", {src: data.canvasSnapshot}));
      }

      $scope.room = data;
    };

    // socket events
    socket.on("rooms/set", function(data){
      roomState = data;
      executeCommand(data);
    });

    // get info about room
    socket.emit("rooms/show", $scope.room);
  });

