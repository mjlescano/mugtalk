'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

module.exports = (function () {

  'use strict';

  var Node = require('./unit/node.js');
  var Edge = require('./unit/edge.js');

  var NodeCollection = require('./collection/node_collection.js');
  var EdgeCollection = require('./collection/edge_collection.js');

  var Path = require('./path.js');

  var fs = require('fs');
  var zlib = require('zlib');

  var Graph = (function () {
    function Graph() {
      _classCallCheck(this, Graph);

      this.__uniqval__ = Number.MAX_SAFE_INTEGER;
      this.__init__();
    }

    _createClass(Graph, [{
      key: '__init__',
      value: function __init__() {

        this._lookup = Object.create(null);

        this._nodes = [];
        this._edges = [];

        this._nodeCollections = Object.create(null);
        this._edgeCollections = Object.create(null);
      }
    }, {
      key: 'unit',
      value: function unit(uniqid) {
        return this._lookup[uniqid];
      }
    }, {
      key: 'nodeCount',
      value: function nodeCount() {
        return this._nodes.length;
      }
    }, {
      key: 'edgeCount',
      value: function edgeCount() {
        return this._edges.length;
      }
    }, {
      key: 'createNode',
      value: function createNode(entity, properties) {

        return this._createNode(entity, properties, (this.__uniqval__--).toString(16));
      }
    }, {
      key: '_createNode',
      value: function _createNode(entity, properties, uniqid) {

        return this._addNode(new Node(entity, properties, uniqid));
      }
    }, {
      key: '_addNode',
      value: function _addNode(node) {

        this._nodes.push(node);
        this._lookup[node.__uniqid__] = node;
        var nodeList = this.nodes(node.entity);
        return nodeList._add(node);
      }
    }, {
      key: 'createEdge',
      value: function createEdge(entity, properties) {

        return this._createEdge(entity, properties, (this.__uniqval__--).toString(16));
      }
    }, {
      key: '_createEdge',
      value: function _createEdge(entity, properties, uniqid) {

        return this._addEdge(new Edge(entity, properties, uniqid));
      }
    }, {
      key: '_addEdge',
      value: function _addEdge(edge) {

        this._edges.push(edge);
        this._lookup[edge.__uniqid__] = edge;
        var edgeList = this.edges(edge.entity);
        return edgeList._add(edge);
      }
    }, {
      key: 'nodes',
      value: function nodes(entity) {

        return this._nodeCollections[entity] || (this._nodeCollections[entity] = new NodeCollection(entity));
      }
    }, {
      key: 'edges',
      value: function edges(entity) {

        return this._edgeCollections[entity] || (this._edgeCollections[entity] = new EdgeCollection(entity));
      }
    }, {
      key: '_getPath',
      value: function _getPath(node, traced) {

        var path = traced[node.__uniqid__];

        while (path[0] instanceof Edge) {
          var edge = path[0];
          var _node = edge.oppositeNode(path[1]);
          path = traced[_node.__uniqid__].concat(path);
        }

        return path;
      }
    }, {
      key: 'closest',
      value: function closest(node, opts) {

        opts = opts || {};

        return this._search(node, opts.compare, opts.count, opts.direction, opts.minDepth, opts.maxDepth);
      }
    }, {
      key: 'trace',
      value: function trace(fromNode, toNode, direction) {

        var passCondition = function passCondition(node) {
          return node === toNode;
        };

        return this._search(fromNode, passCondition, 1, direction)[0] || new Path([]);
      }
    }, {
      key: '_search',
      value: function _search(node, passCondition, count, direction, minDepth, maxDepth) {

        passCondition = typeof passCondition === 'function' ? passCondition : function (node) {
          return true;
        };

        direction |= 0;
        count = Math.max(0, count | 0);
        minDepth = Math.max(0, minDepth | 0);
        maxDepth = Math.max(0, maxDepth | 0);

        var nodePath = Object.create(null);
        nodePath[node.__uniqid__] = [node];

        var depthMap = new Map();
        depthMap.set(0, [node]);

        var depthList = [0];

        var found = [];
        var getPath = this._getPath;

        function enqueue(node, depth) {
          depthMap.has(depth) ? depthMap.get(depth).push(node) : depthMap.set(depth, [node]);
          orderedSetInsert(depthList, depth);
        }

        function orderedSetInsert(arr, val) {

          var n = arr.length;
          var i = n >>> 1;

          while (n) {
            n >>>= 1;
            if (arr[i] === val) {
              return arr;
            } else if (arr[i] < val) {
              i += n;
            } else {
              i -= n;
            }
          }

          return arr.splice(i + (arr[i] < val), 0, val);
        }

        function readNode(node, curDepth) {

          var edges = direction === 0 ? node.edges : direction > 0 ? node.outputEdges : node.inputEdges;

          for (var i = 0, len = edges.length; i < len; i++) {

            var edge = edges[i];
            var depth = curDepth + edge.distance;

            if (maxDepth && depth > maxDepth) {
              continue;
            }

            var tnode = edges[i].oppositeNode(node);

            if (!nodePath[tnode.__uniqid__]) {

              nodePath[tnode.__uniqid__] = [edge, tnode];
              enqueue(tnode, depth);
            }
          }

          if (curDepth >= minDepth && passCondition(node)) {
            return new Path(getPath(node, nodePath));
          }

          return false;
        }

        while (depthList.length) {

          var curDepth = depthList.shift();
          var queue = depthMap.get(curDepth);

          while (queue.length) {

            var path = readNode(queue.shift(), curDepth);
            path && found.push(path);

            if (count && found.length >= count) {
              return found;
            }
          }
        }

        return found;
      }
    }, {
      key: 'toJSON',
      value: function toJSON() {

        var nodeCollections = this._nodeCollections;
        var nc = Object.keys(nodeCollections).map(function (entity) {
          return nodeCollections[entity].toJSON();
        });

        var edgeCollections = this._edgeCollections;
        var ec = Object.keys(edgeCollections).map(function (entity) {
          return edgeCollections[entity].toJSON();
        });

        var nodes = this._nodes.map(function (n) {
          return n.toJSON();
        });

        var edges = this._edges.map(function (e) {
          return e.toJSON();
        });

        return JSON.stringify({ nc: nc, ec: ec, n: nodes, e: edges });
      }
    }, {
      key: 'fromJSON',
      value: function fromJSON(json) {

        this.__init__();

        var data = JSON.parse(json);

        var nc = data.nc;
        var ec = data.ec;

        for (var i = 0, len = nc.length; i < len; i++) {
          var collection = nc[i];
          this.nodes(collection[0]).createIndices(collection[1]);
        }

        for (var i = 0, len = ec.length; i < len; i++) {
          var collection = ec[i];
          this.edges(collection[0]).createIndices(collection[1]);
        }

        var nodes = data.n;
        var edges = data.e;

        for (var i = 0, len = nodes.length; i < len; i++) {
          var n = nodes[i];
          this._createNode(n[0], n[1], n[2]);
          var uniqval = parseInt(n[2], 16);
          this.__uniqval__ = uniqval < this.__uniqval__ ? uniqval - 1 : this.__uniqval__;
        }

        for (var i = 0, len = edges.length; i < len; i++) {
          var e = edges[i];
          this._createEdge(e[0], e[1], e[2]).link(this._lookup[e[3]], this._lookup[e[4]], e[5]).setDistance(e[6]);
          var uniqval = parseInt(e[2], 16);
          this.__uniqval__ = uniqval < this.__uniqval__ ? uniqval - 1 : this.__uniqval__;
        }

        return this;
      }
    }, {
      key: 'save',
      value: function save(filename, callback) {

        var buffer = new Buffer(this.toJSON());
        callback = callback.bind(this);

        zlib.gzip(buffer, function (err, result) {

          if (err) {
            callback(err);
            return;
          }

          fs.writeFile(filename, result, callback);
        });

        return this;
      }
    }, {
      key: 'load',
      value: function load(filename, callback) {

        callback = callback.bind(this);
        var fromJSON = this.fromJSON.bind(this);

        fs.readFile(filename, function (err, buffer) {

          if (err) {
            callback(err);
            return;
          }

          zlib.gunzip(buffer, function (err, result) {

            if (err) {
              callback(err);
              return;
            }

            fromJSON(result.toString());
            callback();
          });
        });

        return this;
      }
    }]);

    return Graph;
  })();

  return Graph;
})();