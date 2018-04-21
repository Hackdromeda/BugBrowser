const Alexa = require('alexa-sdk');
const makePlainText = Alexa.utils.TextUtils.makePlainText;
const makeRichText = Alexa.utils.TextUtils.makeRichText;
const makeImage = Alexa.utils.ImageUtils.makeImage;
const cheerio = require('cheerio');
const request = require('request');
const rp = require('request-promise');
const Bluebird = require('bluebird');

var states = {
    SEARCHMODE: '_SEARCHMODE'
};

var appName = "Bug Browser";

var newsKey = "54c1f13414d24544a837a4bdccbf5d21";

var numberOfResults = 5;

var welcomeMessage = "Welcome to " + appName + ". You can ask me for a flash briefing on recent hacks and security vulnerabilities around the world, information about bug bounty platforms, the VRT, active HackerOne bounties, and active BugCrowd bounties. What will it be?";

var welcomeReprompt = "You can ask me for a flash briefing on recent hacks and security vulnerabilities around the world, information about bug bounty platforms, active HackerOne bounties, active BugCrowd programs, or ask for help. What will it be?";

var overview = "Bug bounty platforms such as BugCrowd and HackerOne connect organizations to a global crowd of trusted security researchers. Bug Bounty programs allow the developers to discover and resolve bugs before the general public is aware of them, preventing incidents of widespread abuse.";

var HelpMessage = "Here are some things you can say: Give me a flash briefing on hacks. Tell me what Bug Bounty Platforms are. Tell me about the VRT. Tell me some active BugCrowd programs. Tell me some active HackerOne bounties. What would you like to do?";

var moreInformation = "See your Alexa app for more information.";

var tryAgainMessage = "Please try again.";

var moreInfoProgram = " You can tell me a program number for more information. For example, open number one. What program would you like more information on?";

var getMoreInfoRepromptMessage = "what vulnerability would you like to hear more about?";

var hearMoreMessage = " Would you like to hear about another active bounty? You can tell me a program number for more information. For example, open number two.";

var noProgramErrorMessage = "There is no program with this number.";

var generalReprompt = " What else would you like to know?";

var getMoreInfoMessage = "OK, " + getMoreInfoRepromptMessage;

var videoError = "Playing videos is not supported on this device. ";

var getMoreInfoRepromptMessage = " If you want to hear another category, you can ask me about the VRT again. What would you like to do?";

var goodbyeMessage = "OK, Bug Browser shutting down.";

var newsIntroMessage = "These are the " + numberOfResults + " most recent security vulnerability headlines, you can read more on your Alexa app.";

var newsSources = "hacker-news,wired,the-verge,techcrunch";

var newsQueries = ["security hacks", "security vulnerability", "bug bounty", "security researcher", "cybersecurity"]

var bugCrowdPage = 1;

var bugCrowdTotal = 3;

var hackerOneMax = 25;

var hackerOneTotal = 100;

var output = "";

var alexa;

var newSessionHandlers = {
    'LaunchRequest': function () {
        this.handler.state = states.SEARCHMODE;
        this.attributes.lastAction = "LaunchRequest";
        output = welcomeMessage;
        this.attributes.lastSpeech = welcomeMessage;
        if (this.event.context.System.device.supportedInterfaces.Display) {
            var hintOptions = ["Tell me hacking news",
                               "Give me a flash briefing on hacks",
                               "Tell me some facts about BugCrowd",
                               "Introduce me to BugCrowd",
                               "What companies are looking for security researchers?",
                               "Tell me the top active programs",
                               "Tell me about the Vulnerability Rating Taxonomy",
                               "Tell me about the VRT",
                               "Introduce me to BugCrowd with a video",
                               "Play BugCrowd overview video",
                               "How do you find bounties?",
                               "Surprise me"]

            var hint = hintOptions[Math.floor(Math.random() * (hintOptions.length))];

            var content = {
                "title": "Bug Browser",
                "hint": hint,
                "bodyTemplateTitle": "Bug Browser",
                "speechText" : output,
                "speechTextReprompt" : welcomeReprompt,
                "templateToken": "launchRequestTemplate",
                "bodyTemplateContent": "Welcome to Bug Browser", 
                "cardContent": null,
                "backgroundImage": 'https://s3.amazonaws.com/bugbrowser/images/Circuit.png',
                "askOrTell" : ":ask",
                "sessionAttributes": {}
              };

            renderTemplate.call(this, content);
        } else {
            this.handler.state = states.SEARCHMODE;
            output = welcomeMessage;
            this.emit(':ask', output, welcomeReprompt);
        }
    },
    'getOverview': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getOverview');
    },
    'getOverviewVideo': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getOverviewVideo');
    },
    'getEasterEgg': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getEasterEgg');
    },
    'getTeachVideo': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getTeachVideo');
    },
    'getNewsIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getNewsIntent');
    },
    'getBugCrowdIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getBugCrowdIntent');
    },
    'getHackerOneIntent': function() {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getHackerOneIntent');
    },
    'getProgramsIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getProgramsIntent');
    },
    'getMoreInfoBugCrowdIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getMoreInfoBugCrowdIntent');
    },
    'getMoreInfoHackerOneIntent': function() {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getMoreInfoHackerOneIntent');
    },
    'getMoreInfo': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getMoreInfo');
    },
    'getVRTIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getVRTIntent');
    },
    'getHelpIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getHelpIntent');
    },
    'ElementSelected': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('ElementSelected');
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
        console.log("First Unhandled event" + this.event.request.token);
        output = HelpMessage;
        this.emit(':ask', output, welcomeReprompt);
    },
};

