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

var HelpMessage = "Here are some things you can say: Give me a flash briefing on hacks. Tell me what bug bounty platforms are. Tell me about the VRT. Tell me some active BugCrowd programs. Tell me some active HackerOne bounties. What would you like to do?";

var moreInformation = "See your Alexa app for more information.";

var tryAgainMessage = "Please try again.";

var moreInfoProgram = " You can tell me a program number for more information. For example, open number one. What program would you like more information on?";

var getMoreInfoRepromptMessage = "what vulnerability would you like to hear more about?";

var hearMoreMessage = " Would you like to hear about another active bounty? You can tell me a program number for more information. For example, open number two.";

var noProgramErrorMessage = "There is no program with this number.";

var generalReprompt = " What else would you like to know?";

var getMoreInfoMessage = "OK, " + getMoreInfoRepromptMessage;

var generalError = "I had trouble with the requested response. You just found a bug in Bug Browser! See the irony? Please submit a report on GitHub. If you're the developer, time to check CloudWatch! In the meantime, you can try another Bug Browser feature. What would you like me to do?";

var videoError = "Playing videos is not supported on this device. ";

var getMoreInfoRepromptMessage = " If you want to hear another category, you can ask me about the VRT again. What would you like to do?";

var goodbyeMessage = "OK, Bug Browser shutting down.";

var newsIntroMessage = "These are the " + numberOfResults + " most recent security vulnerability headlines, you can read more on your Alexa app.";

var newsSources = "hacker-news,wired,the-verge,techcrunch";

var newsQueries = ["security hacks", "security vulnerability", "bug bounty", "security researcher", "cybersecurity"]

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
                   "Surprise me"
                ];
var helpMessages = [
                    {
                        message:"Tell me active BugCrowd programs",
                        description:"Get bounties from BugCrowd",
                        intent:"getBugCrowdIntent"
                    },
                    {
                        message:"Tell me active HackerOne programs",
                        description:"Get bounties from HackerOne",
                        intent:"getHackerOneIntent"
                    },
                    {
                        message:"What is the vulnerability rating taxonomy",
                        description:"Learn about the BugCrowd VRT",
                        intent:"getVRTIntent"
                    },
                    {
                        message:"Tell me the latest news on vulnerabilities",
                        description:"Get news about security vulnerabilities",
                        intent:"getNewsIntent"
                    },
                    {
                        message:"Tell me the latest news on vulnerabilities",
                        description:"Get news about security vulnerabilities",
                        intent:"getNewsIntent"
                    },
                    {
                        message:"Tell me about bug bounty platforms",
                        description:"Learn about bug bounties and bug bounty platforms",
                        intent:"getOverview"
                    }
                ];

