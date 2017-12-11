let lat;
let long;

let allEvents = [];
let matchedArtists = [];

function showResult(result) {
  let lat = result.geometry.location.lat();
  let long = result.geometry.location.lng();
  console.log(lat)
  console.log(long)
  searchEvents(lat, long).then(results => {
    console.info('GREAT SUCCESS:', results)
    allEvents = results;
    loopArrays();
    for (let i = 0; i < matchedArtists.length; i++){
      getArtistThumb(matchedArtists[i].artist)
      .then(thumb => {
        matchedArtists[i].thumb = thumb
      })
    }
  });
}

function loopArrays(){
  for (var i = 0; i < allEvents.length; i++) {
    for (var j = 0; j < pandoraArtists.length; j++) {
      if (allEvents[i].artist == pandoraArtists[j]) {
        console.log(allEvents[i].artist)
        matchedArtists.push(allEvents[i])
      }
    }
  }
}

function getLatitudeLongitude(callback, address) {
// If address is not supplied, use 'Denver, Colorado'
address = address || 'Denver, Colorado';
// Initialize the Geocoder
geocoder = new google.maps.Geocoder();
if (geocoder) {
  geocoder.geocode({
    'address': address
  }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      callback(results[0]);
    }
  });
}
}

var button = document.getElementById('locationBtn');

button.addEventListener("click", function() {
var address = document.getElementById('address').value;
getLatitudeLongitude(showResult, address)
});
