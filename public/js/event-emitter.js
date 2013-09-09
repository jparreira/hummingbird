(function (Realtime, $, undefined) {
    
var EventEmitter = function(){
 this.on = function(eventName,onEvent){
  $(document).on(eventName,function(event){
   var eventArguments = [];

   for(var i = 1; i < event.argumentsLength; i ++){
    eventArguments.push(event[i]);
   }

   onEvent.apply(this,eventArguments);
  });
 }

 this.removeAllListeners = function(eventName){
  $(document).off(eventName);
 }

 this.emit = function(){
  var event = {
   type : arguments[0],
   argumentsLength : arguments.length
  }

  for(var i = 1; i < arguments.length; i++){
   event[i] = arguments[i];
  }

  $.event.trigger(event);
 }
}

var EventManager = function(configuration){
 this.emitter = new EventEmitter();  

 if(EventManager.caller != EventManager.getInstance){
  throw new Error("This object cannot be instanciated");
 }
};

EventManager.instance = null;

EventManager.getInstance = function(){
 if(this.instance === null){
  this.instance = new EventManager();
 }
 return this.instance;
};

EventManager.prototype = {
 subscribe : function(eventName,onEvent){
  this.emitter.on(eventName,onEvent);
 },

 unsubscribe : function(eventName){
  this.emitter.removeAllListeners(eventName);
 },

 publish : function(){
  this.emitter.emit.apply(this.emitter,arguments);
 } 
};

Realtime.EventManager = EventManager.getInstance();


})(window.Realtime = window.Realtime || {}, jQuery);