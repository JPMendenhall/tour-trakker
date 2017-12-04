// songkick apikey=io09K9l3ebJxmxe2

const transformConcert = (concert) => ({
    eventName: concert.displayName,
    venue: concert.venue.displayName,
    url: concert.uri,
    date: concert.start.date,
    artists: concert.performance.map(p => p.displayName)
  })


const mergeAndFlattenArtists = concert => {
  return Promise.resolve(concert.artists)
    .delay(250)
    .tap(artists => console.log('(250ms delayed) Artists:', artists))
    .map(artist => {
      const result = Object.assign({}, concert, {
        artist: artist,
        thumb: getArtistThumb(artist)
      })
      delete result.artists
      return Promise.props(result)
    })
    .delay(250)
}

const searchEvents = (lat, long, page = 1) => {
  const getUrl = (page) => `http://api.songkick.com/api/3.0/events.json?apikey=io09K9l3ebJxmxe2&location=geo:${lat},${long}&page=${page}`

  return Promise.resolve($.ajax({
    type: "GET",
    url: getUrl(page),
    async: true,
    dataType: "json",
  }))
  .timeout(15000)
  .tap(console.log.bind(console, 'GET Results:'))
  .then(data => data && data.resultsPage.results.event)
  .tap(items => console.log('Items count:', items.length))
  .map(transformConcert)
  .filter((concert, index) => index < 5) // only first index will continue
  .map(mergeAndFlattenArtists)
  // Flatten an array of arrays:
  .reduce((arr, concerts) => {
    arr = arr.concat(concerts)
    return arr
  }, [])
  .catch(err => console.error('searchEvents:', err))
  // .then(concerts => {
  //   return concerts.map(c => {
  //     return Promise.all(artists.map(a => getArtistInfo(a)))
  //
  //   })
  //   // return concerts.map(({artists}) =>
  //   // .then(artistResults => {
  //   //
  //   //     return {avatar: }
  //   // })
  // })
    // success: function(json) {
    //   const {results} = json && json.resultsPage || {};
    //   let eventName = results.event[35].displayName;
    //   let artistName = results.event[35].performance[0].artist.displayName;
    //   console.log(json)
    //   console.log('Event Name', results.event[35].displayName)
    //   //Refer to totalEntries to know how many pages to loop through
    //   // performance[0] needs to be looped through since multiple artists play same show
    //   console.log('Because you liked a track from ',
    //   results.event[35].performance[0].artist.displayName)
    //   console.log('Concert Date', results.event[35].start.datetime)
    //   console.log('Venue', results.event[35].venue.displayName)
    //   console.log('Event and Ticket Details', results.event[35].uri)
    //     // GET request should only be ran if artist name matches "liked" artist collection
    //
    //    // Parse the response.
    //   // Do other things.
    // },
    // error: console.error.bind(console, 'SONGKICK Failed: ')//function(xhr, status, err) {}
    // });
}

function getArtistThumb(artistName) {
  return Promise.resolve($.ajax({
    type: "GET",
    url: `https://api.discogs.com/database/search?q=${artistName}&key=ulclHueFeYIAHyQDxmNM&secret=eMEnhWAsqfErBHadlxeLmdhRiVPYXENK`,
    async: true,
    dataType: "json"
  }))
  .then(({results}) => {
    if (results && results.length >= 1) {
      return results[0].thumb
    }
    return 'nophoto.jpg'
  })
}
//Need to incorporate saved JSFiddle to retrieve lat and long based on input
searchEvents(39.768, -86.158)
.then(results => {
  console.info('GREAT SUCCESS:', results)
})
