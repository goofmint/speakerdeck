import { install } from 'source-map-support';install();
import request from 'request';
import cheerio from 'cheerio';

const baseUrl = 'https://speakerdeck.com/'
export default class Speakerdeck {
  // constructor() {
  //
  // }
  getUser(username) {
    let url = `${baseUrl}${username}`;
    let $;
    request.get(url, (err, response, body) => {
      $ = cheerio.load(body);
      console.log($('.sidebar h2').text());
    });
  }
}
