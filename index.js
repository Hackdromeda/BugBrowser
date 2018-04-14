const Alexa = require('alexa-sdk');
const http = require('http');
const cheerio = require('cheerio');
const request = require('request');
const rp = require('request-promise');

var states = {
    SEARCHMODE: '_SEARCHMODE',
    MOREDETAILS: '_MOREDETAILS',
};

var appName = "Bug Browser";

var newsKey = "54c1f13414d24544a837a4bdccbf5d21";

var numberOfResults = 4;

var welcomeMessage = "Welcome to " + appName + ". You can ask me for a flash briefing on recent hacks and security vulnerabilities around the world, information about BugCrowd, and active BugCrowd programs. What will it be?";

var welcomeReprompt = "You can ask me for a flash briefing on recent hacks and security vulnerabilities around the world, information about BugCrowd, active BugCrowd programs, or ask for help. What will it be?";

var overview = "BugCrowd connects organizations to a global crowd of trusted security researchers. BugCrowd programs allow the developers to discover and resolve bugs before the general public is aware of them, preventing incidents of widespread abuse. What else would you like to know?";

var HelpMessage = "Here are some things you can say: Give me a flash briefing on hacks. Tell me about BugCrowd. Tell me some active BugCrowd programs. What would you like to do?";

var moreInformation = "See your Alexa app for more information."

var tryAgainMessage = "Please try again."

var moreInfoProgram = " You can tell me a program number for more information. For example open number one. What program would you like more information on?";

var getMoreInfoRepromtMessage = "what vulnerability would you like to hear more about?";

var hearMoreMessage = " Would you like to hear about another top program in BugCrowd? You can tell me a program number for more information. For example open number two.";

var noProgramErrorMessage = "There is no program with this number.";

var getMoreInfoMessage = "OK, " + getMoreInfoRepromtMessage;

var goodbyeMessage = "OK, BugBrowser shutting down.";

var newsIntroMessage = "These are the " + numberOfResults + " most recent security vulnerability headlines, you can read more on your Alexa app. ";

var newline = "\n";

var output = "";

var alexa;

var newSessionHandlers = {
    'LaunchRequest': function () {
        this.handler.state = states.SEARCHMODE;
        output = welcomeMessage;
        this.emit(':ask', output, welcomeReprompt);
    },
    'getOverview': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getOverview');
    },
    'getNewsIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getNewsIntent');
    },
    'getProgramsIntent': function () {
        this.handler.state = states.SEARCHMODE;
        setTimeout(() => {
            this.emitWithState('getProgramsIntent');
        }, 6000);
    },
    'getVRTIntent': function () {
        this.handler.state = states.SEARCHMODE;
        setTimeout(() => {
            this.emitWithState('getVRTIntent');
        }, 6000);
    },
    'AMAZON.YesIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.NoIntent': function () {
        output = HelpMessage;
        this.emit(':ask', HelpMessage, HelpMessage);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit(":tell", goodbyeMessage);
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    },
    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeReprompt);
    },
};

var startSearchHandlers = Alexa.CreateStateHandler(states.SEARCHMODE, {
    'getOverview': function () {
        output = overview;
        this.emit(':askWithCard', output, appName, overview);
    },
    'getProgramsIntent': function () {
            rp({
              uri: `https://bugcrowd.com/programs/reward`,
              transform: function (body) {
                return cheerio.load(body);
              }
            }).then(($) => {
              var programs = [];
              $('.bc-panel__title').each(function(i, elem) {
                programs.push($(this).text().trim());
              });
              return programs;
            }).then((programs) => {
                var cardTitle = "Top BugCrowd Programs";
                var output = "";
                var read = "";
                var retrieveError = "I was unable to retrieve any active programs.";
                if (programs.length > 0) {
                    
                    read = "Here are the top active programs at BugCrowd. ";
                    output += "BugCrowd Programs: " + newline + newline;
                    for (var counter = 0; counter < programs.length; counter++) {
                        output += "Number " + (counter + 1) + ": " + programs[counter] + newline + newline;
                        read += "Number " + (counter + 1) + ": " + programs[counter] + newline + newline;
                    }
                    read += moreInfoProgram;
                    this.handler.state = states.MOREDETAILS;
                    this.emit(':askWithCard', read, read, cardTitle, output);
                } else {
                    this.emit(':tell', retrieveError);
                }
            });
    },
    'getVRTIntent': function () {
        rp({
            uri: `https://raw.githubusercontent.com/bugcrowd/vulnerability-rating-taxonomy/master/vulnerability-rating-taxonomy.json`,
            transform: function (body) {
              return JSON.parse(body);
            }
          })
          .then((data) => {
            var vrts = [];
            data.content.forEach(function(element) {
                if (element.children) {
                    vrts.push(element);
                }
            });
            var randomSelection = Math.floor(Math.random () * (vrts.length ));
            var selectedVrt = vrts[randomSelection];
            return selectedVrt;
            })
            .then((selectedVrt) => {
                var cardTitle = "Vulnerability Rating Taxonomy (VRT)";
                var output = "";
                var read = "";
                var retrieveError = "I was unable to retrieve any vulnerability information.";
                if (selectedVrt) {
                    
                    read = "The VRT is intended to provide valuable information for bug bounty stakeholders. ";
                    output += "BugCrowd VRT: " + newline + newline;

                    output += (selectedVrt.name + " has the following subcategories and priorities: ");
                    selectedVrt.children.forEach(function(element) {
                        if (element.priority) {
                            output += (element.name + " has a priority of " + element.priority + ". ");
                        } else {
                            output += (element.name + " has no specified priority. ");
                        }
                    });
                    this.emit(':askWithCard', read, read, cardTitle, output); 
                }                           
                else {
                    this.emit(':tell', retrieveError);
                }
            });
    },
    'AMAZON.YesIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.NoIntent': function () {
        output = HelpMessage;
        this.emit(':ask', HelpMessage, HelpMessage);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.HelpIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },
    'getNewsIntent': function () {
        httpGet(appName, function (response) {

            // Parse the response into a JSON object ready to be formatted.
            var responseData = JSON.parse(response);
            var cardContent = "Data provided by New York Times\n\n";

            // Check if we have correct data, If not create an error speech out to try again.
            if (responseData == null) {
                output = "There was a problem with getting data please try again";
            }
            else {
                output = newsIntroMessage;

                // If we have data.
                for (var i = 0; i < responseData.response.docs.length; i++) {

                    if (i < numberOfResults) {
                        // Get the name and description JSON structure.
                        var headline = responseData.response.docs[i].headline.main;
                        var index = i + 1;

                        output += " Headline " + index + ": " + headline + ";";

                        cardContent += " Headline " + index + ".\n";
                        cardContent += headline + ".\n\n";
                    }
                }

                output += " See your Alexa app for more information.";
            }

            var cardTitle = appName + " News";

            alexa.emit(':tellWithCard', output, cardTitle, cardContent);
        });
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.CancelIntent': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit(":tell", goodbyeMessage);
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    },
    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeReprompt);
    }
});

