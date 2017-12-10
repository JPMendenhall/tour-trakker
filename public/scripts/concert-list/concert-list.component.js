'use strict';

angular.module('concertList').
controller('ConcertListCtrl', function($scope){
  $scope.matchedArtists = matchedArtists;
  function hideLogin($scope) {
  $scope.advstatus = true;
  };

});
