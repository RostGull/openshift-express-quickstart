var   fs           = require('fs'),
      path         = require('path'),
      contentTypes = require('./utils/content-types'),
      sysInfo      = require('./utils/sys-info'),
      express      = require('express'),
      app          = express(),
      dir          = __dirname,
      env          = process.env;

var staticHomePage = function (req, res){
  console.log('Client requested home page.');
  res.sendFile(dir+'/static/index.html');
}

var forbiddenPage = function(req, res) {
  console.log('Client requested forbidden page.');
  res.status(403).sendFile(dir+'/static/forbidden.html');
}

// Make all assets public
app.use('/assets', express.static(dir+'/static/assets'));

// Home page / Root URL
app.get('/', staticHomePage);

// Forbidden page
app.get('/forbidden', forbiddenPage);


// API endpoint pool
app.get('/api/:endpoint', function(req, res) {
  var endpoint = req.params.endpoint;
  console.log('API endpoint: ' + endpoint + ' has been accessed.');
  res.send('I\'m a cool API. My name is ' + endpoint+'.');
});

// We must respond to Openshift Health
// Monitoring with a 200 response
app.get('/health', function(req, res) {
  res.sendStatus(200);
  res.end();
});

// 404 handler
app.get('/*', function(req, res){
  console.log('Client requested unknown file.');
  res.status(404).sendFile(dir+'/static/404.html');
});

app.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function () {
  console.log('Application worker '+process.pid+' started at port '+(env.NODE_PORT || 3000)+'...');
});