var startSearchHandlers = Alexa.CreateStateHandler(states.SEARCHMODE, {
    'getOverview': function () {
        var cardTitle = "What are Bug Bounties and Bug Bounty Platforms?";
        this.attributes.lastAction = "getOverview";
        const imageObj = {
            smallImageUrl:'https://s3.amazonaws.com/bugbrowser/images/BugBountyPlatforms.png',
            largeImageUrl: 'https://s3.amazonaws.com/bugbrowser/images/BugBountyPlatforms.png'
        };
        output = overview + " What else would you like to know?";
        this.attributes.lastSpeech = output;
        if (this.event.context.System.device.supportedInterfaces.Display) {
            output = overview + " If you would like to learn more about bug bounty platforms you can ask me to play the BugCrowd overview video or ask me to teach you how to use BugCrowd. What would you like me to do?"
            const builder = new Alexa.templateBuilders.BodyTemplate1Builder();
            const template = builder.setTitle(cardTitle)
                                    .setBackgroundImage(makeImage('https://s3.amazonaws.com/bugbrowser/images/BugCrowdBR.png'))
                                    .setTextContent(makePlainText(output))
                                    .build();
            this.response.speak(output).renderTemplate(template).cardRenderer(cardTitle, overview, imageObj).listen(HelpMessage);
            this.emit(':responseReady');
        } else {
            this.emit(':askWithCard', output, output, cardTitle, overview, imageObj);
        }
    },
    'getOverviewVideo': function () {
        output = overview;
        this.attributes.lastAction = "getOverviewVideo";
        if (this.event.context.System.device.supportedInterfaces.Display) {
            const videoSource = 'https://s3.amazonaws.com/bugbrowser/video/Overview.mp4';
            const metadata = {
                'title': 'BugCrowd Overview',
                'subtitle': 'Crowdsourced Cybersecurity'
            };
            this.response.playVideo(videoSource, metadata);
            this.emit(':responseReady');
        } else {
            this.emit(':ask', videoError + overview + generalReprompt, appName, overview);
        }
    },
    'getEasterEgg': function () {
        output = "This Easter Egg is a video that can only be played on the Echo Show or Echo Spot. What else would you like to do?";
        this.attributes.lastAction = "getEasterEgg";
        if (this.event.context.System.device.supportedInterfaces.Display) {
            const videoSource = 'https://s3.amazonaws.com/bugbrowser/video/Bugcrowd+Intro.mp4';
            const metadata = {
                'title': 'BugCrowd',
                'subtitle': 'Crowdsourced Cybersecurity'
            };
            this.response.playVideo(videoSource, metadata);
            this.emit(':responseReady');
        } else {
            this.emit(':ask', output, appName, output);
        }
    },
    'getTeachVideo': function () {
        this.attributes.lastAction = "getTeachVideo";
        if (this.event.context.System.device.supportedInterfaces.Display) {
            const videoSource = 'https://s3.amazonaws.com/bugbrowser/video/Learn+Bugcrowd+in+10+Minutes.mp4';
            const metadata = {
                'title': 'How to use BugCrowd',
                'subtitle': 'Crowdsourced Cybersecurity'
            };
            this.response.playVideo(videoSource, metadata);
            this.emit(':responseReady');
        } else {
            this.emit(':ask', videoError + HelpMessage, appName, output + HelpMessage);
        }
    },
    'getBugCrowdIntent': function () {
        this.attributes.lastAction = "getBugCrowdIntent";
            rp({
              uri: `https://bugcrowd.com/programs/reward?page=` + bugCrowdPage,
              transform: function (body) {
                return cheerio.load(body);
              }
            }).then(($) => {
              var programs = [];
              var images = [];
              var bugCrowdPagination = [];
              $('.bc-pagination__item').each(function(i, elem) {
                  bugCrowdPagination.push($(this).find('a').attr('href'));
              });
              $('.bc-panel__title').each(function(i, elem) {
                programs.push($(this).text().trim());
              });
              $('.bc-program-card__header').each(function(i, elem) {
                images.push($(this).find('img').attr('src'));
            });
            var map = new Map();
            map.set(0, programs);
            map.set(1, images)
            map.set(2, bugCrowdPagination)
            return map;
          }).then((map) => {
                var programs = map.get(0);
                var images = map.get(1);
                var bugCrowdPagination = map.get(2);
                var bugCrowdTempMax = bugCrowdPagination[bugCrowdPagination.length - 1];
                if(bugCrowdTempMax != null){
                    bugCrowdTempMax = parseInt(bugCrowdTempMax.replace(/[^0-9]/g, ''), 10);
                }
                if(bugCrowdTempMax != null && bugCrowdTempMax > 2){
                    bugCrowdTotal = bugCrowdTempMax;
                }
                var cardTitle = "BugCrowd Programs";
                var output = "";
                var read = "";
                var retrieveError = "I was unable to retrieve any active programs. Please try again later.";
                if (programs.length > 0) {
                    
                    read = "Here are the active programs at BugCrowd from page " + bugCrowdPage + " of " + bugCrowdTotal + ":";
                    output += "BugCrowd Programs: \n\n";
                    for (var counter = 0; counter < programs.length; counter++) {
                        output += (counter + 1) + ". " + programs[counter] + "\n\n";
                        read += "Number " + (counter + 1) + ": " + programs[counter] + "\n\n";
                    }
                    read += moreInfoProgram;
                    this.attributes.lastSpeech = read;
                if (this.event.context.System.device.supportedInterfaces.Display) {
                    const listItemBuilder = new Alexa.templateBuilders.ListItemBuilder();
                    const listTemplateBuilder = new Alexa.templateBuilders.ListTemplate2Builder();
                    for (i = 0; i < programs.length; i++) {
                        listItemBuilder.addItem(makeImage(images[i], 400, 400), 'programToken' + i, makePlainText(programs[i]))
                    }
                    const listItems = listItemBuilder.build();
                    const listTemplate = listTemplateBuilder.setToken('listToken')
    										.setTitle(cardTitle)
                                            .setListItems(listItems)
                                            .setBackgroundImage(makeImage('https://s3.amazonaws.com/bugbrowser/images/Search.jpg'))
                                            .build();
                    this.response.speak(read).renderTemplate(listTemplate).cardRenderer(cardTitle, output, null).listen(moreInfoProgram);
                    this.emit(':responseReady');
                } else {
                    this.emit(':askWithCard', read, read, cardTitle, output);
                }

            } else {
                this.emit(':tell', retrieveError);
            }
        });
    },
    'getHackerOneIntent': function() {
        this.attributes.lastAction = "getHackerOneIntent";
        rp({
            uri: `http://bugbrowser.s3-accelerate.amazonaws.com/data/response.json`,
            transform: function (body) {
              return JSON.parse(body);
            }
          }).then((data) => {
            var hackerOnePrograms = [];
            hackerOneTotal = parseInt(data.total); // Subtract 1 for index limit

            for (var i = 0; i < data.results.length; i++) {
                hackerOnePrograms.push(data.results[i]);
            }

          return hackerOnePrograms;

        }).then((hackerOnePrograms) => {
              var cardTitle = "HackerOne Programs";
              var output = "";
              var read = "";
              var retrieveError = "I was unable to retrieve any active programs. Please try again later.";
              if (hackerOnePrograms.length > 0) {
                  
                  read = "Here are the active programs from HackerOne: ";
                  output += "HackerOne Programs: \n\n";
                  for (var counter = hackerOneMax - 25; counter < (hackerOnePrograms.length <= hackerOneMax ? hackerOnePrograms.length: hackerOneMax); counter++) {
                      output += (counter + 1 - hackerOneMax + 25) + ". " + hackerOnePrograms[counter].name + "\n\n";
                      read += "Number " + (counter + 1 - hackerOneMax + 25) + ": " + hackerOnePrograms[counter].name + "\n\n";
                  }
                  read += moreInfoProgram;
                  this.attributes.lastSpeech = read;
              if (this.event.context.System.device.supportedInterfaces.Display) {
                  const listItemBuilder = new Alexa.templateBuilders.ListItemBuilder();
                  const listTemplateBuilder = new Alexa.templateBuilders.ListTemplate2Builder();
                  for (var i = hackerOneMax - 25; i < (hackerOnePrograms.length <= hackerOneMax ? hackerOnePrograms.length: hackerOneMax); i++) {
                      listItemBuilder.addItem(makeImage(hackerOnePrograms[i].profile_picture, 400, 400), 'hackerOneProgramToken' + i, makePlainText(hackerOnePrograms[i].name))
                  }
                  const listItems = listItemBuilder.build();
                  const listTemplate = listTemplateBuilder.setToken('hackerOneListToken')
                                          .setTitle(cardTitle)
                                          .setListItems(listItems)
                                          .setBackgroundImage(makeImage('https://s3.amazonaws.com/bugbrowser/images/CircuitLock.jpg'))
                                          .build();
                  this.response.speak(read).renderTemplate(listTemplate).cardRenderer(cardTitle, output, null).listen(moreInfoProgram);
                  this.emit(':responseReady');
              } else {
                  this.emit(':askWithCard', read, read, cardTitle, output);
              }

          } else {
              this.emit(':tell', retrieveError);
          }
      });
    },
    'getMoreInfoBugCrowdIntent': function () {
        this.attributes.lastAction = "getMoreInfoBugCrowdIntent";
        rp({
            uri: `https://bugcrowd.com/programs/reward?page=` + bugCrowdPage,
            transform: function (body) {
              return cheerio.load(body);
            }
          }).then(($) => {
            var programs = [];
            var rewards = [];
            var urls = [];
            var images = [];
            var bugCrowdPagination = [];
            $('.bc-pagination__item').each(function(i, elem) {
                bugCrowdPagination.push($(this).find('a').attr('href'));
            });
            $('.bc-panel__title').each(function(i, elem) {
                programs.push($(this).text().trim());
                urls.push($(this).find('a').attr('href'));
            });
            $('.bc-stat__title').each(function(i, elem) {
                rewards.push($(this).text().trim());
            });
            $('.bc-program-card__header').each(function(i, elem) {
                images.push($(this).find('img').attr('src'));
            });
            var map = new Map();
            map.set(0, programs);
            map.set(1, rewards);
            map.set(2, urls)
            map.set(3, images)
            map.set(4, bugCrowdPagination)
            return map;
          }).then((map) => {
            var index;
            var programs = map.get(0);
            var rewards = map.get(1);
            var urls = map.get(2);
            var images = map.get(3);
            var bugCrowdPagination = map.get(4);
            var bugCrowdTempMax = bugCrowdPagination[bugCrowdPagination.length - 1];
            if(bugCrowdTempMax != null){
                bugCrowdTempMax = parseInt(bugCrowdTempMax.replace(/[^0-9]/g, ''), 10);
            }
            if(bugCrowdTempMax != null && bugCrowdTempMax > 2){
                bugCrowdTotal = bugCrowdTempMax;
            }
            if(this.event && this.event.request && this.event.request.intent && this.event.request.intent.slots && this.event.request.intent.slots.program.value && this.event.request.intent.slots.program.value != null && this.event.request.intent.slots.program.value != "?"){
                index = parseInt(this.event.request.intent.slots.program.value) - 1;
            }
            else{
                index = Math.floor(Math.random() * programs.length);
            }
            console.log('Index set to: ' + index + ' at page ' + bugCrowdPage + ' of ' + bugCrowdTotal);
            if (urls[index] != null) {
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
                        information[1] = information[1].replace('day  ', 'day. ').replace('days  ', 'days. ').replace('hour   ', 'hour. ').replace('hours   ', 'hours. ').replace('week   ', 'week. ').replace('weeks   ', 'weeks. ').replace('month   ', 'month. ').replace('months   ', 'months. ') + '. ';
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
                    if (selectedProgram != null && urls[index] != null) {
                        output = programs[index] + " is offering a bounty between " + rewards[index+1].replace(/–/g, 'and') + ". " + numOfVrts + validationTime + payout + ". Additional details are available at bugcrowd.com" + urls[index] + "." + hearMoreMessage;
                        var cardTitle = programs[index];
                        var cardContent = programs[index] + " is offering a bounty between " + rewards[index+1].replace(/–/g, 'and') + ". " + numOfVrts + validationTime + payout + ". Additional details are available at bugcrowd.com" + urls[index] + ".";
                        const imageObj = {
                            smallImageUrl: images[index],
                            largeImageUrl: images[index]
                        };
                        console.log('Images URL ' + images[index]);

                        if (this.event.context.System.device.supportedInterfaces.Display) {
                            const builder = new Alexa.templateBuilders.BodyTemplate2Builder();
                            const template = builder.setTitle(cardTitle)
                                                .setToken('getMoreInfoBugCrowdIntentToken')
                                                .setBackButtonBehavior('VISIBLE')
                                                .setBackgroundImage(makeImage('https://s3.amazonaws.com/bugbrowser/images/Circuit.png'))
                                                .setTextContent(makeRichText('<font size="1">' + cardContent + '</font>'))
                                                .setImage(makeImage(imageObj.largeImageUrl))
                                                .build();
                            this.response.speak(output).listen(hearMoreMessage.substring(1)).cardRenderer(cardTitle, cardContent, imageObj).renderTemplate(template);                   
                            this.emit(':responseReady');
                        } else {
                            this.emit(':askWithCard', output, hearMoreMessage.substring(1), cardTitle, cardContent, imageObj);
                        }
                    }
                    else {
                        this.emit(':ask', noProgramErrorMessage + moreInfoProgram, noProgramErrorMessage + moreInfoProgram);
                    }
                });
            }
            else {
                this.emit(':ask', noProgramErrorMessage + moreInfoProgram, noProgramErrorMessage + moreInfoProgram);
            }
            
          });
    },
    'getMoreInfoHackerOneIntent': function() {
        this.attributes.lastAction = "getMoreInfoHackerOneIntent";
        rp({
            uri: `http://bugbrowser.s3-accelerate.amazonaws.com/data/response.json`,
            transform: function (body) {
              return JSON.parse(body);
            }
          }).then((data) => {
            var hackerOnePrograms = [];
            hackerOneTotal = parseInt(data.total); // Subtract 1 for index limit

            for (var i = 0; i < data.results.length; i++) {
                hackerOnePrograms.push(data.results[i]);
            }

          return hackerOnePrograms;

        }).then((hackerOnePrograms) => {
            var index;
            if(this.event && this.event.request && this.event.request.intent && this.event.request.intent.slots && this.event.request.intent.slots.program.value && this.event.request.intent.slots.program.value != null && this.event.request.intent.slots.program.value != "?"){
                index = parseInt(this.event.request.intent.slots.program.value) - 1 + hackerOneMax - 25;
            }
            else{
                index = Math.floor(Math.random() * 25) + hackerOneMax - 25;
            }
            if (hackerOnePrograms[index].url != null) {
                rp({
                    uri: `https://hackerone.com` + hackerOnePrograms[index].url,
                    transform: function (body) {
                        return cheerio.load(body);
                }
                }).then(($) => {
                var xtralarge = [];
                $('meta[property="og:image"]').each(function(i, elem) {
                    xtralarge.push($(this).attr('content'));
                });
                return xtralarge;
                }).then((xtralarge) => {
                var images = xtralarge;
                var selectedProgram = sanitizeInput(hackerOnePrograms[index].name);
                if (selectedProgram != null && hackerOnePrograms[index].url != null) {
                    if (hackerOnePrograms[index].meta.minimum_bounty && hackerOnePrograms[index].meta.default_currency == 'usd') {
                        var bounty = 'This program has a minimum bounty of $' + hackerOnePrograms[index].meta.minimum_bounty + '.';
                    } else {
                        var bounty = '';
                    }
                    bounty = sanitizeInput(bounty);
                    var cardTitle = sanitizeInput(hackerOnePrograms[index].name);
                    var cardContent = sanitizeInput(hackerOnePrograms[index].stripped_policy.replace(/\n/g,' '));
                    var periodIndex = cardContent.substring(0, (cardContent.length >= 1600) ? 1600: cardContent.length).lastIndexOf('. ');
                    var exclamationIndex = cardContent.substring(0, (cardContent.length >= 1600) ? 1600: cardContent.length).lastIndexOf('!') + 1;
                    var questionIndex = cardContent.substring(0, (cardContent.length >= 1600) ? 1600: cardContent.length).lastIndexOf('?') + 1;
                    var splitIndex = 0;

                    if (periodIndex != -1) {
                        splitIndex = periodIndex;
                        console.log('Split Index set to periodIndex:' + splitIndex);
                    } else if (exclamationIndex != - 1) {
                        splitIndex = exclamationIndex;
                        console.log('Split Index set to exclamationIndex:' + splitIndex);
                    } else if (questionIndex != - 1) {
                        splitIndex = questionIndex;
                        console.log('Split Index set to questionIndex:' + splitIndex);
                    } else {
                        splitIndex = ((cardContent.substring(0, splitIndex + 1) <= 1600) ? (splitIndex): (cardContent.substring(0, 1600).lastIndexOf('.') + 1));
                        console.log('Split Index set equal to or below 1600:' + splitIndex);
                    }

                    console.log('Final Split Index: ' + splitIndex);
                    console.log('cardContent before substring');
                    cardContent = cardContent.substring(0, splitIndex + 1) + " That's not all! You can find more at " + "hackerone.com" + hackerOnePrograms[index].url + ".";
                    console.log('Final cardContent: ' + cardContent);
                    if(hackerOnePrograms[index].about == null || hackerOnePrograms[index].about == ""){
                        output = bounty + cardContent;
                    }
                    else{
                        output = bounty + " " + sanitizeInput(hackerOnePrograms[index].about.replace(/\n/g,' ')) + " That's not all! You can find more at " + "hackerone.com" + hackerOnePrograms[index].url + "."
                    }
                    var speak = output + " See your Alexa app for the specific program requirements for " + cardTitle + "." + hearMoreMessage; // speak includes question.
                    this.attributes.lastSpeech = speak;

                    const imageObj = {
                        smallImageUrl: hackerOnePrograms[index].profile_picture,
                        largeImageUrl: images[0] ? images[0]: hackerOnePrograms[index].profile_picture
                    };

                    if (this.event.context.System.device.supportedInterfaces.Display) {
                        const builder = new Alexa.templateBuilders.BodyTemplate2Builder();
                        const template = builder.setTitle(cardTitle)
                                            .setToken('getMoreInfoHackerOneIntentToken')
                                            .setBackButtonBehavior('VISIBLE')
                                            .setBackgroundImage(makeImage('https://s3.amazonaws.com/bugbrowser/images/Circuit.png'))
                                            .setTextContent(makeRichText('<font size="1">' + bounty + ' ' + (hackerOnePrograms[index].about ? sanitizeInput(hackerOnePrograms[index].about.replace(/\n/g,' ')): cardContent) + '</font>'))
                                            .setImage(makeImage(images[0] ? images[0]: imageObj.smallImageUrl))
                                            .build();
                        this.response.speak(speak).listen(hearMoreMessage.substring(1)).cardRenderer(cardTitle, cardContent, imageObj).renderTemplate(template);                   
                        this.emit(':responseReady');
                    } else {
                        this.emit(':askWithCard', speak, hearMoreMessage.substring(1), cardTitle, cardContent, imageObj);
                    }
                }
                else {
                    this.attributes.lastSpeech = noProgramErrorMessage + moreInfoProgram;
                    this.emit(':ask', noProgramErrorMessage + moreInfoProgram, noProgramErrorMessage + moreInfoProgram);
                }
            });
            }
            else {
                this.attributes.lastSpeech = noProgramErrorMessage + moreInfoProgram;
                this.emit(':ask', noProgramErrorMessage + moreInfoProgram, noProgramErrorMessage + moreInfoProgram);
            }
      });
    },
    'getProgramsIntent': function () {
        output = "Would you like to hear about the active BugCrowd programs? If so, please say tell me active BugCrowd bounties. If you would like to hear about active HackerOne bounties, please say tell me active HackerOne bounties. What would you like me to do?";
        this.emit(':ask', output, HelpMessage);
    },
    'getMoreInfo': function () {
        if(this.attributes.lastAction == "getBugCrowdIntent" || this.attributes.lastAction == "getMoreInfoBugCrowdIntent"){
            this.emit('getMoreInfoBugCrowdIntent');
        }
        else if(this.attributes.lastAction == "getHackerOneIntent" || this.attributes.lastAction == "getMoreInfoHackerOneIntent"){
            this.emit('getMoreInfoHackerOneIntent');
        }
        else{
            output = "Would you like to hear more about HackerOne programs or BugCrowd programs? If BugCrowd programs, say tell me more about BugCrowd program number five for example. If HackerOne programs, say tell me more about HackerOne program number three for example. What would you like me to do?";
            this.emit(':ask', output, HelpMessage);
        }
    },
    'getVRTIntent': function () {
        this.attributes.lastAction = "getVRTIntent";
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
                    element.children.forEach(function(child) {
                        if (child.children) {
                            vrts.push(element);
                        }
                    })
                }
            });

            var randomSelection = Math.floor(Math.random () * (vrts.length));
            var innerRandomSelection = Math.floor(Math.random () * (vrts[randomSelection].children.length));
            var selectedVrt = vrts[randomSelection];
            return selectedVrt;
            })
            .then((selectedVrt) => {
                var cardTitle = "Vulnerability Rating Taxonomy (VRT)";
                var output = "";
                var read = "";
                var retrieveError = "I was unable to retrieve any vulnerability information. Please try again later.";
                if (selectedVrt) {
                    
                    read = "The VRT, or Vulnerability Rating Taxonomy, outlines Bugcrowd’s baseline priority ratings for vulnerabilities. Most companies reward bugs classified between Priority 1 (P1) and Priority 4 (P4). Priority 5 (P5) is the lowest designation and is given to non-exploitable weaknesses. ";

                    output += (selectedVrt.name + ":" + "\n" + "\n");
                    read += ("One of the categories on the VRT is " + selectedVrt.name + " which has these subcategories: ");
                    selectedVrt.children.forEach(function(element) {
                        if (element.priority) {
                            output += ("\n" + "Subcategory: " + element.name + "\n" + " Priority: " + element.priority + "\n" + "\n");
                            read += (element.name + " has a priority of " + element.priority + ". ");
                        } else {
                            output += ("\n" + "Subcategory: " + element.name + "\n" + " Priority: unspecified" + "\n" + "\n");
                            read += (element.name + " has no specified priority. ");
                        }
                    });
                    read += getMoreInfoRepromptMessage;
                    this.attributes.lastSpeech = read;
                    const vrtObj = {
                        smallImageUrl: 'https://s3.amazonaws.com/bugbrowser/images/VRT-Logo.png',
                        largeImageUrl: 'https://assets.bugcrowdusercontent.com/packs/images/tracker/logo/vrt-logo-ba20b1de556f194607f690788f072798.svg'
                    };
                    if (this.event.context.System.device.supportedInterfaces.Display) {
                        const listItemBuilder = new Alexa.templateBuilders.ListItemBuilder();
                        const listTemplateBuilder = new Alexa.templateBuilders.ListTemplate1Builder();
                        selectedVrt.children.forEach(function(element) {
                            if (element.priority) {
                                listItemBuilder.addItem(null, 'listItemToken' + element.name, makeRichText("<font size='5'>" + element.name + "</font>"), makePlainText("Priority: " + element.priority));
                            } else {
                                listItemBuilder.addItem(null, 'listItemToken' + element.name, makeRichText("<font size='5'>" +element.name + "</font>"), makePlainText("Priority: varies"));
                            }
                        });
                        const listItems = listItemBuilder.build();
                        const listTemplate = listTemplateBuilder.setToken('listToken')
                                                .setTitle(selectedVrt.name)
                                                .setListItems(listItems)
                                                .setBackgroundImage(makeImage('https://s3.amazonaws.com/bugbrowser/images/Circuit.png'))
                                                .build();
                        this.response.speak(read).cardRenderer(cardTitle, output, vrtObj).renderTemplate(listTemplate).listen(HelpMessage);
                        this.emit(':responseReady');
                    } else {
                        this.emit(':askWithCard', read, HelpMessage, cardTitle, output, vrtObj); 
                    }
                }                           
                else {
                    this.attributes.lastSpeech = retrieveError;
                    this.emit(':tell', retrieveError);
                }
            });
    },
    "ElementSelected": function() {
        this.attributes.lastAction = "ElementSelected";
        var context = this;
        console.log (this.event.request.token);
        var newToken = this.event.request.token;
        if((this.event.request.token).substring(0, 12) == "programToken" || (this.event.request.token).substring(0, 17) == "eventprogramToken") {
            this.attributes.lastAction = "getMoreInfoBugCrowdIntent";
            var index = parseInt(newToken.replace(/[^0-9]/g, ''), 10); //leave only the digits
            console.log ('Program Token Detected');
            console.log('Index set to ' + index);
            rp({
                uri: `https://bugcrowd.com/programs/reward?page=` + bugCrowdPage,
                transform: function (body) {
                  return cheerio.load(body);
                }
              }).then(($) => {
                var programs = [];
                var rewards = [];
                var urls = [];
                var images = [];
                var bugCrowdPagination = [];
                $('.bc-pagination__item').each(function(i, elem) {
                    bugCrowdPagination.push($(this).find('a').attr('href'));
                });
                $('.bc-panel__title').each(function(i, elem) {
                    programs.push($(this).text().trim());
                    urls.push($(this).find('a').attr('href'));
                });
                $('.bc-stat__title').each(function(i, elem) {
                    rewards.push($(this).text().trim());
                });
                $('.bc-program-card__header').each(function(i, elem) {
                    images.push($(this).find('img').attr('src'));
                });
                var map = new Map();
                map.set(0, programs);
                map.set(1, rewards);
                map.set(2, urls);
                map.set(3, images);
                map.set(4, bugCrowdPagination)
                console.log('Map ready for EventSelected!');
                return map;
              }).then((map) => {
                var programs = map.get(0);
                var rewards = map.get(1);
                var urls = map.get(2);
                var images = map.get(3);
                var bugCrowdPagination = map.get(4);
                var bugCrowdTempMax = bugCrowdPagination[bugCrowdPagination.length - 1];
                if(bugCrowdTempMax != null){
                    bugCrowdTempMax = parseInt(bugCrowdTempMax.replace(/[^0-9]/g, ''), 10);
                }
                if(bugCrowdTempMax != null && bugCrowdTempMax > 2){
                    bugCrowdTotal = bugCrowdTempMax;
                }
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
                        if (selectedProgram != null && urls[index] != null) {
                            output = programs[index] + " is offering a bounty between " + rewards[index+1].replace(/–/g, 'and') + ". " + numOfVrts + validationTime + payout + ". Additional details are available at bugcrowd.com" + urls[index] + "." + hearMoreMessage;
                            var cardTitle = programs[index];
                            var cardContent = programs[index] + " is offering a bounty between " + rewards[index+1].replace(/–/g, 'and') + ". " + numOfVrts + validationTime + payout + ". Additional details are available at bugcrowd.com" + urls[index] + ".";
                            const imageObj = {
                                smallImageUrl: images[index],
                                largeImageUrl: images[index]
                            };
                                console.log('Ready to build new body template 2!');
                                const builder = new Alexa.templateBuilders.BodyTemplate2Builder();
                                const template = builder.setTitle(cardTitle)
                                                    .setToken('getMoreInfoBugCrowdIntentToken')
                                                    .setBackButtonBehavior('VISIBLE')
                                                    .setBackgroundImage(makeImage('https://s3.amazonaws.com/bugbrowser/images/Circuit.png'))
                                                    .setTextContent(makeRichText('<font size="5">' + cardContent + '</font>'))
                                                    .setImage(makeImage(imageObj.largeImageUrl))
                                                    .build();
                                this.response.speak(output).listen(hearMoreMessage.substring(1)).cardRenderer(cardTitle, cardContent, imageObj).renderTemplate(template);
                                console.log('Should be rendered!');                 
                                this.emit(':responseReady');
                        }
                        else {
                            this.attributes.lastSpeech = noProgramErrorMessage + moreInfoProgram;
                            this.emit(':ask', noProgramErrorMessage + moreInfoProgram, noProgramErrorMessage + moreInfoProgram);
                        }
                    });
                
              });
        }
        else if((this.event.request.token).substring(0, 21) == "hackerOneProgramToken" || (this.event.request.token).substring(0, 26) == "eventhackerOneProgramToken"){
            this.attributes.lastAction = "getMoreInfoHackerOneIntent";
            var index = parseInt(newToken.replace(/[^0-9]/g, ''), 10) + hackerOneMax - 25; //leave only the digits
            rp({
                uri: `http://bugbrowser.s3-accelerate.amazonaws.com/data/response.json`,
                transform: function (body) {
                  return JSON.parse(body);
                }
              }).then((data) => {
                var hackerOnePrograms = [];
                hackerOneTotal = parseInt(data.total); // Subtract 1 for index limit
    
                for (var i = 0; i < data.results.length; i++) {
                    hackerOnePrograms.push(data.results[i]);
                }
    
              return hackerOnePrograms;
    
            }).then((hackerOnePrograms) => {
                if (hackerOnePrograms[index].url != null) {
                    rp({
                        uri: `https://hackerone.com` + hackerOnePrograms[index].url,
                        transform: function (body) {
                            return cheerio.load(body);
                    }
                    }).then(($) => {
                    var xtralarge = [];
                    $('meta[property="og:image"]').each(function(i, elem) {
                        xtralarge.push($(this).attr('content'));
                    });
                    return xtralarge;
                    }).then((xtralarge) => {
                    var images = xtralarge;
                    var selectedProgram = sanitizeInput(hackerOnePrograms[index].name);
                    if (selectedProgram != null && hackerOnePrograms[index].url != null) {
                        if (hackerOnePrograms[index].meta.minimum_bounty && hackerOnePrograms[index].meta.default_currency == 'usd') {
                            var bounty = 'This program has a minimum bounty of $' + hackerOnePrograms[index].meta.minimum_bounty + '.';
                        } else {
                            var bounty = '';
                        }
                        bounty = sanitizeInput(bounty);
                        var cardTitle = sanitizeInput(hackerOnePrograms[index].name);
                        var cardContent = sanitizeInput(hackerOnePrograms[index].stripped_policy.replace(/\n/g,' '));
                        var periodIndex = cardContent.substring(0, (cardContent.length >= 1600) ? 1600: cardContent.length).lastIndexOf('. ');
                        var exclamationIndex = cardContent.substring(0, (cardContent.length >= 1600) ? 1600: cardContent.length).lastIndexOf('!') + 1;
                        var questionIndex = cardContent.substring(0, (cardContent.length >= 1600) ? 1600: cardContent.length).lastIndexOf('?') + 1;
                        var splitIndex = 0;

                        if (periodIndex != -1) {
                            splitIndex = periodIndex;
                            console.log('Split Index set to periodIndex:' + splitIndex);
                        } else if (exclamationIndex != - 1) {
                            splitIndex = exclamationIndex;
                            console.log('Split Index set to exclamationIndex:' + splitIndex);
                        } else if (questionIndex != - 1) {
                            splitIndex = questionIndex;
                            console.log('Split Index set to questionIndex:' + splitIndex);
                        } else {
                            splitIndex = ((cardContent.substring(0, splitIndex + 1) <= 1600) ? (splitIndex): (cardContent.substring(0, 1600).lastIndexOf('.') + 1));
                            console.log('Split Index set equal to or below 1600:' + splitIndex);
                        }

                        console.log('Final Split Index: ' + splitIndex);
                        console.log('cardContent before substring');
                        cardContent = cardContent.substring(0, splitIndex + 1) + " That's not all! You can find more at " + "hackerone.com" + hackerOnePrograms[index].url + ".";
                        console.log('Final cardContent: ' + cardContent);
                    if(hackerOnePrograms[index].about == null || hackerOnePrograms[index].about == ""){
                            output = bounty + cardContent;
                        }
                        else{
                            output = bounty + " " + sanitizeInput(hackerOnePrograms[index].about.replace(/\n/g,' ')) + " That's not all! You can find more at " + "hackerone.com" + hackerOnePrograms[index].url + "."
                        }
                        var speak = output + " See your Alexa app for the specific program requirements for " + cardTitle + "." + hearMoreMessage; // speak includes question.
                        this.attributes.lastSpeech = speak;
    
                        const imageObj = {
                            smallImageUrl: hackerOnePrograms[index].profile_picture,
                            largeImageUrl: images[0] ? images[0]: hackerOnePrograms[index].profile_picture
                        };
    
                        if (this.event.context.System.device.supportedInterfaces.Display) {
                            const builder = new Alexa.templateBuilders.BodyTemplate2Builder();
                            const template = builder.setTitle(cardTitle)
                                                .setToken('getMoreInfoHackerOneIntentToken')
                                                .setBackButtonBehavior('VISIBLE')
                                                .setBackgroundImage(makeImage('https://s3.amazonaws.com/bugbrowser/images/Circuit.png'))
                                                .setTextContent(makeRichText('<font size="1">' + bounty + ' ' + (hackerOnePrograms[index].about ? sanitizeInput(hackerOnePrograms[index].about.replace(/\n/g,' ')): cardContent) + '</font>'))
                                                .setImage(makeImage(images[0] ? images[0]: imageObj.smallImageUrl))
                                                .build();
                            this.response.speak(speak).listen(hearMoreMessage.substring(1)).cardRenderer(cardTitle, cardContent, imageObj).renderTemplate(template);                   
                            this.emit(':responseReady');
                        } else {
                            this.emit(':askWithCard', speak, hearMoreMessage.substring(1), cardTitle, cardContent, imageObj);
                        }
                    }
                    else {
                        this.attributes.lastSpeech = noProgramErrorMessage + moreInfoProgram;
                        this.emit(':ask', noProgramErrorMessage + moreInfoProgram, noProgramErrorMessage + moreInfoProgram);
                    }
                });
                }
                else {
                    this.attributes.lastSpeech = noProgramErrorMessage + moreInfoProgram;
                    this.emit(':ask', noProgramErrorMessage + moreInfoProgram, noProgramErrorMessage + moreInfoProgram);
                }
          });
        }
        else if((this.event.request.token).substring(0, 13) == "listItemToken"){
            var selectedToken = (this.event.request.token).substring(13);
            console.log ('List Token Detected');
            this.emit(':ask', "No additonal information is available about subcategory " + selectedToken + "." + HelpMessage);
        }
        /*else if((this.event.request.token).substring(0, 13) == "newsItemToken") {
            var selectedToken = parseInt((this.event.request.token).substring(13));
            var supportsDisplay = this.event.context.System.device.supportedInterfaces.Display;
        var content = '';
        var options1 = {
            uri: 'https://newsapi.org/v2/everything?sources=' + newsSources + '&apiKey=268d120f43684696b93f40d62a17dcd1&q=' + "security hacks",
            transform: function (body) {
            return JSON.parse(body);
            }
       }
       var options2 = {
            uri: 'https://newsapi.org/v2/everything?sources=' + newsSources + '&apiKey=268d120f43684696b93f40d62a17dcd1&q=' + "security vulnerability",
            transform: function (body) {
            return JSON.parse(body);
            }
        }
        var options3 = {
            uri: 'https://newsapi.org/v2/everything?sources=' + newsSources + '&apiKey=268d120f43684696b93f40d62a17dcd1&q=' + "bug bounty",
            transform: function (body) {
            return JSON.parse(body);
            }
       }
       var options4 = {
            uri: 'https://newsapi.org/v2/everything?sources=' + newsSources + '&apiKey=268d120f43684696b93f40d62a17dcd1&q=' + "security researcher",
            transform: function (body) {
            return JSON.parse(body);
            }
       }
       var options5 = {
            uri: 'https://newsapi.org/v2/everything?sources=' + newsSources + '&apiKey=268d120f43684696b93f40d62a17dcd1&q=' + "cybersecurity",
            transform: function (body) {
            return JSON.parse(body);
            }
        }

       
       var request1 = rp(options1);
       var request2 = rp(options2);
       var request3 = rp(options3);
       var request4 = rp(options4);
       var request5 = rp(options5);
       
       Bluebird.all([request1, request2, request3, request4, request5])
           .spread(function (response1, response2, response3, response4, response5) {
               var articles = [];
               articles = articles.concat(response1.articles, response2.articles, response3.articles, response4.articles, response5.articles);
               if (supportsDisplay) {
                const builder = new Alexa.templateBuilders.BodyTemplate2Builder();
                const template = builder.setTitle(articles[selectedToken].title)
                                    .setToken('getMoreInfoNewsToken')
                                    .setBackButtonBehavior('VISIBLE')
                                    .setBackgroundImage(makeImage('https://s3.amazonaws.com/bugbrowser/images/Circuit.png'))
                                    .setTextContent(makeRichText('<font size="1">' + content + '</font>'))
                                    .setImage(makeImage('https://s3.amazonaws.com/bugbrowser/images/Circuit.png'))
                                    .build();
                content += sanitizeInput(articles[selectedToken].title + '\n' + articles[selectedToken].description);
               }
        });
        }*/
    },
    'AMAZON.RepeatIntent': function () { 
        if(this.attributes.lastAction == "getOverviewVideo"){
            this.emit('getOverviewVideo');
        }
        else if(this.attributes.lastAction == "getEasterEgg"){
            this.emit('getEasterEgg');
        }
        else if(this.attributes.lastAction == "getTeachVideo"){
            this.emit('getTeachVideo');
        }
        else if(this.attributes.lastSpeech != null){
            this.emit('ask', this.attributes.lastSpeech, HelpMessage); 
        }
        else{
            console.log ("Repeat speech unavailable.")
            this.emit('ask', HelpMessage, HelpMessage)
        }
    } ,
    'AMAZON.NextIntent': function () {
        if(this.attributes.lastAction == "getBugCrowdIntent"){
            bugCrowdPage++;
            if(bugCrowdPage == bugCrowdTotal + 1){
                bugCrowdPage = 1;
            }
            this.emit('getBugCrowdIntent');
        }
        else if(this.attributes.lastAction == "getHackerOneIntent"){
            hackerOneMax += 25;
            if(hackerOneMax > hackerOneTotal){
                hackerOneMax = 25;
            }
            this.emit('getHackerOneIntent');
        }
        else{
            output = HelpMessage;
            this.emit(':ask', output, HelpMessage);
        }
    },
    'AMAZON.PreviousIntent': function () {
        if(this.attributes.lastAction == "getBugCrowdIntent"){
            bugCrowdPage--;
            if(bugCrowdPage == 0){
                bugCrowdPage = bugCrowdTotal;
            }
            this.emit('getBugCrowdIntent');
        }
        else if(this.attributes.lastAction == "getHackerOneIntent"){
            var limit = 25 * Math.round(hackerOneTotal / 25);
            if(limit > hackerOneTotal){
                limit -= 25;
            }
            hackerOneMax -= 25;
            if(hackerOneMax <= 0){
                hackerOneMax = limit;
            }
            this.emit('getHackerOneIntent');
        }
        else{
            output = HelpMessage;
            this.emit(':ask', output, HelpMessage);
        }
    },
    'AMAZON.YesIntent': function () {
        if(this.attributes.lastAction == "getBugCrowdIntent"){
            bugCrowdPage++;
            if(bugCrowdPage == bugCrowdTotal + 1){
                bugCrowdPage = 1;
            }
            this.emit('getBugCrowdIntent');
        }
        else if(this.attributes.lastAction == "getHackerOneIntent"){
            hackerOneMax += 25;
            if(hackerOneMax > hackerOneTotal){
                hackerOneMax = 25;
            }
            this.emit('getHackerOneIntent');
        }
        else if(this.attributes.lastAction == "getMoreInfoHackerOneIntent"){
            this.attributes.randomValue = true;
            this.emit('getHackerOneIntent');
        }
        else if(this.attributes.lastAction == "getMoreInfoBugCrowdIntent"){
            this.attributes.randomValue = true;
            if(bugCrowdPage == bugCrowdTotal + 1){ // requires all pages to be filled up so no +1
                bugCrowdPage = 1;
            }
            this.emit('getMoreInfoBugCrowdIntent');
        }
        else{
            output = HelpMessage;
            this.emit(':ask', output, HelpMessage);
        }
    },
    'AMAZON.NoIntent': function () {
        this.emit('AMAZON.CancelIntent');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.HelpIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },
    'getNewsIntent': function () {
        this.attributes.lastAction = "getNewsIntent";
        var supportsDisplay = this.event.context.System.device.supportedInterfaces.Display;
        var content = '';
        var context = this;
        var options1 = {
            uri: 'https://newsapi.org/v2/everything?sources=' + newsSources + '&apiKey=268d120f43684696b93f40d62a17dcd1&q=' + "security hacks",
            transform: function (body) {
            return JSON.parse(body);
            }
       }
       var options2 = {
            uri: 'https://newsapi.org/v2/everything?sources=' + newsSources + '&apiKey=268d120f43684696b93f40d62a17dcd1&q=' + "security vulnerability",
            transform: function (body) {
            return JSON.parse(body);
            }
        }
        var options3 = {
            uri: 'https://newsapi.org/v2/everything?sources=' + newsSources + '&apiKey=268d120f43684696b93f40d62a17dcd1&q=' + "bug bounty",
            transform: function (body) {
            return JSON.parse(body);
            }
       }
       var options4 = {
            uri: 'https://newsapi.org/v2/everything?sources=' + newsSources + '&apiKey=268d120f43684696b93f40d62a17dcd1&q=' + "security researcher",
            transform: function (body) {
            return JSON.parse(body);
            }
       }
       var options5 = {
            uri: 'https://newsapi.org/v2/everything?sources=' + newsSources + '&apiKey=268d120f43684696b93f40d62a17dcd1&q=' + "cybersecurity",
            transform: function (body) {
            return JSON.parse(body);
            }
        }

       
       var request1 = rp(options1);
       var request2 = rp(options2);
       var request3 = rp(options3);
       var request4 = rp(options4);
       var request5 = rp(options5);
       
       Bluebird.all([request1, request2, request3, request4, request5])
           .spread(function (response1, response2, response3, response4, response5) {
               var articles = [];
               articles = articles.concat(response1.articles, response2.articles, response3.articles, response4.articles, response5.articles);
               if (supportsDisplay) {
                const listItemBuilder = new Alexa.templateBuilders.ListItemBuilder();
                const listTemplateBuilder = new Alexa.templateBuilders.ListTemplate2Builder();
                for (var i = 0; i < articles.length && i < 15; i++) {
                        content += sanitizeInput('\nArticle ' + (i + 1) + ': ' + articles[i].title);
                        listItemBuilder.addItem(makeImage(articles[i].urlToImage ? articles[i].urlToImage : 'https://s3.amazonaws.com/bugbrowser/images/Newspaper.png'), 'newsItemToken' + i, makeRichText("<font size='1'>" + articles[i].title + "</font>"), makeRichText("<font size='1'>" + articles[i].source.name + "</font>"));
                        numberOfResults++;
                }
                const listItems = listItemBuilder.build();
                const listTemplate = listTemplateBuilder.setToken('getNewsIntentToken')
                                        .setTitle('Bug Browser News')
                                        .setListItems(listItems)
                                        .setBackgroundImage(makeImage('https://s3.amazonaws.com/bugbrowser/images/Circuit.png'))
                                        .build();

                context.response.speak(content).cardRenderer('Bug Browser News', 'Data provided by Newsapi: \n\n' + content, null).renderTemplate(listTemplate).listen(content + generalReprompt);
                context.emit(':responseReady');
            } else {
                context.emit(':askWithCard', content + generalReprompt, HelpMessage, 'Bug Browser News', 'Data provided by Newsapi.')
            }
        });
    },
    'getHelpIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.attributes.lastAction = "getHelpIntent";
        var helpMessages = [
            "Play Video",
            "Active BugCrowd Programs",
            "Active HackeOne Programs",
            "What is BugCrowd?",
            "What is HackerOne?",
            "Open program number 1",
            "Get the vulnerability taxonomy rating",
            "What is the VRT?"
        ]

        if (supportsDisplay) {
            var content = 'Here are some things you can ask Bug Browser:';
            const listItemBuilder = new Alexa.templateBuilders.ListItemBuilder();
            const listTemplateBuilder = new Alexa.templateBuilders.ListTemplate1Builder();
            for (var i = 0; i < helpMessages.length; i++) {
                content += '\n' + helpMessages[i];
                listItemBuilder.addItem(null, 'helpItemToken' + i, makeRichText("<font size='1'>" + helpMessages[i] + "</font>"));
            }

            const listItems = listItemBuilder.build();
            const listTemplate = listTemplateBuilder.setToken('getHelpToken')
                                    .setTitle('Help')
                                    .setListItems(listItems)
                                    .setBackgroundImage(makeImage('https://s3.amazonaws.com/bugbrowser/images/Circuit.png'))
                                    .build();

                this.response.speak(content).renderTemplate(listTemplate).listen(content + generalReprompt);
                this.emit(':responseReady');
        } else {
            this.emit(':ask', content + generalReprompt, HelpMessage);
        }
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
        console.log("Second Unhandled event" + this.event);
        output = HelpMessage;
        this.emit(':ask', output, welcomeReprompt);
    }
});

