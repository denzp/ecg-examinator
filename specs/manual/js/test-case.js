angular
.module('ecg.specs.manual')
.directive('testCase', function() {
  // find MSE between images
  function equality(reference, implementation) {
    var img = reference.find('img')[0];

    var implCanvas = implementation.find('canvas')[0],
        refCanvas  = document.createElement('canvas');

    var implCtx = implCanvas.getContext('2d'),
        refCtx  = refCanvas.getContext('2d')

    refCanvas.width  = implCanvas.width;
    refCanvas.height = implCanvas.height;
    refCtx.drawImage(img, 0, 0);

    var implImageData = implCtx.getImageData(0, 0, implCanvas.width, implCanvas.height),
        refImageData  = refCtx.getImageData(0, 0, refCanvas.width, refCanvas.height);

    var errorSquare = 0,
        errorSquareCount = 0;

    for(var i = 0; i < refCanvas.height; ++i) {
      for(var j = 0; j < refCanvas.width; ++j) {
        var offset = (i * refCanvas.width + j) * 4; // (r, g, b, a) for each pixel

        var refLuminance = (
            refImageData.data[offset + 0] +
            refImageData.data[offset + 1] +
            refImageData.data[offset + 2]) / 3;

        var implLuminance = (
            implImageData.data[offset + 0] +
            implImageData.data[offset + 1] +
            implImageData.data[offset + 2]) / 3;

        var refAlpha  = refImageData.data[offset + 3],
            implAlpha = implImageData.data[offset + 3];

        if(refLuminance + refAlpha !== implLuminance + implAlpha) {
          var diff = refLuminance + refAlpha - implLuminance - implAlpha;

          errorSquare += diff * diff / 4;
          ++errorSquareCount;
        }
      }
    }

    if(errorSquareCount === 0) {
      return 0;
    }

    return errorSquare / (refCanvas.width * refCanvas.height);
  }

  function rateImplementation(implementation, mse) {
    mse = mse.toFixed(4);
    implementation.find('div').remove();

    var div = document.createElement('div');
    div.innerHTML = 'implementation. <strong>MSE: ' + mse + '</strong>';
    implementation.append(div);
  }

  function assertMatch(reference, implementation, header) {
    var result = equality(reference, implementation);
    rateImplementation(implementation, result);

    if(result < 2) {
      header.addClass('success');
    }
    else {
      header.addClass('fail');
    }
  }

  function assertNotMatch(reference, implementation, header) {
    var result = equality(reference, implementation);
    rateImplementation(implementation, result);

    if(result > 20) {
      header.addClass('success');
    }
    else {
      header.addClass('fail');
    }
  }

  function assertComparsion(reference, implementations, header) {
    var results = [];

    for(var i = 0; i < implementations.length; ++i) {
      var elem   = angular.element(implementations[i]),
          result = equality(reference, elem);

      rateImplementation(elem, result);
      results.push(result);
    }

    var successorsCount = 0;
    for(var i = 1; i < results.length; ++i) {
      if(results[i] > results[i - 1]) {
        ++successorsCount;
      }
    }

    if(successorsCount === results.length - 1) {
      return header.addClass('success');
    }

    if(successorsCount === 0) {
      return header.addClass('fail');
    }

    return header.addClass('partial');
  }

  return {
    restrict: 'C',

    link: function($scope, elem, attrs) {
      var reference       = angular.element(elem[0].querySelector('.reference')),
          implementations = angular.element(elem[0].querySelectorAll('.implementation')),
          header          = elem.find('header');

      setTimeout(function() {
        if(attrs.type === 'comparsion') {
          return assertComparsion(reference, implementations, header);
        }

        if(attrs.type === 'match') {
          return assertMatch(reference, implementations, header);
        }

        if(attrs.type === 'not-match') {
          return assertNotMatch(reference, implementations, header);
        }

        throw new Error('unknown test case type "' + $scope.type + '".');
      });
    }
  }
});
