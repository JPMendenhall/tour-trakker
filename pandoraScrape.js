const Nightmare = require('nightmare')
let artistArray = [];
function getPandora() {
  return Nightmare({show: true}).goto('https://www.pandora.com/account/sign-in').wait('input[name="username"]').type('input[name="username"]', 'nattysoccer9@yahoo.com').type('input[name="password"]', 'ska4gsus').wait(750).click('button[type="submit"]').wait(5000).goto('https://www.pandora.com/profile/thumbs/nattysoccer9').evaluate(() => {
    var pageSize = 100;
    var stationPageSize = 250;
    var webname = location.pathname.split("/").pop();
    var includeThumbsDown = true;
    var allThumbs = [];
    // Obtaining Pandora Auth
    var authToken = undefined;
    var csrfToken = undefined;
    var originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
    XMLHttpRequest.prototype.setRequestHeader = function(name, value) {
      if (name === "X-AuthToken") {
        authToken = value;
      }
      if (name === "X-CsrfToken") {
        csrfToken = value;
      }
      originalSetRequestHeader.apply(this, arguments);
      if (authToken && csrfToken) {
        XMLHttpRequest.prototype.setRequestHeader = originalSetRequestHeader; // Deregister hook
        getStations();
      }
    };
    window.scrollTo(0, document.body.scrollHeight); // Scroll to the bottom, keep loading
    // Get stations
    function getStations() {
      var req = new XMLHttpRequest();
      req.open('POST', "/api/v1/station/getStations", true);
      req.setRequestHeader("Content-Type", "application/json");
      req.setRequestHeader("X-AuthToken", authToken);
      req.setRequestHeader("X-CsrfToken", csrfToken);
      req.onreadystatechange = function() {
        if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
          var data = JSON.parse(req.responseText);
          var stations = [];
          for (var i = 0; i < data.stations.length; i++) {
            stations.push(data.stations[i].stationId);
          }
          getTracks(stations);
        }
      };
      req.send(JSON.stringify({pageSize: stationPageSize}));
    };
    // Fetch liked tracks
    function getTracks(stations) {
      function callback() {
        currentStationId++;
        if (currentStationId < stations.length) {
          console.log("Getting liked artists for station", currentStationId + 1, "of", stations.length);
          fetchPage(stations[currentStationId], true, 0, callback);
        } else {
          finalize();
        }
      };
      var currentStationId = -1;
      callback();
    };
    function fetchPage(stationId, positive, pageNumber, callback) {
      var req = new XMLHttpRequest();
      req.open('POST', "/api/v1/station/getStationFeedback", true);
      req.setRequestHeader("Content-Type", "application/json");
      req.setRequestHeader("X-AuthToken", authToken);
      req.setRequestHeader("X-CsrfToken", csrfToken);
      req.onreadystatechange = function() {
        if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
          var data = JSON.parse(req.responseText);
          data.feedback = data.feedback.map(function(item) {
            item.type = item.isPositive
              ? "Thumbs Up"
              : "Thumbs Down";
            return item;
          });
          allThumbs = allThumbs.concat(data.feedback);
          if (data.feedback.length > 0) {
            fetchPage(stationId, positive, pageNumber + 1, callback);
          } else {
            if (positive && includeThumbsDown) {
              fetchPage(stationId, false, 0, callback);
            } else {
              callback();
            }
          }
        }
      };
      req.send(JSON.stringify({
        pageSize: pageSize,
        positive: positive,
        startIndex: pageNumber * pageSize,
        stationId: stationId
      }));
    }
    // Compile output
    function finalize() {
      var string = "Artist";
      for (var i = 0; i < allThumbs.length; i++) {
        var thumb = allThumbs[i];
        string += "\n" + thumb.artistName.replace(/\t/g, "    ").replace(/\n|\r/g, "") + "";
      }
      console.log(string)
    }
  })
.then(result => {
  console.log('RESULTS:', artistArray);
});
}
getPandora()
