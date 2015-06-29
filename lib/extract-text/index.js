var cheerio = require('cheerio');

var extract = {};

extract.elements = function(el, str){
  var $ = cheerio.load(el);
  return $(str);
};

extract.text = function(el, str, last){
  var $ = cheerio.load(el);
  if (last) {
    return $(str).last().text();
  }
  return $(str).text();
};

extract.split = function(el, str, position){
  var $ = cheerio.load(el);
  return $(str).text().split(' ')[position];
};


extract.date = function(el, str, first) {
  var $ = cheerio.load(el);
  if (first) {
    new Date($(str).first().text());
  }
  return new Date($(str).text().trim().split('by')[0]);
};

extract.number = function(el, str) {
  var $ = cheerio.load(el);
  return Number($(str).first().text().match(/\d+/)[0])
};

extract.attr = function(el, str, attr) {
  var $ = cheerio.load(el);
  return $(str).attr('src');
};

extract.link = function(el, str, baseUrl) {
  var $ = cheerio.load(el);
  return baseUrl + $(str).attr('href');
};

extract.page = function(el, str) {
  var $ = cheerio.load(el);
  return $(str).last().find('a').text();
}


module.exports = extract;
