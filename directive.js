'use strict';

var dragula = require('dragula');
var elementKey = 'dragula-key';

/*jshint unused: false*/
function register (angular) {
  return ['dragulaService', function angularDragula (dragulaService) {
    return {
      restrict: 'A',
      scope: {
        dragulaScope: '=',
        dragulaModel: '='
      },
      link: link
    };

    function link (scope, elem, attrs) {
      var dragulaScope = scope.dragulaScope || scope.$parent;
      var container = elem[0];
      var name = scope.$eval(attrs.dragula);
      var drake;

      var bag = dragulaService.find(dragulaScope, name);
      if (bag) {
        drake = bag.drake;
        drake.containers.push(container);
      } else {
        drake = dragula({
          containers: [container]
        });
        dragulaService.add(dragulaScope, name, drake);
      }

      scope.$watch('dragulaModel', function (newValue, oldValue) {
        if (!newValue) {
          return;
        }

        if (!drake.models) {
          drake.models = {};
        }

        if (!elem.attr(elementKey)) {
          elem.attr(elementKey, new Date().getTime() + '_' + Math.round((100 + Math.random())));
        }
        drake.models[elem.attr(elementKey)] = newValue;

        dragulaService.handleModels(dragulaScope, drake);
      });
    }
  }];
}

module.exports = register;