exports.handler = function (event, context, callback) {
    alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandlers, startSearchHandlers);
    alexa.execute();
};

String.prototype.trunc =
      function (n) {
          return this.substr(0, n - 1) + (this.length > n ? '&hellip;' : '');
};

function supportsDisplay() {
    var hasDisplay =
        this.event.context &&
        this.event.context.System &&
        this.event.context.System.device &&
        this.event.context.System.device.supportedInterfaces &&
        this.event.context.System.device.supportedInterfaces.Display

    return hasDisplay;
}

function isSimulator() {
    var isSimulator = !this.event.context; //Simulator does not send context
    return isSimulator;
}

function sanitizeInput(s) {
    s = s.replace('http://', '');
    s = s.replace('https://', '');
    s = s.replace(/&/g, 'and');
    s = s.replace(/\*/g, '\n\n *');
    s = s.replace(/[~#^_|<>\\]/gi, '');
    s = s.replace(' - ', ' to ');
    s = s.replace(/-+/g,'-'); //Removes consecutive dashes
    s = s.replace(/ +(?= )/g,''); //Removes double spacing

    return s;
}
  
function renderTemplate (content) {
    //https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/display-interface-reference#display-template-reference

     switch(content.templateToken) {
         case "launchRequestTemplate":
            // for reference, here's an example of the content object you'd
            // pass in for this template.
            //  var content = {
            //     "hasDisplaySpeechOutput" : "display "+speechOutput,
            //     "hasDisplayRepromptText" : randomFact,
            //     "simpleCardTitle" : this.t('SKILL_NAME'),
            //     "simpleCardContent" : randomFact,
            //     "bodyTemplateTitle" : this.t('GET_FACT_MESSAGE'),
            //     "bodyTemplateContent" : randomFact,
            //     "templateToken" : "factBodyTemplate",
            //     "sessionAttributes": {}
            //  };
            var response = {
                'version': '1.0',
                'response': {
                  'directives': [
                    {
                        "type": "Hint",
                        "hint": {
                            "type": "PlainText",
                            "text": content.hint
                        }
                    },
                    {
                      'type': 'Display.RenderTemplate',
                      'template': {
                        'type': 'BodyTemplate6',
                        'title': content.title,
                        'backgroundImage': {
                          'sources': [
                            {
                              'url': content.backgroundImage
                            }
                          ]
                        },
                        'token': content.templateToken,
                        'textContent': {
                          'primaryText': {
                            'type': 'RichText',
                            'text': '<font size="7">' + content.bodyTemplateContent + '</font>'
                          }
                        },
                        'backButton': 'HIDDEN'
                      }
                    }
                  ],
                  'outputSpeech': {
                    'type': 'SSML',
                    'ssml': '<speak> ' + content.speechText + ' </speak>'
                  },
                  'reprompt': {
                    'outputSpeech': {
                      'type': 'SSML',
                      'ssml': '<speak> ' + content.speechTextReprompt + ' </speak>'
                    }
                  },
                  'shouldEndSession': content.askOrTell==":tell"
                },
                'sessionAttributes': content.sessionAttributes
              };
             this.context.succeed(response);
             break;

             case "ProgramsTemplate":
              var response = {
                "_responseObject": {
                    "version": "1.0",
                    "response": {
                        "shouldEndSession": false,
                        "outputSpeech": {
                            "type": "SSML",
                            "ssml": "<speak> " + content.speechText + " </speak>"
                        },
                        "reprompt": {
                            "outputSpeech": {
                                "type": "SSML",
                                "ssml": "<speak> Which program would you like to view details about? </speak>"
                            }
                        },
                        "card": {
                            "type": "Standard",
                            "title": content.bodyTemplateTitle,
                            "image": {
                                "smallImageUrl": "https://s3.amazonaws.com/bugbrowser/images/Circuit.png",
                                "largeImageUrl": "https://s3.amazonaws.com/bugbrowser/images/Circuit.png"
                            },
                            "text": content.speechText
                        },
                        "directives": [
                            {
                                "type": "Hint",
                                "hint": {
                                    "type": "PlainText",
                                    "text": "Try asking open program number one"
                                }
                            },
                            {
                                "type": "Display.RenderTemplate",
                                "template": {
                                    "type": "ListTemplate1",
                                    "title": "ListTemplate1 Display Title",
                                    "token": "TOKEN",
                                    "listItems": content.listItems,
                                    "backgroundImage": {
                                        "sources": [
                                            {
                                                "url": content.backgroundImage
                                            }
                                        ]
                                    },
                                    "backButton": "HIDDEN"
                                }
                            }
                        ]
                    },
                    "sessionAttributes": {}
                }
            }  
              this.context.succeed(response);         
             break;
  
         default:
            this.response.speak(goodbyeMessage);
            this.emit(':responseReady');
     }
  
  }