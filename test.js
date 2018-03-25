const rp = require('request-promise');
const cheerio = require('cheerio');

  function getPrograms() {
    return rp({
      uri: `https://bugcrowd.com/programs/reward`,
      transform: function (body) {
        return cheerio.load(body);
      }
    }).then(($) => {
      programs = [];
      $('.bc-panel__title').each(function(i, elem) {
        programs.push($(this).text().trim());
      });
      return programs;
    })
  }

  function getRewards() {
    return rp({
      uri: `https://bugcrowd.com/programs/reward`,
      transform: function (body) {
        return cheerio.load(body);
      }
    }).then(($) => {
      rewards = [];
      $('.bc-stat__title').each(function(i, elem) {
        rewards.push($(this).text().trim());
      });

      return rewards;
    })
  }

  function getVrt(output) {
    return rp({
      uri: `https://raw.githubusercontent.com/bugcrowd/vulnerability-rating-taxonomy/master/vulnerability-rating-taxonomy.json`,
      transform: function (body) {
        return JSON.parse(body);
      }
    }).then(($) => {
      console.log($);
      return output;
    })
  }

function main() {
  return Promise.resolve(getPrograms()).then(Promise.resolve(getRewards()));
}

main().then(function(result) {
  console.log(result);
});

var promisedPrograms = Promise.resolve(getPrograms());
var programs = promisedPrograms.then(function(value) {
  return value;
});

var promisedRewards = Promise.resolve(getRewards());
var rewards = promisedRewards.then(function(value) {
  return value;
});