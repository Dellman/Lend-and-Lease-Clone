var express = require('express')
var cors = require('cors')
var app = express()

app.use(cors())

app.get('/', function (req, res, next) {
  res.send('I LOVE this.');//json({msg: 'This is CORS-enabled for all origins!'})
})

app.post('/', function(req, res, next){
       res.send('Post Message');
});


app.listen(8080, function () {
  // console.log('CORS-enabled web server listening on port 8080');
})
