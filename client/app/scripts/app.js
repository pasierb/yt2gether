'use strict';

angular.module('yt2getherApp', ["btford.socket-io"])
  .config(function ($routeProvider, socketProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/room/:id', {
        templateUrl: 'views/room.html',
        controller: 'RoomCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });


    var socket = io.connect("http://localhost:3000");
    socketProvider.ioSocket(socket);
  });
