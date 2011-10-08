var loop = true;

onconnect = function(e) {
  var port = e.ports[0];
  port.postMessage('Hello world from: ' + port);  
}

function start() {
  // When I hit an input, don't want to run the next line of code, so
  // stop execution, but keep all state?
  // Need a way to tell when to stop looping, which is by polling
  // some sort of variable. 
  // But that    
 
 
}
