//Get an access token using Resource owner flow

//dependencies
var request = require('request');
var express = require('express');


//configuration file
var config = require('./config.js');
var token = false;
var expiry = null;
var presentTime = null;

//api related instantiation
var app = express();
var router = express.Router();          // get an instance of the express Router

function getAccessTokenFromCredentials(cb){
  // On call check for expiry. If expired then make a request or else serve the
  // already acquired token.

  // Check for expiration:
  if (!(expiry == null)){
    // This is not the first request:
    presentTime = Date.now();
    if (expiry > presentTime / 1000){
      console.log('previous token is still valid');
      return cb(false, token);
    }

  }
  console.log('Making a request');
  // Make a new request for access_token to airvantage
  if (!config.username || !config.password || !config.client_id ||
      !config.client_secret || !config.accessTokenUrl) {
    console.log('Invalid configuration file');
  }
  var options = { method: 'POST',
    url: config.accessTokenUrl,
    timeout: 60000,
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    form: {
      grant_type: config.grant_type,
      username: config.username,
      password: config.password,
      client_id: config.client_id,
      client_secret: config.client_secret
    }
  };
  console.log('-------------------------------------------------------------');
  var startTime = Date.now();
  console.log('Sending request to av at ' + startTime);
  request(options, function (error, response, body) {
    if (error) return error.message;
    var stopTime = Date.now();
    var elapsed = stopTime-startTime;
    console.log('got response from av at ' + stopTime + ' after ' + elapsed + ' millis');
    //console.log(body);
    responseObj = JSON.parse(body);
    token = responseObj.access_token;
    expiry = responseObj.expires_in + Date.now() / 1000;
    var expDate = new Date(expiry * 1000)
    console.log('this token will expire: ' + expDate);
    return cb(error,token);
  }).on('error', function(e) {
    console.log('from the airvantage request in app.js: '+ e);
    var stopTime = Date.now();
    var elapsed = stopTime-startTime;
    console.log('failed at ' + stopTime + ' after ' + elapsed + ' millis');
    return cb(e, token);
  });
}

// ROUTES FOR OUR APP
router.get('/', function(req, res, next) {
    res.json({ message: 'TokenManager api!' });
    next();
});

router.get('/getToken', function(req, res, next) {
  getAccessTokenFromCredentials(function(error, token){
    if (!error){
      res.json({ access_token: token, success: true });
    }
    else{
      res.json({error: error, success: false});
    }
    next();
  })
});

// REGISTERING ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// Start the server -------------------------------
app.listen(config.port, function () {
  console.log('Token Manager is serving on port '+ config.port);
});
