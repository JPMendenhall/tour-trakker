let lat;
let long;

let allEvents = [];
let matchedArtists = [];

function showResult(result) {
  matchedArtists = [];
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
        imgPlaceholder();
      })
    }
  })
}

function imgPlaceholder(){
  for(let i = 0; i < matchedArtists.length; i++){
    if(matchedArtists[i].thumb == ""){
      matchedArtists[i].thumb = "nophoto.jpg"
    }
  }
}

function loopArrays(){
  for (var i = 0; i < allEvents.length; i++) {
    for (var j = 0; j < pandoraArtists.length; j++) {
      if (allEvents[i].artist == pandoraArtists[j]) {
        console.log(allEvents[i].artist)
        if(allEvents[i].date !== null){
          matchedArtists.push(allEvents[i])
        }
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


$(document).ready(function animationClick() {
  logo = $('.tourtrakker');
  btnClick = $('.clicks')
  btnClick.click(
    function() {
      logo.addClass('animated jello');
        window.setTimeout( function(){
          logo.removeClass('animated jello');
    }, 10000);
    });
})
