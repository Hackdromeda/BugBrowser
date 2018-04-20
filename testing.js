const cheerio = require('cheerio');
const request = require('request');
const rp = require('request-promise');

var bugCrowdPage = 1;
var bugCrowdTotal = 0;

//function to get total pages.
rp({
    uri: `https://bugcrowd.com/programs/reward?page=3`,
    transform: function (body) {
      return cheerio.load(body);
    }
  }).then(($) => {
    var bugCrowdPagination = [];
    $('.bc-pagination__item').each(function(i, elem) {
        bugCrowdPagination.push($(this).find('a').attr('href'));
    });
    return bugCrowdPagination;
}).then((bugCrowdPagination) => {
    var bugCrowdTempMax = bugCrowdPagination[bugCrowdPagination.length - 1];
    if(bugCrowdTempMax != null){
        bugCrowdTempMax = parseInt(bugCrowdTempMax.replace(/[^0-9]/g, ''), 10);
    }
    if(bugCrowdTempMax != null && bugCrowdTempMax > 2){
        bugCrowdTotal = bugCrowdTempMax;
    }
    console.log(bugCrowdTotal)
});

console.log(25 * Math.round(215 / 25));