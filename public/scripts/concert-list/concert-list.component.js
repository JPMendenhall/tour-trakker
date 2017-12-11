'use strict';

angular.module('concertList').
controller('ConcertListCtrl', function($scope, $interval, artistService){
  $scope.artistService = artistService;
  $scope.count = 0
  $scope.addCount = () => $scope.count ++
  $interval($scope.addCount, 1000)

  console.log('scopematched', $scope.matchedArtists)
  console.log('matched', matchedArtists)
  function hideLogin($scope) {
  $scope.advstatus = true;
  };
}).
factory('artistService', ['$window', function(win) {
   return function() {
      return matchedArtists
   };
 }]);
