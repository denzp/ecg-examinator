var animationFrameWaiters = [];
var refreshInterval = setInterval(function() {
  var lastWaiters = animationFrameWaiters;
  animationFrameWaiters = [];

  lastWaiters.forEach(function(func) {
    func();
  });
}, 0);

window.requestAnimationFrame = function(callback) {
  animationFrameWaiters.push(callback);
};
