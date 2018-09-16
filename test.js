const rp = require('request-promise');

var bug = "javascript"


var url = "https://www.googleapis.com/customsearch/v1/siterestrict?q=Javascript&cx=012346488699051983543%3Aqw_x-hv8u5i&key=AIzaSyDaA7El-res3C84plfg6uTemc1dxj5WnGU";

rp({
    uri: url,
    transform: function (body) {
        return JSON.parse(body);
    }
}).then((body) => {
    var id = '';
    var hostName = '';

    for (var i = 0; i < body.items.length; i++) {
        var link = body.items[i].link;
        console.log('Possible url ' + link);
        if (link != null && !link.includes("tagged") && !link.includes("tags")) {
            var possibleIdArray = link.match(/\/questions\/(\d+)\//);
            if (possibleIdArray) {
                id = possibleIdArray[1];
                hostName = extractHostname(link);
                hostName = hostName.substring(0, hostName.lastIndexOf('.'));
            }
            break;
        }
    }
    console.log(id);
});