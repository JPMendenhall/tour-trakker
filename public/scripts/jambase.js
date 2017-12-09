
const transformConcert = (concert) => ({
    eventName: concert.displayName,
    venue: concert.venue.displayName,
    url: concert.uri,
    date: concert.start.datetime,
    artists: concert.performance.map(p => p.displayName)
  })

const mergeAndFlattenArtists = concert => {
  return Promise.resolve(concert.artists)
    .delay(250)
    .tap(artists => console.log('(250ms delayed) Artists:', artists))
    .map(artist => {
      const result = Object.assign({}, concert, {
        artist: artist,
        thumb: ""
      })
      delete result.artists
      return Promise.props(result)
    })
    .delay(250)
}

//  thumb: getArtistThumb(artist) for ^^^^
const pagesLoaded = []

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
  .then(data => {
    // if we have: result.event.length === perPage, get more
    let results = data && data.resultsPage.results.event
    pagesLoaded[page - 1] = results
    console.log('pagesLoaded', pagesLoaded, 'RESULTS', results, 'perPage=', data.resultsPage.perPage);
    if (page < 5 && results.length === data.resultsPage.perPage) {
      return searchEvents(lat, long, page + 1)
    } else {
      console.log('DONE');
      return pagesLoaded
    }
  })
  .then(processPages)
}
const processPages = () => {
  return Promise.resolve(pagesLoaded)
  .reduce((events, page) => {
    return events.concat(page)
  }, [])
  .tap(items => console.log('Items count:', items.length))
  .map(transformConcert)
  .filter((concert, index) => index ) // only first index will continue
  .map(mergeAndFlattenArtists)
  // Flatten an array of arrays:
  .reduce((arr, concerts) => {
    arr = arr.concat(concerts)
    return arr
  }, [])
  .catch(err => console.error('searchEvents:', err))
}

function getArtistThumb(artistName) {
  return Promise.resolve($.ajax({
    type: "GET",
     url:"", //`https://api.discogs.com/database/search?q=${artistName}&key=ulclHueFeYIAHyQDxmNM&secret=eMEnhWAsqfErBHadlxeLmdhRiVPYXENK`,
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
// Need to incorporate latlong.js file
// searchEvents(lat, long)
// .then(results => {
//   console.info('GREAT SUCCESS:', results)
// })
