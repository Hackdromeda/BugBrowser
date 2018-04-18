const cheerio = require('cheerio');
const request = require('request');
const rp = require('request-promise');

rp({
  uri: `https://hackerone.com/jamieweb`,
  transform: function (body) {
  return cheerio.load(body);
  }
}).then(($) => {
  var images = [];
  $('meta[property="og:image"]').each(function(i, elem) {
      images.push($(this).attr('content'));
  });
  return images;
}).then((images) => {
  console.log(images[0])
});