const rp = require('request-promise');
const cheerio = require('cheerio');
var names = [];
var rewards = [];

var bugcrowd = {
  getPrograms: function(output) {
    return rp({
      uri: `https://bugcrowd.com/programs/reward`,
      transform: function (body) {
        return cheerio.load(body);
      }
    }).then(($) => {
      output['programs'] = [];
      $('.bc-panel__title').each(function(i, elem) {
        output['programs'].push($(this).text().trim());
      });

      return output;
    })
  },
  getRewards: function(output) {
    return rp({
      uri: `https://bugcrowd.com/programs/reward`,
      transform: function (body) {
        return cheerio.load(body);
      }
    }).then(($) => {
      output['rewards'] = [];
      $('.bc-stat__title').each(function(i, elem) {
        output['rewards'].push($(this).text().trim());
      });

      return output;
    })
  },
  getVrt: function(output) {
    return rp({
      uri: `https://raw.githubusercontent.com/bugcrowd/vulnerability-rating-taxonomy/master/vulnerability-rating-taxonomy.json`,
      transform: function (body) {
        return JSON.parse(body);
      }
    }).then(($) => {
      console.log($);
      return output;
    })
  },
}

function main() {
  var output = {};
  return bugcrowd.getPrograms(output).then(bugcrowd.getRewards(output));
}

main().then(function(result) {
  console.log(result);
  bugcrowd.getPrograms(names);
  bugcrowd.getRewards(rewards);

  console.log(names);
  console.log(rewards);
});