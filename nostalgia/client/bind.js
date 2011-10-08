function bind(scope, fn) {
  var args = Array.prototype.slice.call(arguments, 2);
  return function() {
    return fn.apply(scope, Array.prototype.slice.call(arguments).concat(args));
  }
};
