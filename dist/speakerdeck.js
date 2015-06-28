'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _sourceMapSupport = require('source-map-support');

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

(0, _sourceMapSupport.install)();

var baseUrl = 'https://speakerdeck.com/';

var Speakerdeck = (function () {
  function Speakerdeck() {
    _classCallCheck(this, Speakerdeck);
  }

  _createClass(Speakerdeck, [{
    key: 'getUser',

    // constructor() {
    //
    // }
    value: function getUser(username) {
      var url = '' + baseUrl + username;
      var $ = undefined;
      _request2['default'].get(url, function (err, response, body) {
        $ = _cheerio2['default'].load(body);
        console.log($('.sidebar h2').text());
      });
    }
  }]);

  return Speakerdeck;
})();

exports['default'] = Speakerdeck;
module.exports = exports['default'];
//# sourceMappingURL=speakerdeck.js.map