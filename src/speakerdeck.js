import { install } from 'source-map-support';install();
import request from 'request';
import cheerio from 'cheerio';
import qs from 'qs';
import _ from 'lodash';

const baseUrl = 'https://speakerdeck.com/'
export default class Speakerdeck {
  // constructor() {
  //
  // }
  getUser(username, cb) {
    let url = `${baseUrl}${username}`;
    let $;
    let user = {};
    request.get(url, (err, response, body) => {
      if (response.statusCode !== 200) {
        let error = new Error(response.headers.status)
        return cb(error);
      }
      $ = cheerio.load(body);
      user.display_name = $('.sidebar h2').text();
      user.bio = $('.sidebar div.bio p').text();
      user.starts = Number($('.sidebar ul.delimited').first().text().match(/\d+/)[0]);
      let talks = $('.talks .public');
      user.talks = [];
      for (var i = 0; i < talks.length; i++) {
        let talk = {};
        talk.title = $(talks[i]).find('h3.title a').text();
        talk.date = new Date($(talks[i]).find('p.date').text().trim().split('by')[0]);
        talk.thumb = $(talks[i]).find('.slide_preview img').attr('src');
        talk.link = `${baseUrl}${$(talks[i]).find('.slide_preview').attr('href')}`
        user.talks.push(talk);
      }
      return cb(null, user);
    });
  };

  getUserTalk(opts, cb) {
    let url = `${baseUrl}${opts.username}/${opts.talk}`;
    let $;
    let talk = {};
    request.get(url, (err, response, body) => {
      if (response.statusCode !== 200) {
        let error = new Error(response.headers.status)
        return cb(error);
      }
      $ = cheerio.load(body);
      talk.title = $('#talk-details header h1').text();
      talk.date = new Date($('#talk-details header p mark').first().text());
      talk.category = $('#talk-details header p mark').last().text();
      talk.description = $('.description p').text();
      talk.stars = $('.stargazers').text().match(/\d+/)[0];
      talk.views = $('.views span').text().split(' ')[0];
      talk.link = url;
      return cb(null, talk)
    });
  }

  getUserStars(username, cb) {
    let url = `${baseUrl}${username}/stars`;
    let $;
    let stars = [];
    request.get(url, (err, response, body) => {
      $ = cheerio.load(body);
      let talks = $('.talks .public');
      for (var i = 0; i < talks.length; i++) {
        let talk = {};
        talk.title = $(talks[i]).find('h3.title a').text();
        talk.date = new Date($(talks[i]).find('p.date').text().trim().split('by')[0]);
        talk.thumb = $(talks[i]).find('.slide_preview img').attr('src');
        talk.link = `${baseUrl}${$(talks[i]).find('.slide_preview').attr('href')}`;
        talk.author = $(talks[i]).find('p.date a').text();
        stars.push(talk);
      }
      return cb(null, stars);
    });
  }

  getCategories(cb) {
    let $;
    let categories = [];
    request.get(baseUrl, (err, response, body) => {
      if (response.statusCode !== 200) {
        let error = new Error(response.headers.status)
        return cb(error);
      }
      $ = cheerio.load(body);
      let el = $('.sidebar ul li');
      for (var i = 0; i < el.length; i++) {
        let category = {};
        category.name = $(el[i]).find('a').text();
        category.link = `${baseUrl}${$(el[i]).find('a').attr('href')}`

        categories.push(category);
      }
      return cb(null, categories)
    });
  }

  search(opts, cb){
    let querystring = qs.stringify(opts);
    let url = `${baseUrl}search?${querystring}`;
    let $;
    let results = [];
    let pages = 0;
    request.get(url, (err, response, body) => {
      if (response.statusCode !== 200) {
        let error = new Error(response.headers.status)
        return cb(error);
      }
      $ = cheerio.load(body);
      let elements = $('.talks .talk');
      pages = $('.page').last().find('a').text();
      _.forEach(elements, (el, i) => {
        let result = {};
        result.title = $(el).find('h3.title a').text();

        results.push(result)
      });

      return cb(null, {results, pages: pages});
    });
  }
}
