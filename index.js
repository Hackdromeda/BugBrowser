const Alexa = require('alexa-sdk');
const http = require('http');
const cheerio = require('cheerio');
const rp = require('request-promise');
const fs = require('fs');

  /*
  function fetchVrt() {
    return rp({
      uri: `https://raw.githubusercontent.com/bugcrowd/vulnerability-rating-taxonomy/master/vulnerability-rating-taxonomy.json`,
      transform: function(body) {
        return JSON.parse(body);
      }
    })
  }

function getVrt() {
    return Promise.resolve(fetchVrt());
}

    getVrt().then(function(data) {
    //Use returned data
    });
*/

function fetchPrograms() {
    return rp({
      uri: `https://bugcrowd.com/programs/reward`,
      transform: function(body) {
        const $ = cheerio.load(body);
        var programs = [];
        $('h4.bc-panel__title').each(function(i, elem) {
          programs.push($(this).text());
        })
        return programs;
      }
    })
  }
  
  function getPrograms() {
    var programs = Promise.resolve(fetchPrograms());
    for (i = 0; i < programs.length; i++) {
      programs[i] = programs[i].replace(/\r?\n|\r/g, " ").trim();
    }
    return programs;
  }
  
    function fetchRewards() {
      return rp({
        uri: `https://bugcrowd.com/programs/reward`,
        transform: function (body) {
          const $ = cheerio.load(body);
          var rewards = [];
          $('span.bc-stat__title').each(function(i, elem) {
            rewards.push($(this).text());
          })
          return rewards;
        }
      })
    }
  
  function getRewards() {
    var rewards = Promise.resolve(fetchRewards());
    for (i = 0; i < rewards.length; i++) {
      rewards[i] = rewards[i].replace(/\r?\n|\r/g, " ").trim();
    }
    return rewards;
  }
  
  function writeProgramsAndRewards() {
    Promise.all([getPrograms(), getRewards()]).then(function(promises) {
      fs.writeFile("./programs.json", JSON.stringify(promises[0]), function(err) {
        if(err) {
            return console.log(err);
        }
      }); 
      fs.writeFile("./rewards.json", JSON.stringify(promises[1]), function(err) {
        if(err) {
            return console.log(err);
        }
      });
    }).catch(function(error) {
      console.log(error);
    });
  }
  
  function readPrograms() {
    return JSON.parse(fs.readFileSync('./programs.json').toString());
  }
  
  function readRewards() {
    return JSON.parse(fs.readFileSync('./rewards.json').toString());
  }


  writeProgramsAndRewards();
  
    
    var states = {
        SEARCHMODE: '_SEARCHMODE',
        TOPFIVE: '_TOPFIVE',
    };
    
    var appName = "Bug Browser";
    
    var newsKey = "54c1f13414d24544a837a4bdccbf5d21";
    
    var numberOfResults = 3;
    
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
            function readPrograms() {
                return JSON.parse(fs.readFileSync('./programs.json').toString());
              }
              
            function readRewards() {
                return JSON.parse(fs.readFileSync('./rewards.json').toString());
            }
            var programs = readPrograms();
            var rewards = readRewards();
            var cardTitle = "Top BugCrowd Programs";
            var output = "";
            var read = "";
            var retrieveError = "I was unable to retrieve any active programs.";
            var anyValues = programs;
            if (anyValues) {
                
                read = "Here are the top active programs at BugCrowd. ";
                output += "BugCrowd Programs: " + newline + newline;
                for (var counter = 0; counter < programs.length; counter++) {
                    output += "Number " + (counter + 1) + ": " + programs[counter] + newline + newline;
                    read += "Number " + (counter + 1) + ": " + programs[counter] + newline + newline;
                }
                read += moreInfoProgram;
                this.handler.state = states.TOPFIVE;
                this.emit(':askWithCard', read, read, cardTitle, output);
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
                this.emitWithState('getProgramsIntent');
        },
        'getMoreInfoIntent': function () {
            function readPrograms() {
                return JSON.parse(fs.readFileSync('./programs.json').toString());
              }
              
            function readRewards() {
                return JSON.parse(fs.readFileSync('./rewards.json').toString());
            }
            var programs = readPrograms();
            var rewards = readRewards();
            var slotValue = this.event.request.intent.slots.program.value;
            var index = parseInt(slotValue) - 1;
    
            var selectedProgram = programs[index];
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