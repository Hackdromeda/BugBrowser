const Alexa = require('alexa-sdk');
const makePlainText = Alexa.utils.TextUtils.makePlainText;
const makeRichText = Alexa.utils.TextUtils.makeRichText;
const makeImage = Alexa.utils.ImageUtils.makeImage;
const cheerio = require('cheerio');
const request = require('request');
const rp = require('request-promise');

var states = {
    SEARCHMODE: '_SEARCHMODE'
};

var appName = "Bug Browser";

var newsKey = "54c1f13414d24544a837a4bdccbf5d21";

var numberOfResults = 4;

var welcomeMessage = "Welcome to " + appName + ". You can ask me for a flash briefing on recent hacks and security vulnerabilities around the world, information about bug bounty platforms, the VRT, active HackerOne bounties, and active BugCrowd bounties. What will it be?";

var welcomeReprompt = "You can ask me for a flash briefing on recent hacks and security vulnerabilities around the world, information about bug bounty platforms, active HackerOne bounties, active BugCrowd programs, or ask for help. What will it be?";

var overview = "Bug bounty platforms such as BugCrowd and HackerOne connect organizations to a global crowd of trusted security researchers. Bug Bounty programs allow the developers to discover and resolve bugs before the general public is aware of them, preventing incidents of widespread abuse.";

var HelpMessage = "Here are some things you can say: Give me a flash briefing on hacks. Tell me what Bug Bounty Platforms are. Tell me about the VRT. Tell me some active BugCrowd programs. Tell me some active HackerOne bounties. What would you like to do?";

var moreInformation = "See your Alexa app for more information.";

var tryAgainMessage = "Please try again.";

var moreInfoProgram = " You can tell me a program number for more information. For example open number one. What program would you like more information on?";

var getMoreInfoRepromptMessage = "what vulnerability would you like to hear more about?";

var hearMoreMessage = " Would you like to hear about another active bounty? You can tell me a program number for more information. For example open number two.";

var noProgramErrorMessage = "There is no program with this number.";

var generalReprompt = " What else would you like to know?";

var getMoreInfoMessage = "OK, " + getMoreInfoRepromptMessage;

var videoError = "Playing videos is not supported on this device. ";

var getMoreInfoRepromptMessage = " If you want to hear another category, you can ask me about the VRT again. What would you like to do?";

var goodbyeMessage = "OK, Bug Browser shutting down.";

var newsIntroMessage = "These are the " + numberOfResults + " most recent security vulnerability headlines, you can read more on your Alexa app.";

var output = "";

var alexa;

