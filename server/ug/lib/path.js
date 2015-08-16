'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

module.exports = (function () {

  'use strict';

  var Path = (function () {
    function Path(array) {
      _classCallCheck(this, Path);

      this._raw = array.slice();
    }

    _createClass(Path, [{
      key: 'start',
      value: function start() {

        return this._raw[0];
      }
    }, {
      key: 'end',
      value: function end() {

        return this._raw[this._raw.length - 1];
      }
    }, {
      key: 'length',
      value: function length() {

        return this._raw.length >>> 1;
      }
    }, {
      key: 'distance',
      value: function distance() {

        return this._raw.filter(function (v, i) {
          return !!(i & 1);
        }).reduce(function (p, c) {
          return p + c.distance;
        }, 0);
      }
    }, {
      key: 'prettify',
      value: function prettify() {

        var arr = this._raw;

        return arr.map(function (v, i, arr) {

          var str = v.toString();

          if (i & 1) {

            if (v.duplex) {
              return ['<>', str, '<>'].join(' ');
            }

            var p = arr[i - 1];

            if (v.inputNode === p) {
              return ['>>', str, '>>'].join(' ');
            }

            return ['<<', str, '<<'].join(' ');
          }

          return str;
        }).join(' ');
      }
    }, {
      key: 'toString',
      value: function toString() {

        return this.prettify();
      }
    }]);

    return Path;
  })();

  return Path;
})();