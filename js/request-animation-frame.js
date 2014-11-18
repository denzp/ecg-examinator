(function() {
  window.originalRequestAnimationFrame = window.requestAnimationFrame;
  window.requestAnimationFrame = function(callback) {
    animationFrameWaiters.push(callback);
  };

  var animationFrameWaiters = [];
  window.originalRequestAnimationFrame(function handler() {
    var lastWaiters = animationFrameWaiters;
    animationFrameWaiters = [];

    lastWaiters.forEach(function(func) {
      func();
    });

    window.originalRequestAnimationFrame(handler);
  });


})();