var newSessionHandlers = {
    'LaunchRequest': function () {
        this.handler.state = states.SEARCHMODE;
        output = welcomeMessage;
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
    'getProgramsIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getProgramsIntent');
    },
    'getHackerOneIntent': function() {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getHackerOneIntent');
    },
    'getMoreInfoIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getMoreInfoIntent');
    },
    'getMoreInfoHackerOneIntent': function() {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getMoreInfoHackerOneIntent');
    },
    'getVRTIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getVRTIntent');
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
        const imageObj = {
            smallImageUrl:'https://s3.amazonaws.com/bugbrowser/images/BugBountyPlatforms.png',
            largeImageUrl: 'https://s3.amazonaws.com/bugbrowser/images/BugBountyPlatforms.png'
        };
        output = overview + " What else would you like to know?";
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
    'getProgramsIntent': function () {
            rp({
              uri: `https://bugcrowd.com/programs/reward`,
              transform: function (body) {
                return cheerio.load(body);
              }
            }).then(($) => {
              var programs = [];
              var images = [];
              $('.bc-panel__title').each(function(i, elem) {
                programs.push($(this).text().trim());
              });
              $('.bc-program-card__header').each(function(i, elem) {
                images.push($(this).find('img').attr('src'));
            });
            var map = new Map();
            map.set(0, programs);
            map.set(1, images)
            return map;
          }).then((map) => {
                var programs = map.get(0);
                var images = map.get(1);
                var cardTitle = "BugCrowd Programs";
                var output = "";
                var read = "";
                var retrieveError = "I was unable to retrieve any active programs.";
                if (programs.length > 0) {
                    
                    read = "Here are the top active programs at BugCrowd. ";
                    output += "BugCrowd Programs: \n\n";
                    for (var counter = 0; counter < programs.length; counter++) {
                        output += "Number " + (counter + 1) + ": " + programs[counter] + "\n\n";
                        read += "Number " + (counter + 1) + ": " + programs[counter] + "\n\n";
                    }
                    read += moreInfoProgram;
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
                    this.response.speak(output).renderTemplate(listTemplate).cardRenderer(cardTitle, output, null).listen(moreInfoProgram);
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
        rp({
            uri: `https://hackerone.com/programs/search.json?query=type%3Ahackerone`,
            transform: function (body) {
              return JSON.parse(body);
            }
          }).then((data) => {
            var hackerOnePrograms = [];

            for (var i = 0; i < data.results.length; i++) {
                hackerOnePrograms.push(data.results[i]);
            }

          return hackerOnePrograms;

        }).then((hackerOnePrograms) => {
              var cardTitle = "HackerOne Programs";
              var output = "";
              var read = "";
              var retrieveError = "I was unable to retrieve any active programs.";
              if (hackerOnePrograms.length > 0) {
                  
                  read = "Here are the top active programs from HackerOne.";
                  output += "HackerOne Programs: \n\n";
                  for (var counter = 0; counter < (hackerOnePrograms.length <= 25 ? hackerOnePrograms.length: 25); counter++) {
                      output += "Number " + (counter + 1) + ": " + hackerOnePrograms[counter].name + "\n\n";
                      read += "Number " + (counter + 1) + ": " + hackerOnePrograms[counter].name + "\n\n";
                  }
                  read += moreInfoProgram;
              if (this.event.context.System.device.supportedInterfaces.Display) {
                  const listItemBuilder = new Alexa.templateBuilders.ListItemBuilder();
                  const listTemplateBuilder = new Alexa.templateBuilders.ListTemplate2Builder();
                  for (var i = 0; i < (hackerOnePrograms.length <= 25 ? hackerOnePrograms.length: 25); i++) {
                      listItemBuilder.addItem(makeImage(hackerOnePrograms[i].profile_picture, 400, 400), 'hackerOneProgramToken' + i, makePlainText(hackerOnePrograms[i].name))
                  }
                  const listItems = listItemBuilder.build();
                  const listTemplate = listTemplateBuilder.setToken('hackerOneListToken')
                                          .setTitle(cardTitle)
                                          .setListItems(listItems)
                                          .setBackgroundImage(makeImage('https://s3.amazonaws.com/bugbrowser/images/CircuitLock.jpg'))
                                          .build();
                  this.response.speak(output).renderTemplate(listTemplate).cardRenderer(cardTitle, output, null).listen(moreInfoProgram);
                  this.emit(':responseReady');
              } else {
                  this.emit(':askWithCard', read, read, cardTitle, output);
              }

          } else {
              this.emit(':tell', retrieveError);
          }
      });
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
            var images = [];
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
            return map;
          }).then((map) => {
            var programs = map.get(0);
            var rewards = map.get(1);
            var urls = map.get(2);
            var images = map.get(3);
            var index = parseInt(this.event.request.intent.slots.program.value) - 1;

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
                                                .setToken('getMoreInfoIntentToken')
                                                .setBackButtonBehavior('VISIBLE')
                                                .setBackgroundImage(makeImage('https://s3.amazonaws.com/bugbrowser/images/Circuit.png'))
                                                .setTextContent(makeRichText('<font size="5">' + cardContent + '</font>'))
                                                .setImage(makeImage(imageObj.largeImageUrl))
                                                .build();
                            this.response.speak(output).listen(hearMoreMessage).cardRenderer(cardTitle, cardContent, imageObj).renderTemplate(template);                   
                            this.emit(':responseReady');
                        } else {
                            this.emit(':askWithCard', output, hearMoreMessage, cardTitle, cardContent, imageObj);
                        }
                    }
                    else {
                        this.emit(':tell', noProgramErrorMessage);
                    }
                });
            
          });
    },
    'getMoreInfoHackerOneIntent': function() {
        rp({
            uri: `https://hackerone.com/programs/search.json?query=type%3Ahackerone`,
            transform: function (body) {
              return JSON.parse(body);
            }
          }).then((data) => {
            var hackerOnePrograms = [];

            for (var i = 0; i < data.results.length; i++) {
                hackerOnePrograms.push(data.results[i]);
            }

          return hackerOnePrograms;

        }).then((hackerOnePrograms) => {
            var index = parseInt(this.event.request.intent.slots.program.value) - 1;

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
                var selectedProgram = hackerOnePrograms[index].name;
                if (selectedProgram) {
                    if (hackerOnePrograms[index].meta.minimum_bounty && hackerOnePrograms[index].meta.default_currency == 'usd') {
                        var bounty = 'This program has a minimum bounty of $' + hackerOnePrograms[index].meta.minimum_bounty + '.';
                    } else {
                        var bounty = '';
                    }
                    var cardTitle = hackerOnePrograms[index].name;
                    var cardContent = hackerOnePrograms[index].about.replace(/\n/g,' ');
                    const imageObj = {
                        smallImageUrl: hackerOnePrograms[index].profile_picture,
                        largeImageUrl: hackerOnePrograms[index].profile_picture
                    };

                    if (this.event.context.System.device.supportedInterfaces.Display) {
                        const builder = new Alexa.templateBuilders.BodyTemplate2Builder();
                        const template = builder.setTitle(cardTitle)
                                            .setToken('getMoreInfoIntentToken')
                                            .setBackButtonBehavior('VISIBLE')
                                            .setBackgroundImage(makeImage('https://s3.amazonaws.com/bugbrowser/images/Circuit.png'))
                                            .setTextContent(makeRichText('<font size="5">' + bounty + cardContent + '</font>'))
                                            .setImage(makeImage(images[0] ? images[0]: imageObj.largeImageUrl))
                                            .build();
                        this.response.speak(bounty + hackerOnePrograms[index].about.replace(/\n/g,' ')).listen(hearMoreMessage).cardRenderer(cardTitle, cardContent, images[0]).renderTemplate(template);                   
                        this.emit(':responseReady');
                    } else {
                        this.emit(':askWithCard', bounty + hackerOnePrograms[index].about.replace(/\n/g,' '), hearMoreMessage, cardTitle, cardContent, images[0]);
                    }
                }
                else {
                    this.emit(':tell', noProgramErrorMessage);
                }
            });
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
                var retrieveError = "I was unable to retrieve any vulnerability information.";
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
                    this.emit(':tell', retrieveError);
                }
            });
    },
    "ElementSelected": function() {
        console.log (this.event.request.token);
        var newToken = this.event.request.token;
        if((this.event.request.token).substring(0, 12) == "programToken" || (this.event.request.token).substring(0, 17) == "eventprogramToken"){
        var index = parseInt(newToken.replace(/[^0-9]/g, ''), 10); //leave only the digits
            console.log ('Program Token Detected');
            console.log('Index set to ' + index);
            rp({
                uri: `https://bugcrowd.com/programs/reward`,
                transform: function (body) {
                  return cheerio.load(body);
                }
              }).then(($) => {
                var programs = [];
                var rewards = [];
                var urls = [];
                var images = [];
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
                console.log('Map ready for EventSelected!');
                return map;
              }).then((map) => {
                var programs = map.get(0);
                var rewards = map.get(1);
                var urls = map.get(2);
                var images = map.get(3);
    
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
                                                    .setToken('getMoreInfoIntentToken')
                                                    .setBackButtonBehavior('VISIBLE')
                                                    .setBackgroundImage(makeImage('https://s3.amazonaws.com/bugbrowser/images/Circuit.png'))
                                                    .setTextContent(makeRichText('<font size="5">' + cardContent + '</font>'))
                                                    .setImage(makeImage(imageObj.largeImageUrl))
                                                    .build();
                                this.response.speak(output).listen(hearMoreMessage).cardRenderer(cardTitle, cardContent, imageObj).renderTemplate(template);
                                console.log('Should be rendered!');                 
                                this.emit(':responseReady');
                        }
                        else {
                            this.emit(':tell', noProgramErrorMessage);
                        }
                    });
                
              });
        }
        else if((this.event.request.token).substring(0, 13) == "listItemToken"){
            var selectedToken = (this.event.request.token).substring(13);
            console.log ('List Token Detected');
            this.emit(':ask', "No additonal information is available about subcategory " + selectedToken + "." + HelpMessage);
        }
        else if((this.event.request.token).substring(0, 13) == "newsItemToken"){
            var selectedToken = parseInt((this.event.request.token).substring(13));
            console.log ('News Token Detected');
            this.emit(':ask', "See your Alexa app for more information about news headline number " + selectedToken + "." + HelpMessage);
        }
        else{
            console.log ('Unhandled Token Detected');
            this.emit('Unhandled');
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
        rp({
            uri: 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=hack&sort=newest&api-key=' + newsKey,
            transform: function (body) {
              return JSON.parse(body);
            }
          })
          .then((responseData) => {
            var articles = [];
            var cardContent = "Data provided by The New York Times" + "\n" + "\n";
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
                        articles[i] = {
                            name: headline
                        };

                        output += "Headline " + index + ": " + headline + "; ";

                        cardContent += "Headline " + index + ".\n";
                        cardContent += headline + ".\n\n";
                    }
                }

                output += " See your Alexa app for more information.";
            }

            var cardTitle = appName + " News";
            if (this.event.context.System.device.supportedInterfaces.Display) {
                const listItemBuilder = new Alexa.templateBuilders.ListItemBuilder();
                const listTemplateBuilder = new Alexa.templateBuilders.ListTemplate1Builder();
                for (i = 0; i < articles.length; i++) {
                    listItemBuilder.addItem(null, 'newsItemToken' + i, makeRichText("<font size='1'>" + articles[i].name + "</font>"));
                }
                const listItems = listItemBuilder.build();
                const listTemplate = listTemplateBuilder.setToken('listToken')
                                        .setTitle(cardTitle)
                                        .setListItems(listItems)
                                        .setBackgroundImage(makeImage('https://s3.amazonaws.com/bugbrowser/images/Encryption.jpg'))
                                        .build();
                this.response.speak(output + generalReprompt).cardRenderer(cardTitle, cardContent, null).renderTemplate(listTemplate).listen(output + generalReprompt);
                this.emit(':responseReady');
            }
            else{
                this.emit(':askWithCard', output + generalReprompt, HelpMessage, cardTitle, cardContent);
            }
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
    var isSimulator = !this.event.context; //simulator doesn't send context
    return isSimulator;
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