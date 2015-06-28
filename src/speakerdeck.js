import { install } from 'source-map-support';install();
import request from 'request';
import cheerio from 'cheerio';

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
      $ = cheerio.load(body);
      user.display_name = $('.sidebar h2').text();
      user.bio = $('.sidebar div.bio p').text();
      user.starts = Number($('.sidebar ul.delimited').first().text().match(/\d+/)[0]);
      let talks = $('.talks .public');
      let talk = {};
      user.talks = [];
      for (var i = 0; i < talks.length; i++) {
        talk.title = $(talks[i]).find('h3.title a').text();
        talk.date = new Date($(talks[i]).find('p.date').text().trim().split('by')[0]);
        talk.thumb = $(talks[i]).find('.slide_preview img').attr('src');
        talk.link = `${baseUrl}${$(talks[i]).find('.slide_preview').attr('href')}`
        user.talks.push(talk);
      }
      return cb(null, user);
    });
  };
}
