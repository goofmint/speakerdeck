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
        var talk = {};
        user.talks = [];
        for (var i = 0; i < talks.length; i++) {
          talk.title = $(talks[i]).find('h3.title a').text();
          talk.date = new Date($(talks[i]).find('p.date').text().trim().split('by')[0]);
          talk.thumb = $(talks[i]).find('.slide_preview img').attr('src');
          talk.link = '' + baseUrl + $(talks[i]).find('.slide_preview').attr('href');
          user.talks.push(talk);
        }
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
    key: 'getCategories',
    value: function getCategories(cb) {
      var $ = undefined;
      var categories = [];
      var category = {};
      _request2['default'].get(baseUrl, function (err, response, body) {
        $ = _cheerio2['default'].load(body);
        var el = $('.sidebar ul li');
        for (var i = 0; i < el.length; i++) {
          category.name = $(el[i]).find('a').text();
          category.link = '' + baseUrl + $(el[i]).find('a').attr('href');

          categories.push(category);
        }
        return cb(null, categories);
      });
    }
  }]);

  return Speakerdeck;
})();

exports['default'] = Speakerdeck;
module.exports = exports['default'];
//# sourceMappingURL=speakerdeck.js.map