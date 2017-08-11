var restify = require('restify'),
    fs      = require('fs'),
    config  = require('./bin/config.js'),
    db      = require('./bin/db.js');
var app     = restify.createServer();

db.initDB('keepAlive');

app.use(restify.queryParser())
app.use(restify.CORS())
app.use(restify.fullResponse())

// Routes
app.get('/parks/within', db.selectBox);
app.get('/parks', db.selectAll);
app.get('/status', function (req, res, next)
{
  // http://parks-elb-sg-parks-157421118.eu-central-1.elb.amazonaws.com/parks/within?lat1=37.412164190504456&lon1=-120.09635925292969&lat2=37.899239630600185&lon2=-119.48936462402344
  req.query.lat1 = "37.4121";
  req.query.lon1 = "-120.0963";
  req.query.lat2 = "37.8992";
  req.query.lon2 = "-119.4893";
  rows = db.selectBox(req, res, next);
});

app.get('/', function (req, res, next)
{
  var data = fs.readFileSync(__dirname + '/index.html');
  res.status(200);
  res.header('Content-Type', 'text/html');
  res.end(data.toString().replace(/host:port/g, req.header('Host')));
});

app.get(/\/(css|js|img)\/?.*/, restify.serveStatic({directory: __dirname+'/static/'}));

app.listen(config.get('PORT'), config.get('IP'), function () {
  console.log( "Listening on " + config.get('IP') + ", port " + config.get('PORT'))
});
