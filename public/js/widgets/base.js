if(!Hummingbird) { var Hummingbird = {}; }

Hummingbird.Base = function() {};

Hummingbird.Base.prototype = {

  messageCount: 0,  

  initialize: function(options) {
    this.averageLog = [];

    if(options && options.startDisabled) {
      this.startDisabled();
    } else {
      this.start();
    }
  },

  startDisabled: function() {
    var _this = this;
    var overlay = $("<div class='hummingbird_overlay'>Start Real-time Analytics</div>");

    this.element.css({position: 'relative'});
    this.element.append(overlay);

    overlay.css({ lineHeight: this.element.height() + "px" });

    overlay.click(function(e) {
      e.preventDefault();
      $(this).hide('slide', {direction: 'up'}, function() {
        _this.start();
      });
    });
  },

  start: function() {
    this.registerHandler();
    var self = this;
    this.socket.join(this.options.from, function (message) {        
        self.onData(message);
    });      
  },

  registerHandler: function() {

    Realtime.EventManager.subscribe(
            this.options.from,            
            function(message, average){ 
              this.onMessage(message, average);
            }.bind(this)
    );
    
  },

  onMessage: function(message) {
    console.log("Base class says: " + JSON.stringify(message));
  },

  onData: function(message) {
    var average;

    this.messageCount += 1;
    var parsedMessage = JSON.parse(message);

    // Calculate the average over N seconds if the averageOver option is set
    if(this.options.averageOver && typeof(parsedMessage) == "number") { average = this.addToAverage(parsedMessage); }

    if((!this.options.every) || (this.messageCount % this.options.every == 0)) {      
      Realtime.EventManager.publish(this.options.from, parsedMessage, this.average());
    }
  },

  addToAverage: function(newValue) {
    var averageCount = this.options.averageOver * this.options.ratePerSecond;

    this.averageLog.push(newValue);
    if(this.averageLog.length > averageCount) {
      this.averageLog.shift();
    }
  },

  average: function() {
    if(this.averageLog.length == 0) { return 0; }

    return this.averageLog.sum() * 1.0 / this.averageLog.length * this.options.ratePerSecond;
  },

  pageIsVisible: function() {
    if (typeof document.hidden !== "undefined") {
      return !document.hidden;
    } else if (typeof document.mozHidden !== "undefined") {
      return !document.mozHidden;
    } else if (typeof document.msHidden !== "undefined") {
	    return !document.msHidden;
    } else if (typeof document.webkitHidden !== "undefined") {
      return !document.webkitHidden;
    }
    // Give up
    return true;
  },


};
