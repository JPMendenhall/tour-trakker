let lat;
let long;

function showResult(result) {
    let lat = result.geometry.location.lat();
    let long = result.geometry.location.lng();
    console.log(lat)
    console.log(long)
    searchEvents(lat, long).then(results => {
      console.info('GREAT SUCCESS:', results)
    })
}

function getLatitudeLongitude(callback, address) {
    // If adress is not supplied, use default value 'Ferrol, Galicia, Spain'
    address = address || 'Ferrol, Galicia, Spain';
    // Initialize the Geocoder
    geocoder = new google.maps.Geocoder();
    if (geocoder) {
        geocoder.geocode({
            'address': address
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                callback(results[0]);
            }
        });
    }
}

var button = document.getElementById('btn');

button.addEventListener("click", function () {
    var address = document.getElementById('address').value;
    getLatitudeLongitude(showResult, address)

});
