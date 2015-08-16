'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

module.exports = (function () {

  'use strict';

  var Unit = (function () {
    function Unit(entity, properties, uniqid) {
      _classCallCheck(this, Unit);

      this.entity = entity + '';
      this.__uniqid__ = uniqid;

      this.load(properties || {});
    }

    _createClass(Unit, [{
      key: 'load',
      value: function load(properties) {

        var p = Object.create(null);

        Object.keys(properties).forEach(function (v) {

          p[v] = properties[v];
        });

        this.properties = p;

        return this;
      }
    }, {
      key: 'set',
      value: function set(property, value) {

        return this.properties[property] = value;
      }
    }, {
      key: 'unset',
      value: function unset(property) {

        return delete this.properties[property];
      }
    }, {
      key: 'has',
      value: function has(property) {

        return Object.prototype.hasOwnProperty.call(this.properties, property);
      }
    }, {
      key: 'get',
      value: function get(property) {

        return this.properties[property];
      }
    }, {
      key: 'toString',
      value: function toString() {

        return [this.constructor.name, ' (', this.entity, ' ', JSON.stringify(this.properties), ')'].join('');
      }
    }, {
      key: 'valueOf',
      value: function valueOf() {

        return this.toString();
      }
    }, {
      key: 'toJSON',
      value: function toJSON() {

        return [this.entity, this.properties, this.__uniqid__];
      }
    }]);

    return Unit;
  })();

  return Unit;
})();