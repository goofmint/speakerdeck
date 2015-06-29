import { install } from 'source-map-support';install();
import request from 'request';
import cheerio from 'cheerio';
import qs from 'qs';
import _ from 'lodash';
import extract from '../lib/extract-text'

const baseUrl = 'https://speakerdeck.com/';
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
      user.display_name = extract.text(body, '.sidebar h2');
      user.bio = extract.text(body, '.sidebar div.bio p');;
      user.starts =  extract.number(body, '.sidebar ul.delimited');
      let talks = extract.elements(body, '.talks .public');
      user.talks = [];
      _.forEach(talks, (item) => {
        let talk = {};
        talk.title = extract.text(item, 'h3.title a');
        talk.date = extract.date(item, 'p.date');
        talk.thumb = extract.attr(item, '.slide_preview img', 'src');
        talk.link = extract.link(item, '.slide_preview', baseUrl);

        user.talks.push(talk);
      });

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
      talk.title = extract.text(body, '#talk-details header h1');
      talk.date = extract.date(body, '#talk-details header p mark', true);
      talk.category = extract.text(body, '#talk-details header p mark', 'last');
      talk.description = extract.text(body, '.description p');
      talk.stars = extract.number(body, '.stargazers');
      talk.views = extract.split(body, '.views span', 0);
      talk.link = url;
      return cb(null, talk)
    });
  }

  getUserStars(username, cb) {
    let url = `${baseUrl}${username}/stars`;
    let $;
    let stars = [];
    request.get(url, (err, response, body) => {
      let talks = extract.elements(body, '.talks .public');
      _.forEach(talks, (item) => {
        let talk = {};
        talk.title = extract.text(item, 'h3.title a');
        talk.date = extract.date(item, 'p.date');
        talk.thumb = extract.attr(item, '.slide_preview img', 'src');
        talk.link = extract.link(item, '.slide_preview', baseUrl);
        talk.author = extract.text(item, 'p.date a');
        stars.push(talk);
      });
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
      let elements = extract.elements(body, '.sidebar ul li');
      _.forEach(elements, (element) => {
        let category = {};
        category.name = extract.text(element, 'a');
        category.link = extract.link(element, 'a', baseUrl);

        categories.push(category);
      });

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
      let elements = extract.elements(body, '.talks .talk');
      pages = extract.page(body, '.page');
      _.forEach(elements, (el, i) => {
        let result = {};
        result.title = extract.text(el, 'h3.title a');

        results.push(result)
      });

      return cb(null, {results, pages: pages});
    });
  }
}
