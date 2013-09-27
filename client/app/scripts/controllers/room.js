'use strict';

angular.module('yt2getherApp')
  .controller('RoomCtrl', function ($scope, $routeParams, socket, $q) {
    var embedVideo
      , playerDeffered = $q.defer()
      , playerPromise = playerDeffered.promise
      , elCanvasWrapper = $("#player-canvas-wrapper");

    $scope.room = { id: $routeParams.id };

    embedVideo = function(id){
      $("#player").replaceWith($("<div></div>", {id: "player"}));
      new YT.Player('player', {
        playerVars: {
          'controls': 1,
          'wmode': 'opaque'
        },
        height: '390',
        width: '640',
        videoId: id,
        events: {
          'onReady': function(e){
            playerDeffered.resolve(e.target);
            window.pl = e.target;
          }
        }
      });
    };

    // socket events
    socket.on("rooms/set", function(data){
      console.log(data);
      var ts = (new Date()).getTime();

      // load video
      if($scope.room.videoId !== data.videoId) embedVideo(data.videoId);

      // playback
      if(data.state === 1){
        playerPromise.then(function(player){
          player.seekTo(data.time+((ts-data.ts)/1000)+0.5).playVideo();
        });
      }
      if(data.state === 2){
        playerPromise.then(function(player){
          player.pauseVideo().seekTo(data.time);
        });
      }

      // canvas
      if(data.canvasSnapshot){
        elCanvasWrapper.html($("<img />", {src: data.canvasSnapshot}));
      }


      $scope.room = data;
    });

    // get info about room
    socket.emit("rooms/show", $scope.room);
  });

