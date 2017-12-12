'use strict';

angular.module('concertList').
controller('ConcertListCtrl', function($scope, $interval, artistService){
  $scope.artistService = artistService;
  $scope.count = 0
  $scope.addCount = () => $scope.count ++
  $interval($scope.addCount, 1000)
  function hideLogin($scope) {
  $scope.advstatus = true;
  };
  // $scope.countdown = moment(new Date()).countdown("2018-05-25").toString();

}).
factory('artistService', ['$window', function(win) {
   return function() {
      return matchedArtists
   };
 }]);
