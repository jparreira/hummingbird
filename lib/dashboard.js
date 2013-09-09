
var staticServer = require('node-static');
var Metric       = require('./metric');
var ortcNodeclient = require('ibtrealtimesjnode').IbtRealTimeSJNode;

var fileServer = new(staticServer.Server)("./public");

var defaultHandler = function(request, response) {
  console.log(" - " + request.url);
  fileServer.serve(request, response);
};

var server = require('http').createServer(defaultHandler);

var ortcClient = new ortcNodeclient();
ortcClient.setClusterUrl('http://ortc-developers.realtime.co/server/2.1/');

ortcClient.onConnected = function (ortc) {

      var numMsgs = 0;

      Metric.loadMetrics(function(metric) {
        metric.on('data', function(metricName, data) {                        
            ortcClient.send(metricName, JSON.stringify(data));
            numMsgs++;          
        });

        metric.start();
      });

      setInterval(function() { 
          console.log("Sending", numMsgs, " messages/sec"); 
          numMsgs = 0; 
      }, 1000);
  }

// Change this to your free Realtime.co application key
// Get it at https://app.realtime.co/developers/getlicense
var applicationKey = '2Ze1dz';
var sessionToken = 'clientToken'

ortcClient.connect(applicationKey, sessionToken);

module.exports = server;
