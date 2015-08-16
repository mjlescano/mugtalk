'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

module.exports = (function () {

  'use strict';

  var comparators = {
    'is': function is(a, b) {
      return a === b;
    },
    'not': function not(a, b) {
      return a !== b;
    },
    'gt': function gt(a, b) {
      return a > b;
    },
    'lt': function lt(a, b) {
      return a < b;
    },
    'gte': function gte(a, b) {
      return a >= b;
    },
    'lte': function lte(a, b) {
      return a <= b;
    },
    'ilike': function ilike(a, b) {
      return a.toLowerCase().indexOf(b.toLowerCase()) > -1;
    },
    'like': function like(a, b) {
      return a.indexOf(b) > -1;
    },
    'in': function _in(a, b) {
      return b.indexOf(a) > -1;
    },
    'not_in': function not_in(a, b) {
      return b.indexOf(a) === -1;
    }
  };

  var Query = (function () {
    function Query(units) {
      _classCallCheck(this, Query);

      this._units = units.slice();
    }

    _createClass(Query, [{
      key: '__filter',
      value: function __filter(filterArray, exclude) {

        exclude = !!exclude;

        for (var i = 0, _len = filterArray.length; i < _len; i++) {
          if (typeof filterArray[i] !== 'object' || filterArray[i] === null) {
            filterArray[i] = {};
          }
        }

        if (!filterArray.length) {
          filterArray = [{}];
        }

        var data = this._units.slice();
        var filters = undefined,
            keys = undefined,
            key = undefined,
            filterData = undefined,
            filter = undefined,
            filterType = undefined;
        var filterArrayLength = filterArray.length;

        for (var f = 0; f !== filterArrayLength; f++) {

          filters = filterArray[f];
          keys = Object.keys(filters);

          filterData = [];

          for (var i = 0, _len2 = keys.length; i < _len2; i++) {
            key = keys[i];
            filter = key.split('__');
            if (filter.length < 2) {
              filter.push('is');
            }
            filterType = filter.pop();

            if (!comparators[filterType]) {
              throw new Error('Filter type "' + filterType + '" not supported.');
            }
            filterData.push([comparators[filterType], filter, filters[key]]);
          }

          filterArray[f] = filterData;
        }

        var tmpFilter = undefined;
        var compareFn = undefined,
            val = undefined,
            datum = undefined;

        var filterLength = undefined;
        var len = data.length;

        var excludeCurrent = undefined;
        var n = 0;
        var tmp = Array(len);

        var flen = 0;
        var d = undefined;

        try {

          for (var i = 0; i !== len; i++) {

            var unit = data[i];
            datum = unit.properties;
            excludeCurrent = true;

            for (var j = 0; j !== filterArrayLength && excludeCurrent; j++) {

              excludeCurrent = false;
              filterData = filterArray[j];
              filterLength = filterData.length;

              for (var k = 0; k !== filterLength && !excludeCurrent; k++) {

                tmpFilter = filterData[k];
                compareFn = tmpFilter[0];
                d = datum;
                key = tmpFilter[1];
                for (var f = 0, _flen = key.length; f !== _flen; f++) {
                  d = d[key[f]];
                }
                val = tmpFilter[2];
                compareFn(d, val) === exclude && (excludeCurrent = true);
              }

              !excludeCurrent && (tmp[n++] = unit);
            }
          }
        } catch (e) {

          console.log(e);
          throw new Error('Nested field ' + key.join('__') + ' does not exist');
        }

        tmp = tmp.slice(0, n);

        return new Query(tmp);
      }
    }, {
      key: 'filter',
      value: function filter() {

        var args = [].slice.call(arguments);
        args = args[0] instanceof Array ? args[0] : args;

        return this.__filter(args, false);
      }
    }, {
      key: 'exclude',
      value: function exclude() {

        var args = [].slice.call(arguments);
        args = args[0] instanceof Array ? args[0] : args;

        return this.__filter(args, true);
      }
    }, {
      key: 'first',
      value: function first() {

        return this._units[0];
      }
    }, {
      key: 'last',
      value: function last() {

        var u = this._units;
        return u[u.length - 1];
      }
    }, {
      key: 'units',
      value: function units() {

        return this._units.slice();
      }
    }]);

    return Query;
  })();

  return Query;
})();