var programHandlers = Alexa.CreateStateHandler(states.MOREDETAILS, {
    'getOverview': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getOverview');
    },
    'getNewsIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getNewsIntent');
    },
    'getProgramsIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getProgramsIntent');
    },
    'getVRTIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getVRTIntent');
    },
    'getMoreInfoIntent': function () {
        rp({
            uri: `https://bugcrowd.com/programs/reward`,
            transform: function (body) {
              return cheerio.load(body);
            }
          }).then(($) => {
            var programs = [];
            var rewards = [];
            var urls = [];
            $('.bc-panel__title').each(function(i, elem) {
                programs.push($(this).text().trim());
                urls.push($(this).find('a').attr('href'));
            });
            $('.bc-stat__title').each(function(i, elem) {
                rewards.push($(this).text().trim());
            });
            var map = new Map();
            map.set(0, programs);
            map.set(1, rewards);
            map.set(2, urls)
            return map;
          }).then((map) => {
            var programs = map.get(0);
            var rewards = map.get(1);
            var urls = map.get(2);
            var slotValue = this.event.request.intent.slots.program.value;
            var index = parseInt(slotValue) - 1;

                rp({
                    uri: `https://bugcrowd.com` + urls[index],
                    transform: function (body) {
                      return cheerio.load(body);
                    }
                  }).then(($) => {
                      var information = [];
                    $('.stat').each(function(i, elem) {
                      information.push($(this).text().trim().replace(/\s/g,' '));
                    });

                    if (information[0]) {
                        information[0] = information[0].replace(/ +(?= )/g,'') + ' to security researchers in total. ';
                        var numOfVrts = information[0];
                    }
                    else{
                        var numOfVrts = "";
                    }                       
                    if (information[1]) {
                        information[1] = information[1].replace('day  ', 'day.').replace('days  ', 'days.') + '. ';
                        var validationTime = 'Expect v' + information[1].substring(1, information[1].length);
                    }
                    else{
                        var validationTime = "";
                    }                    
                    if (information[2]) {
                        var payout = "This program has a " + information[2].substring(0);
                    }
                    else{
                        var payout = "No payment history is available";
                    }
                    var selectedProgram = programs[index];
                    if (selectedProgram) {
                        output = programs[index] + " is offering a bounty of " + rewards[index+1] + ". " + numOfVrts + validationTime + payout + ". Additional details are available at bugcrowd.com" + urls[index] + "." + hearMoreMessage;
                        var cardTitle = programs[index];
                        var cardContent = programs[index] + " is offering a bounty of " + rewards[index+1] + ". " + numOfVrts + validationTime + payout + ". Additional details are available at bugcrowd.com" + urls[index] + ".";
        
                        this.emit(':askWithCard', output, hearMoreMessage, cardTitle, cardContent);
                    }
                    else {
                        this.emit(':tell', noProgramErrorMessage);
                    }
                });
            
          });
    },
    'AMAZON.HelpIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.YesIntent': function () {
        output = getMoreInfoMessage;
        alexa.emit(':ask', output, getMoreInfoRepromtMessage);
    },
    'AMAZON.NoIntent': function () {
        output = goodbyeMessage;
        alexa.emit(':tell', output);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.CancelIntent': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit(":tell", goodbyeMessage);
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
    },
    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeReprompt);
    }
});

exports.handler = function (event, context, callback) {
    alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandlers, startSearchHandlers, programHandlers);
    alexa.execute();
};

// Create a web request and handle the response.
function httpGet(query, callback) {
  console.log("/n QUERY: "+query);

    var options = {
      //http://api.nytimes.com/svc/search/v2/articlesearch.json?q=hack&sort=newest&api-key=
        host: 'api.nytimes.com',
        path: '/svc/search/v2/articlesearch.json?q=' + 'hack' + '&sort=newest&api-key=' + newsKey,
        method: 'GET'
    };

    var req = http.request(options, (res) => {

        var body = '';

        res.on('data', (d) => {
            body += d;
        });

        res.on('end', function () {
            callback(body);
        });

    });
    req.end();

    req.on('error', (e) => {
        console.error(e);
    });
}

String.prototype.trunc =
      function (n) {
          return this.substr(0, n - 1) + (this.length > n ? '&hellip;' : '');
};