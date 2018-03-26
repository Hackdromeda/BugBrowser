var Alexa = require('alexa-sdk');
var http = require('http');
var cheerio = require('cheerio');
var request = require('request');
var rp = require('request-promise');

var states = {
    SEARCHMODE: '_SEARCHMODE',
    TOPFIVE: '_TOPFIVE',
};

var appName = "BugBrowser";

var newsKey = "54c1f13414d24544a837a4bdccbf5d21";

var numberOfResults = 3;

var welcomeMessage = "Welcome to " + appName + ". You can ask me for a flash briefing on recent hacks and security vulnerabilities around the world, information about BugCrowd, active BugCrowd programs, and reports from your own BugCrowd program. What will it be?";

var welcomeReprompt = "You can ask me for a flash briefing on recent hacks and security vulnerabilities around the world, information about BugCrowd, active BugCrowd programs, reports from your own BugCrowd program, or ask for help. What will it be?";

var overview = "BugCrowd connects organizations to a global crowd of trusted security researchers. BugCrowd programs allow the developers to discover and resolve bugs before the general public is aware of them, preventing incidents of widespread abuse. What else would you like to know?";

var HelpMessage = "Here are some things you can say: Give me a flash briefing on hacks. Tell me about BugCrowd. Tell me some active BugCrowd programs. What would you like to do?";

var moreInformation = "See your Alexa app for more information."

var tryAgainMessage = "Please try again."

var moreInfoProgram = " You can tell me a program number for more information. For example open number one.";

var getMoreInfoRepromtMessage = "what vulnerability would you like to hear more about?";

var hearMoreMessage = "Would you like to hear about another top program in BugCrowd?";

var noProgramErrorMessage = "There is no program with this number.";

var getMoreInfoMessage = "OK, " + getMoreInfoRepromtMessage;

var goodbyeMessage = "OK, BugBrowser shutting down.";

var newsIntroMessage = "These are the " + numberOfResults + " most recent security vulnerability headlines, you can read more on your Alexa app. ";

var newline = "\n";

var output = "";

var alexa;

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
  return(value);
});

var promisedRewards = Promise.resolve(getRewards());
var rewards = promisedRewards.then(function(value) {
  return(value);
});

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
        var cardTitle = "Top BugCrowd Programs";
        var output = "";
        var retrieveError = "I was unable to retrieve any active programs";
        var anyValues = programs;
        if (anyValues) {
            
            for (var counter = 0; counter < programs.length; counter++) {
                output += "BugCrowd Program Number " + (counter + 1) + ": " + programs[counter] + newline + newline;
            }
            this.handler.state = states.TOPFIVE;
            this.emit(':askWithCard', output, moreInfoProgram, cardTitle, output);
        } else {
            this.emit(':tell', retrieveError);
        }
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

var topFiveHandlers = Alexa.CreateStateHandler(states.TOPFIVE, {
    'getOverview': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getOverview');
    },
    'AMAZON.HelpIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },
    'getProgramsIntent': function () {
        this.handler.state = states.SEARCHMODE;
        setTimeout(() => {
            this.emitWithState('getProgramsIntent');
        }, 6000);
    },
    'getMoreInfoIntent': function () {
        var slotValue = this.event.request.intent.slots.program.value;
        var index = parseInt(slotValue) - 1;

        var selectedProgram = rewards[index];
        if (selectedProgram) {

            output = programs[index] + " is offering a bounty of " + rewards[index+1] + "." + hearMoreMessage;
            var cardTitle = programs[index];
            var cardContent = programs[index] + " is offering a bounty of " + rewards[index+1] + ".";

            this.emit(':askWithCard', output, hearMoreMessage, cardTitle, cardContent);
        } else {
            this.emit(':tell', noProgramErrorMessage);
        }
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
    alexa.registerHandlers(newSessionHandlers, startSearchHandlers, topFiveHandlers);
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