var lessons = [
                    {
                        name: "registerBugCrowd",
                        slots: [],
                        hints: [
                            "how do you register for BugCrowd",
                            "how do you use BugCrowd",
                            "Teach me how to use BugCrowd"
                        ],
                        description: "Learn the basics of using BugCrowd."
                    },
                    {
                        name: "getLessonOne",
                        slots: [],
                        hints: [
                            "what tools do I need to get started hacking",
                            "introduce me to hacking",
                            "play the introduction to hacking video"
                        ],
                        description: "Get the tools you need to start hacking."
                    },
                    {
                        name: "getLessonTwo",
                        slots: [],
                        hints: [
                            "teach me Same-Origin Policy",
                            "teach me MIME sniffing",
                            "teach me HTML parsing",
                            "teach me cookie security",
                            "teach me HTTP basics",
                            "teach me CSRF",
                            "teach me Cross-Site Request Forgery",
                            "play the lesson The Web In Depth",
                            "play the video The Web In Depth"
                        ],
                        description: "Learn about the web in depth including HTTP basics and MIME sniffing."
                    },
                    {
                        name: "getLessonThree",
                        slots: [],
                        hints: [
                            "teach me about authorization bypasses",
                            "teach me about forced browsing",
                            "teach me about XSS",
                            "teach me about types of XSS",
                            "teach me about Cross-Site Scripting",
                            "play the lesson XSS and Authorization",
                            "play the video XSS and Authorization"
                        ],
                        description: "Learn about Cross-Site Scripting and Authorization."
                    },
                    {
                        name: "getLessonFour",
                        slots: [],
                        hints: [
                            "teach me about command injection",
                            "teach me about directory traversal",
                            "teach me about SQL Injection",
                            "teach me about SQLi",
                            "play the lesson SQL Injection and Friends",
                            "play the video SQL Injection and Friends"
                        ],
                        description: "Learn about SQL Injection and Friends."
                    },
                    {
                        name: "getLessonFive",
                        slots: [],
                        hints: [
                            "play the lesson session fixation",
                            "play the video session fixation",
                            "teach me about session fixation"
                        ],
                        description: "Learn about Session Fixation."
                    },
                    {
                        name: "getLessonSix",
                        slots: [],
                        hints: [
                            "play the lesson clickjacking",
                            "play the video clickjacking",
                            "teach me about clickjacking"
                        ],
                        description: "Learn about Clickjacking."
                    },
                    {
                        name: "getLessonSeven",
                        slots: [],
                        hints: [
                            "play the lesson file inclusion bugs",
                            "teach me about file inclusion",
                            "teach me about RFI",
                            "teach me about LFI",
                            "teach me about remote file inclusion",
                            "teach me about local file inclusion",
                            "play the video file inclusion bugs"
                        ],
                        description: "Learn about File Inclusion Bugs."
                    },
                    {
                        name: "getLessonEight",
                        slots: [],
                        hints: [
                            "play the lesson file upload bugs",
                            "play the video file upload bugs",
                            "teach me about file upload bugs",
                            "teach me about hiding data in PNG files",
                            "teach me about MIME type attacks",
                            "teach me about filename-based attacks",
                            "teach me about how multipart POSTs work"
                        ],
                        description: "Learn about File Upload Bugs."
                    },
                    {
                        name: "getLessonNine",
                        slots: [],
                        hints: [
                            "play the lesson null termination bugs",
                            "play the video null termination bugs",
                            "teach me about null terminators"
                        ],
                        description: "Learn about Null Termination Bugs."
                    },
                    {
                        name: "getLessonTen",
                        slots: [],
                        hints: [
                            "play the lesson unchecked redirects",
                            "play the video unchecked redirects",
                            "teach me about unchecked redirects"
                        ],
                        description: "Learn about Unchecked Redirects."
                    },
                    {
                        name: "getLessonEleven",
                        slots: [],
                        hints: [
                            "teach me about methods of storing passwords",
                            "teach me about bare hash",
                            "teach me about Scrypt",
                            "teach me about Bcrypt",
                            "play the lesson password storage",
                            "play the video password storage"
                        ],
                        description: "Learn about Secure Password Storage."
                    },
                    {
                        name: "getLessonTwelve",
                        slots: [],
                        hints: [
                            "play the lesson crypto crash course",
                            "play the video crypto crash course",
                            "teach me about Hash-based MAC",
                            "teach me about HMAC",
                            "teach me about Message Authentication Codes",
                            "teach me about MACs",
                            "teach me about hashes",
                            "teach me about Cipher Block Chaining",
                            "teach me about Electronic Codebook",
                            "teach me about CBC",
                            "teach me about ECB",
                            "teach me about block cipher modes",
                            "teach me about types of ciphers",
                            "teach me about one-time pads",
                            "teach me about XOR and its importance for cryptography"
                        ],
                        description: "Get an overview of cryptography."
                    },
                    {
                        name: "getLessonThirteen",
                        slots: [],
                        hints: [
                            "teach me about padding oracles",
                            "teach me about hash length extension",
                            "teach me about ECB decryption",
                            "teach me about ECB block reordering",
                            "teach me about stream cipher key reuse",
                            "play the lesson crypto attacks",
                            "play the video crypto attacks"
                        ],
                        description: "Learn about cryptography attacks."
                    },
                    {
                        name: "getLessonFourteen",
                        slots: [],
                        hints: [
                            "finish up the crypto video",
                            "teach me about padbuster",
                            "teach me about ECB mode",
                            "play the video crypto wrap-up",
                            "teach me about crypto wrap-up"
                        ],
                        description: "Learn more about cryptography."
                    }
                ];

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
                "backgroundImage": 'https://s3.amazonaws.com/bugbrowser/images/WebIconv2Dark.png',
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
    'registerBugCrowd': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('registerBugCrowd');
    },
    'getLessonOne': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getLessonOne');
    },
    'getLessonTwo': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getLessonTwo');
    },
    'getLessonThree': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getLessonThree');
    },
    'getLessonFour': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getLessonFour');
    },
    'getLessonFive': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getLessonFive');
    },
    'getLessonSix': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getLessonSix');
    },
    'getLessonSeven': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getLessonSeven');
    },
    'getLessonEight': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getLessonEight');
    },
    'getLessonNine': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getLessonNine');
    },
    'getLessonTen': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getLessonTen');
    },
    'getLessonEleven': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getLessonEleven');
    },
    'getLessonTwelve': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getLessonTwelve');
    },
    'getLessonThirteen': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getLessonThirteen');
    },
    'getLessonFourteen': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getLessonFourteen');
    },
    'getTeachVideos': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getTeachVideos');
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
    'AMAZON.HelpIntent': function () {
        this.emit('getHelpIntent');
    },
    'AMAZON.StopIntent': function () {
        var self = this;
        if (this.event.context.System.device.supportedInterfaces.Display) {
            rp({
                uri: `https://hackerone.com/hacktivity.json`,
                transform: function (body) {
                    return JSON.parse(body);
                }
            }).then((data) => {
                var count = data.count + 96000;
                var content = 'Imagine if the over ' + count + ' security vulnerabilities patched so far on HackerOne and BugCrowd combined had not been resolved.';
                var speakContent = 'Imagine if the over <say-as interpret-as="cardinal">' + count + '</say-as> security vulnerabilities patched so far on HackerOne and BugCrowd combined had not been resolved.';
                const builder = new Alexa.templateBuilders.BodyTemplate1Builder();
                const template = builder.setTitle('Bug Browser')
                                        .setToken('cancelIntentToken')
                                        .setBackButtonBehavior('HIDDEN')
                                        .setBackgroundImage(makeImage('https://s3.amazonaws.com/bugbrowser/images/Security+Vulnerability.jpg'))
                                        .setTextContent(makeRichText('<font size="3">' + content + '</font>'))
                                        .build();
                this.response.speak(speakContent + ' Anyways, Bug Browser is going to sleep for now.').renderTemplate(template);                   
                this.emit(':responseReady');
            }).catch(function (err) {
                console.log(err);
                self.emit(':tell', 'Bug Browser is going to sleep for now.');
            });
        } else {
            rp({
                uri: `https://hackerone.com/hacktivity.json`,
                transform: function (body) {
                    return JSON.parse(body);
                }
            }).then((data) => {
                var count = data.count + 96000;
                var content = 'Imagine if the over ' + count + ' security vulnerabilities patched so far on HackerOne and BugCrowd combined had not been resolved.';
                var speakContent = 'Imagine if the over <say-as interpret-as="cardinal">' + count + '</say-as> security vulnerabilities patched so far on HackerOne and BugCrowd combined had not been resolved.';
                this.emit(':tell', speakContent + ' Anyways, Bug Browser is going to sleep for now.');
            }).catch(function (err) {
                console.log(err);
                self.emit(':tell', 'Bug Browser is going to sleep for now.');
            });
        }
    },
    'AMAZON.CancelIntent': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
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
                                    .setBackgroundImage(makeImage('https://s3.amazonaws.com/bugbrowser/images/Bug-Window-Dark.png'))
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
    'registerBugCrowd': function () {
        this.attributes.lastAction = "registerBugCrowd";
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
    'getLessonOne': function () {
        const description = 'In this Hacker101 lesson the instructor Cody Brocious will talk about how you can take the things you learn in this class and apply them to real situations. You will learn about the required tools, thinking like a breaker, attacker-defender imbalance, lightweight threat assessment and prioritization, and how to write good bug reports.';
        this.attributes.lastAction = "getLessonOne";
        if (this.event.context.System.device.supportedInterfaces.Display) {
            const videoSource = 'https://s3.amazonaws.com/bugbrowser/video/Hacker101/Hacker101+-+Introduction.mp4';
            const metadata = {
                'title': 'Introduction to Hacking',
                'subtitle': 'Lesson 1'
            };
            this.response.playVideo(videoSource, metadata);
            this.emit(':responseReady');
        } else {
            this.emit(':ask', videoError + overview + generalReprompt, HelpMessage);
        }
    },
    'getLessonTwo': function () {
        this.attributes.lastAction = "getLessonTwo";
        if (this.event.context.System.device.supportedInterfaces.Display) {
            const videoSource = 'https://s3.amazonaws.com/bugbrowser/video/Hacker101/Hacker101+-+The+Web+In+Depth.mp4';
            const metadata = {
                'title': 'The Web In Depth',
                'subtitle': 'Lesson 2'
            };
            this.response.playVideo(videoSource, metadata);
            this.emit(':responseReady');
        } else {
            this.emit(':ask', videoError + overview + generalReprompt, HelpMessage);
        }
    },
    'getLessonThree': function () {
        this.attributes.lastAction = "getLessonThree";
        if (this.event.context.System.device.supportedInterfaces.Display) {
            const videoSource = 'https://s3.amazonaws.com/bugbrowser/video/Hacker101/Hacker101+-+XSS+and+Authorization.mp4';
            const metadata = {
                'title': 'XSS and Authorization',
                'subtitle': 'Lesson Three'
            };
            this.response.playVideo(videoSource, metadata);
            this.emit(':responseReady');
        } else {
            this.emit(':ask', videoError + overview + generalReprompt, HelpMessage);
        }
    },
    'getLessonFour': function () {
        this.attributes.lastAction = "getLessonFour";
        if (this.event.context.System.device.supportedInterfaces.Display) {
            const videoSource = 'https://s3.amazonaws.com/bugbrowser/video/Hacker101/Hacker101+-+SQL+Injection+and+Friends.mp4';
            const metadata = {
                'title': 'SQL Injection',
                'subtitle': 'Lesson 4'
            };
            this.response.playVideo(videoSource, metadata);
            this.emit(':responseReady');
        } else {
            this.emit(':ask', videoError + overview + generalReprompt, HelpMessage);
        }
    },
    'getLessonFive': function () {
        this.attributes.lastAction = "getLessonFive";
        if (this.event.context.System.device.supportedInterfaces.Display) {
            const videoSource = 'https://s3.amazonaws.com/bugbrowser/video/Hacker101/Hacker101+-+Session+Fixation.mp4';
            const metadata = {
                'title': 'Session Fixation',
                'subtitle': 'Lesson 5'
            };
            this.response.playVideo(videoSource, metadata);
            this.emit(':responseReady');
        } else {
            this.emit(':ask', videoError + overview + generalReprompt, HelpMessage);
        }
    },
    'getLessonSix': function () {
        this.attributes.lastAction = "getLessonSix";
        if (this.event.context.System.device.supportedInterfaces.Display) {
            const videoSource = 'https://s3.amazonaws.com/bugbrowser/video/Hacker101/Hacker101+-+Clickjacking.mp4';
            const metadata = {
                'title': 'Clickjacking',
                'subtitle': 'Lesson 6'
            };
            this.response.playVideo(videoSource, metadata);
            this.emit(':responseReady');
        } else {
            this.emit(':ask', videoError + overview + generalReprompt, HelpMessage);
        }
    },
    'getLessonSeven': function () {
        this.attributes.lastAction = "getLessonSeven";
        if (this.event.context.System.device.supportedInterfaces.Display) {
            const videoSource = 'https://s3.amazonaws.com/bugbrowser/video/Hacker101/Hacker101+-+File+Inclusion.mp4';
            const metadata = {
                'title': 'File Inclusion',
                'subtitle': 'Lesson 7'
            };
            this.response.playVideo(videoSource, metadata);
            this.emit(':responseReady');
        } else {
            this.emit(':ask', videoError + overview + generalReprompt, HelpMessage);
        }
    },
    'getLessonEight': function () {
        this.attributes.lastAction = "getLessonEight";
        if (this.event.context.System.device.supportedInterfaces.Display) {
            const videoSource = 'https://s3.amazonaws.com/bugbrowser/video/Hacker101/Hacker101+-+File+Upload+Bugs.mp4';
            const metadata = {
                'title': 'File Upload Bugs',
                'subtitle': 'Lesson 8'
            };
            this.response.playVideo(videoSource, metadata);
            this.emit(':responseReady');
        } else {
            this.emit(':ask', videoError + overview + generalReprompt, HelpMessage);
        }
    },
    'getLessonNine': function () {
        this.attributes.lastAction = "getLessonNine";
        if (this.event.context.System.device.supportedInterfaces.Display) {
            const videoSource = 'https://s3.amazonaws.com/bugbrowser/video/Hacker101/Hacker101+-+Null+Termination+Bugs.mp4';
            const metadata = {
                'title': 'Null Termination Bugs',
                'subtitle': 'Lesson 9'
            };
            this.response.playVideo(videoSource, metadata);
            this.emit(':responseReady');
        } else {
            this.emit(':ask', videoError + overview + generalReprompt, HelpMessage);
        }
    },
    'getLessonTen': function () {
        this.attributes.lastAction = "getLessonTen";
        if (this.event.context.System.device.supportedInterfaces.Display) {
            const videoSource = 'https://s3.amazonaws.com/bugbrowser/video/Hacker101/Hacker101+-+Unchecked+Redirects.mp4';
            const metadata = {
                'title': 'Unchecked Redirects',
                'subtitle': 'Lesson 10'
            };
            this.response.playVideo(videoSource, metadata);
            this.emit(':responseReady');
        } else {
            this.emit(':ask', videoError + overview + generalReprompt, HelpMessage);
        }
    },
    'getLessonEleven': function () {
        this.attributes.lastAction = "getLessonEleven";
        if (this.event.context.System.device.supportedInterfaces.Display) {
            const videoSource = 'https://s3.amazonaws.com/bugbrowser/video/Hacker101/Hacker101+-+Secure+Password+Storage.mp4';
            const metadata = {
                'title': 'Secure Password Storage',
                'subtitle': 'Lesson 11'
            };
            this.response.playVideo(videoSource, metadata);
            this.emit(':responseReady');
        } else {
            this.emit(':ask', videoError + overview + generalReprompt, HelpMessage);
        }
    },
    'getLessonTwelve': function () {
        this.attributes.lastAction = "getLessonTwelve";
        if (this.event.context.System.device.supportedInterfaces.Display) {
            const videoSource = 'https://s3.amazonaws.com/bugbrowser/video/Hacker101/Hacker101+-+Crypto+Crash+Course.mp4';
            const metadata = {
                'title': 'Crypto Crash Course',
                'subtitle': 'Lesson 12'
            };
            this.response.playVideo(videoSource, metadata);
            this.emit(':responseReady');
        } else {
            this.emit(':ask', videoError + overview + generalReprompt, HelpMessage);
        }
    },
    'getLessonThirteen': function () {
        this.attributes.lastAction = "getLessonThirteen";
        if (this.event.context.System.device.supportedInterfaces.Display) {
            const videoSource = 'https://s3.amazonaws.com/bugbrowser/video/Hacker101/Hacker101+-+Crypto+Attacks.mp4';
            const metadata = {
                'title': 'Crypto Attacks',
                'subtitle': 'Lesson 13'
            };
            this.response.playVideo(videoSource, metadata);
            this.emit(':responseReady');
        } else {
            this.emit(':ask', videoError + overview + generalReprompt, HelpMessage);
        }
    },
    'getLessonFourteen': function () {
        this.attributes.lastAction = "getLessonFourteen";
        if (this.event.context.System.device.supportedInterfaces.Display) {
            const videoSource = 'https://s3.amazonaws.com/bugbrowser/video/Hacker101/Hacker101+-+Crypto+Wrap-Up.mp4';
            const metadata = {
                'title': 'Crypto Wrap-Up',
                'subtitle': 'Lesson 14'
            };
            this.response.playVideo(videoSource, metadata);
            this.emit(':responseReady');
        } else {
            this.emit(':ask', videoError + overview + generalReprompt, HelpMessage);
        }
    },
    'getTeachVideos': function () {
        var context = this;
        this.handler.state = states.SEARCHMODE;
        this.attributes.lastAction = "getTeachVideos";
        var cardTitle = "Bug Browser Lessons";

        if (context.event.context.System.device.supportedInterfaces.Display) {
            if(context.event && context.event.request && context.event.request.intent && context.event.request.intent.slots && context.event.request.intent.slots.program && context.event.request.intent.slots.program.value && context.event.request.intent.slots.program.value != null && context.event.request.intent.slots.program.value != "?"){
                context.emit(lessons[context.event.request.intent.slots.program.value - 1].name)
            }
            else{
                var content = 'Here are some things Bug Browser can teach:\n';
                var speak = 'Here are some things you can say to Bug Browser: ';
                const listItemBuilder = new Alexa.templateBuilders.ListItemBuilder();
                const listTemplateBuilder = new Alexa.templateBuilders.ListTemplate1Builder();
                for (var i = 0; i < lessons.length; i++) {
                    var value = Math.floor(Math.random() * lessons[i].hints.length);
                    var raw = lessons[i].hints[value];
                    var complete = raw.charAt(0).toUpperCase() + raw.substring(1);
                    speak += "Number " + (i + 1) + ". " + complete + ". \n";
                    content += (i + 1) + ". Say " + raw + ": " + lessons[i].description + "\n";
                    listItemBuilder.addItem(null, 'lessonItemToken' + i, makeRichText("<font size='2'>" + lessons[i].description + "</font>"), makeRichText("<font size='1'>" + "Say " + "<i>" + raw + "</i>" + "</font>"));
                }
                speak += "Select a video or ask me to play lesson number five for example to begin a lesson. What would you like to do?";

                const listItems = listItemBuilder.build();
                const listTemplate = listTemplateBuilder.setToken('getLessonToken')
                                        .setTitle(cardTitle)
                                        .setListItems(listItems)
                                        .setBackgroundImage(makeImage('https://s3.amazonaws.com/bugbrowser/images/Coding-Monitors.png'))
                                        .build();

                    context.response.speak(speak).renderTemplate(listTemplate).cardRenderer(cardTitle, content, null).listen(speak);
                    context.emit(':responseReady');
            }
        } else {
            var content = 'Bug Browser lessons are only available for video-enabled devices at this time.';
            context.emit(':askWithCard', content + generalReprompt, HelpMessage);
        }
    },
    'getBugCrowdIntent': function () {
        var self = this;
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
                    
                    read = "Here are the active programs at BugCrowd from page " + bugCrowdPage + " of " + bugCrowdTotal + ": ";
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
        }).catch(function (err) {
            console.log(err);
            self.emit(':ask', generalError, HelpMessage);
        });
    },
    'getHackerOneIntent': function() {
        var self = this;
        this.attributes.lastAction = "getHackerOneIntent";
        rp({
            uri: `http://bugbrowsercache.s3-accelerate.amazonaws.com/hackerone.json`,
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
        }).catch(function (err) {
            console.log(err);
            self.emit(':ask', generalError, HelpMessage);
        });
    },
    'getMoreInfoBugCrowdIntent': function () {
        var self = this;
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
                                                .setBackgroundImage(makeImage('https://s3.amazonaws.com/bugbrowser/images/Encryption.png'))
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
                }).catch(function (err) {
                    console.log(err);
                    self.emit(':ask', generalError, HelpMessage);
                });
            }
            else {
                this.emit(':ask', noProgramErrorMessage + moreInfoProgram, noProgramErrorMessage + moreInfoProgram);
            }
            
        }).catch(function (err) {
            console.log(err);
            self.emit(':ask', generalError, HelpMessage);
        });
    },
    'getMoreInfoHackerOneIntent': function() {
        var self = this;
        this.attributes.lastAction = "getMoreInfoHackerOneIntent";
        rp({
            uri: `http://bugbrowsercache.s3-accelerate.amazonaws.com/hackerone.json`,
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
                                            .setBackgroundImage(makeImage('https://s3.amazonaws.com/bugbrowser/images/Search.jpg'))
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
            }).catch(function (err) {
                console.log(err);
                self.emit(':ask', generalError, HelpMessage);
            });
            }
            else {
                this.attributes.lastSpeech = noProgramErrorMessage + moreInfoProgram;
                this.emit(':ask', noProgramErrorMessage + moreInfoProgram, noProgramErrorMessage + moreInfoProgram);
            }
        }).catch(function (err) {
            console.log(err);
            self.emit(':ask', generalError, HelpMessage);
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
        else if(this.attributes.lastAction == "getTeachVideos"){
            this.emit('getTeachVideos');
        }
        else{
            output = "Would you like to hear more about HackerOne programs or BugCrowd programs? If BugCrowd programs, say tell me more about BugCrowd program number five for example. If HackerOne programs, say tell me more about HackerOne program number three for example. What would you like me to do?";
            this.emit(':ask', output, HelpMessage);
        }
    },
    'getVRTIntent': function () {
        var self = this;
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
            }).then((selectedVrt) => {
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
                                                .setBackgroundImage(makeImage('https://s3.amazonaws.com/bugbrowser/images/Bug-Window-Dark.png'))
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
            }).catch(function (err) {
                console.log(err);
                self.emit(':tell', generalError);
            });
    },
    "ElementSelected": function() {
        this.attributes.lastAction = "ElementSelected";
        var context = this;
        var self = this;
        var supportsDisplay = this.event.context.System.device.supportedInterfaces.Display;
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
                                                    .setBackgroundImage(makeImage('https://s3.amazonaws.com/bugbrowser/images/Encryption.png'))
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
                    }).catch(function (err) {
                        console.log(err);
                        self.emit(':ask', generalError, HelpMessage);
                    });
                
                }).catch(function (err) {
                    console.log(err);
                    self.emit(':ask', generalError, HelpMessage);
                });
        }
        else if((this.event.request.token).substring(0, 21) == "hackerOneProgramToken" || (this.event.request.token).substring(0, 26) == "eventhackerOneProgramToken"){
            this.attributes.lastAction = "getMoreInfoHackerOneIntent";
            var index = parseInt(newToken.replace(/[^0-9]/g, ''), 10) + hackerOneMax - 25; //leave only the digits
            rp({
                uri: `http://bugbrowsercache.s3-accelerate.amazonaws.com/hackerone.json`,
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
                                                .setBackgroundImage(makeImage('https://s3.amazonaws.com/bugbrowser/images/Search.jpg'))
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
                }).catch(function (err) {
                    console.log(err);
                    self.emit(':ask', generalError, HelpMessage);
                });
                }
                else {
                    this.attributes.lastSpeech = noProgramErrorMessage + moreInfoProgram;
                    this.emit(':ask', noProgramErrorMessage + moreInfoProgram, noProgramErrorMessage + moreInfoProgram);
                }
            }).catch(function (err) {
                console.log(err);
                self.emit(':ask', generalError, HelpMessage);
            });
        }
        else if((this.event.request.token).substring(0, 13) == "listItemToken"){
            var selectedToken = (this.event.request.token).substring(13);
            console.log ('List Token Detected ' + selectedToken);
            this.emit(':ask', "No additonal information is available about subcategory " + selectedToken + "." + HelpMessage, HelpMessage.substring(1));
        }
        else if((this.event.request.token).substring(0, 13) == "helpItemToken"){
            var selectedToken = (this.event.request.token).substring(13);
            console.log ('Help Token Detected ' + selectedToken);
            this.emit(helpMessages[selectedToken].intent);
        }
        else if((this.event.request.token).substring(0, 15) == "lessonItemToken"){ 
            var selectedToken = (this.event.request.token).substring(15);
            console.log ('Lesson Token Detected ' + selectedToken);
            this.emit(lessons[selectedToken].name);
        }
        else if((this.event.request.token).substring(0, 13) == "newsItemToken") {
            var index = parseInt(this.event.request.token.replace(/[^0-9]/g, ''), 13);
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
               content += sanitizeInput(articles[index].description);
               if (supportsDisplay) {
                const builder = new Alexa.templateBuilders.BodyTemplate2Builder();
                const template = builder.setTitle(articles[index].title)
                                    .setToken('getMoreInfoNewsToken')
                                    .setBackButtonBehavior('VISIBLE')
                                    .setBackgroundImage(makeImage('https://s3.amazonaws.com/bugbrowser/images/Circuit.png'))
                                    .setImage(makeImage(articles[index].urlToImage ? articles[index].urlToImage: 'https://s3.amazonaws.com/bugbrowser/images/HackerNewsLogo.jpeg'))
                                    .setTextContent(makeRichText("<font size='1'>" + content + "</font>"))
                                    .build();
                context.response.speak(articles[index].title + ': ' + content).listen(hearMoreMessage).cardRenderer(articles[index].title, articles[index].description, articles[index].urlToImage).renderTemplate(template);                   
                context.emit(':responseReady');
                } else {
                    context.emit(':askWithCard', articles[index].title + ': ' + content, hearMoreMessage, articles[index].title, articles[index].description, makeImage(articles[index].urlToImage ? articles[index].urlToImage : 'https://s3.amazonaws.com/bugbrowser/images/Circuit.png'));
                }
            }).catch(function (err) {
                console.log(err);
                self.emit(':ask', generalError, HelpMessage);
            });
        }
    },
    'AMAZON.RepeatIntent': function () { 
        if(this.attributes.lastAction == "getOverviewVideo"){
            this.emit('getOverviewVideo');
        }
        else if(this.attributes.lastAction == "getEasterEgg"){
            this.emit('getEasterEgg');
        }
        else if(this.attributes.lastAction == "registerBugCrowd"){
            this.emit('registerBugCrowd');
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
        this.emit('AMAZON.StopIntent');
    },
    'AMAZON.StopIntent': function () {
        var self = this;
        if (this.event.context.System.device.supportedInterfaces.Display) {
            rp({
                uri: `https://hackerone.com/hacktivity.json`,
                transform: function (body) {
                    return JSON.parse(body);
                }
            }).then((data) => {
                var count = data.count + 96000;
                var content = 'Imagine if the over ' + count + ' security vulnerabilities patched so far on HackerOne and BugCrowd combined had not been resolved.';
                var speakContent = 'Imagine if the over <say-as interpret-as="cardinal">' + count + '</say-as> security vulnerabilities patched so far on HackerOne and BugCrowd combined had not been resolved.';
                const builder = new Alexa.templateBuilders.BodyTemplate1Builder();
                const template = builder.setTitle('Bug Browser')
                                        .setToken('cancelIntentToken')
                                        .setBackButtonBehavior('HIDDEN')
                                        .setBackgroundImage(makeImage('https://s3.amazonaws.com/bugbrowser/images/Security+Vulnerability.jpg'))
                                        .setTextContent(makeRichText('<font size="3">' + content + '</font>'))
                                        .build();
                this.response.speak(speakContent + ' Anyways, Bug Browser is going to sleep for now.').renderTemplate(template);                   
                this.emit(':responseReady');
            }).catch(function (err) {
                console.log(err);
                self.emit(':tell', 'Bug Browser is going to sleep for now.');
            });
        } else {
            rp({
                uri: `https://hackerone.com/hacktivity.json`,
                transform: function (body) {
                    return JSON.parse(body);
                }
            }).then((data) => {
                var count = data.count + 96000;
                var content = 'Imagine if the over ' + count + ' security vulnerabilities patched so far on HackerOne and BugCrowd combined had not been resolved.';
                var speakContent = 'Imagine if the over <say-as interpret-as="cardinal">' + count + '</say-as> security vulnerabilities patched so far on HackerOne and BugCrowd combined had not been resolved.';
                this.emit(':tell', speakContent + ' Anyways, Bug Browser is going to sleep for now.');
            }).catch(function (err) {
                console.log(err);
                self.emit(':tell', 'Bug Browser is going to sleep for now.');
            }); 
        }
    },
    'AMAZON.HelpIntent': function () {
        this.emit('getHelpIntent');
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
                        listItemBuilder.addItem(makeImage(articles[i].urlToImage ? articles[i].urlToImage : 'https://s3.amazonaws.com/bugbrowser/images/HackerNewsLogo.jpeg'), 'newsItemToken' + i, makeRichText("<font size='1'>" + articles[i].title + "</font>"), makeRichText("<font size='1'>" + articles[i].source.name + "</font>"));
                }
                const listItems = listItemBuilder.build();
                const listTemplate = listTemplateBuilder.setToken('getNewsIntentToken')
                                        .setTitle('Bug Browser News')
                                        .setListItems(listItems)
                                        .setBackgroundImage(makeImage('https://s3.amazonaws.com/bugbrowser/images/Circuit.png'))
                                        .build();

                context.response.speak(content + generalReprompt).cardRenderer('Bug Browser News', 'Data provided by NewsAPI: \n\n' + content, null).renderTemplate(listTemplate).listen(HelpMessage);
                context.emit(':responseReady');
            } else {
                for (var i = 0; i < articles.length && i < 15; i++) {
                    content += sanitizeInput('\nArticle ' + (i + 1) + ': ' + articles[i].title);
                }
                context.emit(':askWithCard', content + generalReprompt, HelpMessage, 'Bug Browser News', content);
            }
        });
    },
    'getHelpIntent': function () {
        var context = this;
        this.handler.state = states.SEARCHMODE;
        this.attributes.lastAction = "getHelpIntent";
        var cardTitle = "Bug Browser Help";

        if (context.event.context.System.device.supportedInterfaces.Display) {
            var content = 'Here are some things you can ask or say to Bug Browser:\n';
            var speak = 'Here are some things you can ask or say to Bug Browser:\n';
            const listItemBuilder = new Alexa.templateBuilders.ListItemBuilder();
            const listTemplateBuilder = new Alexa.templateBuilders.ListTemplate1Builder();
            for (var i = 0; i < helpMessages.length; i++) {
                speak += "Number " + (i + 1) + ". " + helpMessages[i].message + ". \n";
                content += (i + 1) + ". " + helpMessages[i].message + ". \n";
                listItemBuilder.addItem(null, 'helpItemToken' + i, makeRichText("<font size='2'>" + helpMessages[i].message + "</font>"), makeRichText("<i><font size='1'>" + helpMessages[i].description + "</font></i>"));
            }
            speak += "What would you like to do?";

            const listItems = listItemBuilder.build();
            const listTemplate = listTemplateBuilder.setToken('getHelpToken')
                                    .setTitle(cardTitle)
                                    .setListItems(listItems)
                                    .setBackgroundImage(makeImage('https://s3.amazonaws.com/bugbrowser/images/LockTreeDark.png'))
                                    .build();

                context.response.speak(speak).renderTemplate(listTemplate).cardRenderer(cardTitle, content, null).listen(speak);
                context.emit(':responseReady');
        } else {
            var content = 'Here are some things you can ask or say to Bug Browser:\n';
            for (var i = 0; i < helpMessages.length; i++) {
                content += (i + 1) + ". " + helpMessages[i].message + ". \n";
            }
            context.emit(':askWithCard', content + generalReprompt, HelpMessage, 'Bug Browser Help', content);
        }
    },
    'AMAZON.CancelIntent': function () {
        this.emit('AMAZON.StopIntent');
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
                                "smallImageUrl": "https://s3.amazonaws.com/bugbrowser/images/WebIconv2Dark.png",
                                "largeImageUrl": "https://s3.amazonaws.com/bugbrowser/images/WebIconv2Dark.png"
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