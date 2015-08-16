'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

module.exports = (function () {

  'use strict';

  var Unit = require('./unit.js');

  var Edge = (function (_Unit) {
    _inherits(Edge, _Unit);

    function Edge(entity, properties, uniqid) {
      _classCallCheck(this, Edge);

      _get(Object.getPrototypeOf(Edge.prototype), 'constructor', this).call(this, entity, properties, uniqid);

      this.inputNode = null;
      this.outputNode = null;
      this.duplex = false;

      this.distance = 1;
    }

    _createClass(Edge, [{
      key: '_linkTo',
      value: function _linkTo(node, direction) {

        if (direction <= 0) {
          node.inputEdges.push(this);
        }

        if (direction >= 0) {
          node.outputEdges.push(this);
        }

        node.edges.push(this);

        return true;
      }
    }, {
      key: 'link',
      value: function link(inputNode, outputNode, duplex) {

        this.unlink();

        this.inputNode = inputNode;
        this.outputNode = outputNode;
        this.duplex = !!duplex;

        if (duplex) {
          this._linkTo(inputNode, 0);
          this._linkTo(outputNode, 0);
          return this;
        }

        this._linkTo(inputNode, 1);
        this._linkTo(outputNode, -1);
        return this;
      }
    }, {
      key: 'setDistance',
      value: function setDistance(v) {
        this.distance = Math.abs(parseFloat(v) || 0);
        return this;
      }
    }, {
      key: 'setWeight',
      value: function setWeight(v) {
        this.distance = 1 / Math.abs(parseFloat(v) || 0);
        return this;
      }
    }, {
      key: 'oppositeNode',
      value: function oppositeNode(node) {

        if (this.inputNode === node) {
          return this.outputNode;
        } else if (this.outputNode === node) {
          return this.inputNode;
        }

        return;
      }
    }, {
      key: 'unlink',
      value: function unlink() {

        var pos = undefined;
        var inode = this.inputNode;
        var onode = this.outputNode;

        if (!(inode && onode)) {
          return;
        }

        (pos = inode.edges.indexOf(this)) > -1 && inode.edges.splice(pos, 1);
        (pos = onode.edges.indexOf(this)) > -1 && onode.edges.splice(pos, 1);
        (pos = inode.outputEdges.indexOf(this)) > -1 && inode.outputEdges.splice(pos, 1);
        (pos = onode.inputEdges.indexOf(this)) > -1 && onode.inputEdges.splice(pos, 1);

        if (this.duplex) {

          (pos = inode.inputEdges.indexOf(this)) > -1 && inode.inputEdges.splice(pos, 1);
          (pos = onode.outputEdges.indexOf(this)) > -1 && onode.outputEdges.splice(pos, 1);
        }

        this.inputNode = null;
        this.outputNode = null;

        this.duplex = false;

        return true;
      }
    }, {
      key: 'toJSON',
      value: function toJSON() {

        return _get(Object.getPrototypeOf(Edge.prototype), 'toJSON', this).call(this).concat([this.inputNode.__uniqid__, this.outputNode.__uniqid__, this.duplex | 0, this.distance]);
      }
    }]);

    return Edge;
  })(Unit);

  return Edge;
})();