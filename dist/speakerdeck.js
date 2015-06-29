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

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _libExtractText = require('../lib/extract-text');

var _libExtractText2 = _interopRequireDefault(_libExtractText);

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
    value: function getUser(username, cb) {
      var url = '' + baseUrl + username;
      var $ = undefined;
      var user = {};
      _request2['default'].get(url, function (err, response, body) {
        if (response.statusCode !== 200) {
          var error = new Error(response.headers.status);
          return cb(error);
        }
        user.display_name = _libExtractText2['default'].text(body, '.sidebar h2');
        user.bio = _libExtractText2['default'].text(body, '.sidebar div.bio p');;
        user.starts = _libExtractText2['default'].number(body, '.sidebar ul.delimited');
        var talks = _libExtractText2['default'].elements(body, '.talks .public');
        user.talks = [];
        _lodash2['default'].forEach(talks, function (item) {
          var talk = {};
          talk.title = _libExtractText2['default'].text(item, 'h3.title a');
          talk.date = _libExtractText2['default'].date(item, 'p.date');
          talk.thumb = _libExtractText2['default'].attr(item, '.slide_preview img', 'src');
          talk.link = _libExtractText2['default'].link(item, '.slide_preview', baseUrl);

          user.talks.push(talk);
        });

        return cb(null, user);
      });
    }
  }, {
    key: 'getUserTalk',
    value: function getUserTalk(opts, cb) {
      var url = '' + baseUrl + opts.username + '/' + opts.talk;
      var $ = undefined;
      var talk = {};
      _request2['default'].get(url, function (err, response, body) {
        if (response.statusCode !== 200) {
          var error = new Error(response.headers.status);
          return cb(error);
        }
        talk.title = _libExtractText2['default'].text(body, '#talk-details header h1');
        talk.date = _libExtractText2['default'].date(body, '#talk-details header p mark', true);
        talk.category = _libExtractText2['default'].text(body, '#talk-details header p mark', 'last');
        talk.description = _libExtractText2['default'].text(body, '.description p');
        talk.stars = _libExtractText2['default'].number(body, '.stargazers');
        talk.views = _libExtractText2['default'].split(body, '.views span', 0);
        talk.link = url;
        return cb(null, talk);
      });
    }
  }, {
    key: 'getUserStars',
    value: function getUserStars(username, cb) {
      var url = '' + baseUrl + username + '/stars';
      var $ = undefined;
      var stars = [];
      _request2['default'].get(url, function (err, response, body) {
        var talks = _libExtractText2['default'].elements(body, '.talks .public');
        _lodash2['default'].forEach(talks, function (item) {
          var talk = {};
          talk.title = _libExtractText2['default'].text(item, 'h3.title a');
          talk.date = _libExtractText2['default'].date(item, 'p.date');
          talk.thumb = _libExtractText2['default'].attr(item, '.slide_preview img', 'src');
          talk.link = _libExtractText2['default'].link(item, '.slide_preview', baseUrl);
          talk.author = _libExtractText2['default'].text(item, 'p.date a');
          stars.push(talk);
        });
        return cb(null, stars);
      });
    }
  }, {
    key: 'getCategories',
    value: function getCategories(cb) {
      var $ = undefined;
      var categories = [];
      _request2['default'].get(baseUrl, function (err, response, body) {
        if (response.statusCode !== 200) {
          var error = new Error(response.headers.status);
          return cb(error);
        }
        var elements = _libExtractText2['default'].elements(body, '.sidebar ul li');
        _lodash2['default'].forEach(elements, function (element) {
          var category = {};
          category.name = _libExtractText2['default'].text(element, 'a');
          category.link = _libExtractText2['default'].link(element, 'a', baseUrl);

          categories.push(category);
        });

        return cb(null, categories);
      });
    }
  }, {
    key: 'search',
    value: function search(opts, cb) {
      var querystring = _qs2['default'].stringify(opts);
      var url = baseUrl + 'search?' + querystring;
      var $ = undefined;
      var results = [];
      var pages = 0;
      _request2['default'].get(url, function (err, response, body) {
        if (response.statusCode !== 200) {
          var error = new Error(response.headers.status);
          return cb(error);
        }
        var elements = _libExtractText2['default'].elements(body, '.talks .talk');
        pages = _libExtractText2['default'].page(body, '.page');
        _lodash2['default'].forEach(elements, function (el, i) {
          var result = {};
          result.title = _libExtractText2['default'].text(el, 'h3.title a');

          results.push(result);
        });

        return cb(null, { results: results, pages: pages });
      });
    }
  }]);

  return Speakerdeck;
})();

exports['default'] = Speakerdeck;
module.exports = exports['default'];
//# sourceMappingURL=speakerdeck.js.map