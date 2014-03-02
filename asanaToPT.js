var config = require("config"),
	asana = require('asana');

var asanaKey = config.asanaKey;
asana.setApiKey(asanaKey);
console.log("Asana Key: " + asanaKey);

var ptKey = config.ptKey;
console.log("Pivotal Tracker Key: " + ptKey);





var 

  asana.setApiKey('1NK9OUI.Qn0nrbByagb8fB2TGyOeziEN');

  asana.getUserMe(null, function(error, me){
    console.log(me)
  });