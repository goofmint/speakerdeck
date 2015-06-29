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

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

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
        $ = _cheerio2['default'].load(body);
        user.display_name = $('.sidebar h2').text();
        user.bio = $('.sidebar div.bio p').text();
        user.starts = Number($('.sidebar ul.delimited').first().text().match(/\d+/)[0]);
        var talks = $('.talks .public');
        user.talks = [];
        _lodash2['default'].forEach(talks, function (item) {
          var talk = {};
          talk.title = $(item).find('h3.title a').text();
          talk.date = new Date($(item).find('p.date').text().trim().split('by')[0]);
          talk.thumb = $(item).find('.slide_preview img').attr('src');
          talk.link = '' + baseUrl + $(item).find('.slide_preview').attr('href');
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
        $ = _cheerio2['default'].load(body);
        talk.title = $('#talk-details header h1').text();
        talk.date = new Date($('#talk-details header p mark').first().text());
        talk.category = $('#talk-details header p mark').last().text();
        talk.description = $('.description p').text();
        talk.stars = $('.stargazers').text().match(/\d+/)[0];
        talk.views = $('.views span').text().split(' ')[0];
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
        $ = _cheerio2['default'].load(body);
        var talks = $('.talks .public');
        _lodash2['default'].forEach(talks, function (item) {
          var talk = {};
          talk.title = $(item).find('h3.title a').text();
          talk.date = new Date($(item).find('p.date').text().trim().split('by')[0]);
          talk.thumb = $(item).find('.slide_preview img').attr('src');
          talk.link = '' + baseUrl + $(item).find('.slide_preview').attr('href');
          talk.author = $(item).find('p.date a').text();
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
        $ = _cheerio2['default'].load(body);
        var el = $('.sidebar ul li');
        _lodash2['default'].forEach(elements, function (element) {
          var category = {};
          category.name = $(element).find('a').text();
          category.link = '' + baseUrl + $(element).find('a').attr('href');

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
        $ = _cheerio2['default'].load(body);
        var elements = $('.talks .talk');
        pages = $('.page').last().find('a').text();
        _lodash2['default'].forEach(elements, function (el, i) {
          var result = {};
          result.title = $(el).find('h3.title a').text();

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