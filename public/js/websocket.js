if(!Hummingbird) { var Hummingbird = {}; }

Hummingbird.WebSocket = function(url, token) {
  this.url = url;
  this.token = token;
  this.state = "stopped";
  this.handlers = [];
  this.emitted = [];
};

Hummingbird.WebSocket.prototype = {
  // WebSocket callbacks
  onClose: function() {    
  },

  onOpen: function() {
    console.log("socket started");
    this.state = "started";    
  },

  onAuth: function(isAuthed) {
    if(!isAuthed) {
      console.log("socket auth failure");
      return;
    }

    console.log("socket authed");
    this.state = "authed";
        
  },

  join: function(metric, callback) {
    // Subscribe to the Realtime Framework metric channel    
    this.socket.subscribe(metric, true, function (o,channel,message) {      
      callback(message);
    });
  },

  on: function(event, callback) {    
  },

  emit: function(event) {    
  },

  connect: function(callback) {
    console.log('Connected to ' + this.url);    
    
    var _this = this;

    // Loads the Realtime Framework Factory
    loadOrtcFactory(IbtRealTimeSJType, function (factory, error) {
       if (error != null) {
           alert("Factory error: " + error.message);
       } else {
           if (factory != null) {          
                // Creates a Realtime Framework client
               _this.socket = factory.createClient();                               
               _this.socket.setClusterUrl(_this.url);

              // Change this to your free Realtime.co application key
              // Get it at https://app.realtime.co/developers/getlicense

               var applicationKey = '2Ze1dz';
               var sessionToken = 'serverToken'

              // Connects the client to the Realtime Framework Cluster
               _this.socket.connect(applicationKey, sessionToken);               

               _this.socket.onConnected = function (o) {
                  // client is connected
                  callback(_this); 
                  _this.onAuth(true);
                  _this.onOpen();   
               }

               _this.socket.onDisconnected = function (o) { 
                  // client was disconnected
                  _this.onClose();
               };
            }
      }          
    });    
  }, 

  disconnect: function() {
    this.socket.disconnect();
  }
}
