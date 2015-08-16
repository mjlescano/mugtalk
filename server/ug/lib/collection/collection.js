'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

module.exports = (function () {

  'use strict';

  var Query = require('../query.js');

  var Collection = (function () {
    function Collection(name) {
      _classCallCheck(this, Collection);

      this._name = name;
      this._units = [];
      this._indices = Object.create(null);
      this._indicesList = [];
    }

    _createClass(Collection, [{
      key: 'name',
      value: function name() {

        return this._name;
      }
    }, {
      key: 'indices',
      value: function indices() {

        return this._indicesList.slice();
      }
    }, {
      key: 'toJSON',
      value: function toJSON() {

        return [this._name, this._indicesList.slice()];
      }
    }, {
      key: 'createIndex',
      value: function createIndex(field) {

        return this.createIndices([field]);
      }
    }, {
      key: 'createIndices',
      value: function createIndices(fieldList) {

        this._indicesList = this._indicesList.concat(fieldList);
        var indices = this._indices;
        var units = this._units;

        for (var i = 0, len = fieldList.length; i < len; i++) {
          var index = fieldList[i];
          var lookup = indices[index] = Object.create(null);
          for (var u = 0, _len = units.length; u < _len; u++) {
            var unit = units[u];
            var id = unit.get(index);
            id && (lookup[id] = unit);
          }
        }

        return this;
      }
    }, {
      key: '_add',
      value: function _add(unit) {

        if (unit) {

          this._units.push(unit);

          var list = this._indicesList;
          var len = list.length;
          var indices = this._indices;

          for (var i = 0; i < len; i++) {
            var index = list[i];
            var lookup = indices[index];
            var id = unit.get(index);
            id && (lookup[id] = unit);
          }
        }

        return unit;
      }
    }, {
      key: '_remove',
      value: function _remove(unit) {

        if (unit) {

          var pos = this._units.indexOf(unit);
          pos > -1 && this._units.splice(pos, 1);

          var list = this._indicesList;
          var len = list.length;
          var indices = this._indices;

          for (var i = 0; i < len; i++) {
            var index = list[i];
            var lookup = indices[index];
            var id = unit.get(index);
            delete lookup[id];
          }
        }

        return unit;
      }
    }, {
      key: 'find',
      value: function find(index, id) {

        if (!id) {
          id = index;
          index = this._indicesList[0];
        }

        var lookup = this._indices[index];
        return lookup && lookup[id];
      }
    }, {
      key: 'destroy',
      value: function destroy(index, id) {

        if (!id) {
          id = index;
          index = this._indicesList[0];
        }

        var lookup = this._indices[index];
        return lookup && this._remove(lookup[id]);
      }
    }, {
      key: 'query',
      value: function query() {

        return new Query(this._units);
      }
    }]);

    return Collection;
  })();

  return Collection;
})();