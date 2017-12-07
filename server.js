var express = require('express');
var app = express();

app.use(express.static('public'))

app.get('/matchedArtists', function(req,res, next){
  let matchedArtists = [
    'hi',
    'hello'
  ];
  return res.send(matchedArtists);
})

app.listen(3000, () => console.log('App listening on port 3000!'))
