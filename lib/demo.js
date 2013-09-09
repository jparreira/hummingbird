// Demo mode
//
// Replays a sample traffic log to give an idea of what real traffic
// would look like

var fs     = require('fs');
var Metric = require('./metric');

exports.run = function() {
  fs.readFile(__dirname + "/../data/sample_traffic_small.log", function(err, logFile) {
    if(err) { throw err; }

    var lines = logFile.toString().split("\n");

    function submitLine(lines) {
      var line = lines[0];
      if(!line) {
        // start over. 
        // uncomment the next line if you want to start over when sample traffic finishes
        // return submitLine(logFile.toString().split("\n"));
        return;
      }

      var ip = line.split(" ")[0];
      var req = { params: {ip: ip}, headers: { referer: "/" } };
      if(Math.random() * 8 > 7) { req.params.event = "cart_add"; }

      Metric.insert(req);
      setTimeout(function() {
        submitLine(lines.slice(1));
      }, Math.random() * 200);
    }

    submitLine(lines);
  });
};
