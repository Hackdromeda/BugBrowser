# Bug Browser #
Bug Browser is your one-stop skill for everything cybersecurity. Bug Browser will teach you how to hack, provide a comprehensive briefing on recent hacks and security vulnerabilities around the world, information about bug bounty programs and bug bounty platforms, the BugCrowd VRT, active HackerOne bounties, and active BugCrowd bounties as well as provide additional information on these bounties.

Developed in the Bay Area by Avi Shah and Naval Patel

# MISSING from README:
- Testimonials from all tiers of users
- Explanation of life of security researcher and why this improves their lives (work at home skill prize explanation) 
- Explanation of how we dynamically get data
- Caching system for faster response time
- Challenges: ElementSelected, etc.

## Enable the Skill:
[Amazon US Skill](https://www.amazon.com/dp/B07BPVH1S5/)

## Inspiration
We realized that there were very few skills for [security researchers](https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Dalexa-skills&field-keywords=Hacker) and [developers](https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Dalexa-skills&field-keywords=Developer) after meeting with the principal engineer and the community manager at BugCrowd at Los Altos Hacks III. They challenged us to create a skill that would a) inform them of active bug bounties, b) provide details about the specific bounties, and c) make their lives as security researchers easier in any other way. 

## Mission
Why bug bounties?

A large part of our days now revolve around devices and being connected to the internet. Customers have come to expect security and confidence in the company handling their data. Even the best developers in the world can leave security vulnerabilities open in their applications. Platforms such as BugCrowd and HackerOne make it easier for security researchers to get connected with companies and allow companies to reach a vast network of researchers. Breaches and security vulnerabilities are expensive to recover from, much more expensive than the few-thousand-dollar reward hackers receive for their finding(s). Facebook, Equifax, Intel, 24/7 AI, eBay, Home Depot, Target, and a handful of other companies have experienced security breaches as a result of vulnerabilities exploited by black hat hackers and their reputations have suffered as a result.

Who is this Alexa skill for?
1. **General Public** - *All customers and clients value their private data. As such, they expect the company entrusted with their data to do everything in their power to protect that data. Now more than ever, breaches of customer data are a common occurance. Users should not, however, become desensitized or numb to such news but rather proactively take action to protect their data.* - Bug Browser can help anyone keep up-to-date on the latest news about security vulnerabilities, hacks, and other cybersecurity issues. 
  - How does this skill provide convenience, save time, and improve the lives of the general public?
    - Bug Browser provides focused news on the topic of cybersecurity. In today's fast paced news cycle, not everyone in the public is made aware of hacks and vulnerabilities that afffect them. Users who learn they are affected by a security breach thorugh Bug Browser can then take proactive steps to prevent further losses by changing their password, freezing their credit reports, activating identity protection services, canceling their credit cards, updating their computer or device software, and/or using 2-factor authentication. Bug Browser ultimately can save the general public from the headaches of recovering lost accounts and data, reversing unauthorized transactions, and more.

2. **Developers** - *Developers who have experience with code, computers, and other fields of computer science but are not focused on hacking, cybersecurity, or security research as a career or hobby* - Bug Browser can introduce developers to the importance of bug bounties and bug bounty platforms.
  - How does this skill provide convenience, save time, and improve the lives of developers?
    - Bug Browser has overview videos and descriptions to get developers hooked on the lifestyle that is security research. Bug Browser will walk developers through the reasons bug bounty programs exist, how they can join bug bounty platforms, and set them on their way to being a novice hacker. Bug Browser effectively exposes developers to new ways to apply their existing interests and knowledge of computer science including to develop and defeat new security techniques and find strengths and weaknesses in code.

3. **New and Intermediate Hackers** - *Hackers who are just starting their career or hobby in security research will not have the coding experience to find bugs immediately but have enough of an understanding of code, computers, web development, server-side scripting, hardware, networking, operating systems, etcetera to learn how to hack. These hackers are likely developers looking to make additional money or improve their own skills* - Bug Browser provides tutorials for how to hack for people with basic experience and understanding in the world of computers including application and development of software in C++, C, or Python, as well as experience developing software applications in Linux, macOS, and/or Windows environments. Novice hackers can listen to the descriptions or watch the videos in the background while they work on other tasks.

- How does this skill provide convenience, save time, and improve the lives of novice hackers?
  - Bug Browser can describe specific vulnerabilities, how to find security flaws, and explain how to get paid with bug bounties. Whether users are interested in learning about bug bounties, have a background in computer science, or are seasoned security professionals, they can learn something from Bug Browsers library of lessons (powered by [Hacker101](https://github.com/Hacker0x01/hacker101)). 
 
4. **Active Security Researchers** - *Security researchers do not work your typical 9-to-5 workday. People in this field do not have to have a college diploma or a certification to do it, just a good understanding of programming, computers, and hardware. Security research can be challenging but very rewarding. Ethical hackers protect companies, organizations, and institutions from abuse from malicious hackers. These ethical hackers gain anything from points on the platform to monetary rewards.* - Security researchers can ask about active programs, get more details about these programs, and refer back to the skill for updates and new programs daily.

- How does this skill provide convenience, save time, and improve the lives of security researchers?
  - Security researchers often work on their own schedule and have flexible hours. Alexa can simplify the process of learning of new programs from various platforms when security researchers have a mess of data and programs open such as packed code, virtual or sandbox environments, text editors, and online network utilities and when using Alexa is simply more convenient.

What was challenging during the development process?

Our team faced several major challenges during the development cycle:

#### 1. Implementing a Graphical User Interface

When we started the skill we had not even thought about users who had displays like those on the Echo Spot and Echo Show as well as cards on the Fire TV and Alexa app. One of the goals we set for ourselves was to implement a GUI for Bug Browser and design the best user experience possible. Frequently referring to Amazon's resources and documentation for building user interfaces, we were able to quickly learn the differences between the templates. The next step in the development process was to find the most effective method of building a template. We had trouble implementing the display interfaces initially but soon became experts at using them after learning how to use the standard template builder methods included in the SDK for Lambda. One of the most significant challenges our team had to solve was binding a GUI touch event to an intent or function. After further research and experimentation, we were able to use the ElementSelected function to build a more captivating display experience.

#### 2. Asynchronous Requests

From the early stages of Bug Browser, our team had agreed on a few basic design principles that would increase the efficiency and reliability of Bug Browser. One of the most important of these principles was the use of asynchronous request for HTTP GET requests because it is the best practice to avoid blocking the main thread whenever possible. We used the request-promise Node.js module for writing asynchronous requests that would retrieve image assets, JSON, and other data that would be parsed with the Cheerio module for Node.js. 

#### 3. Context

Alexa is a smart, conversational AI that, just like any human being, needs context in order to interpret speech and respond to a user query. Not only does Alexa require context, but it also needs to be able to remember session details that would help with routing requests to the correct destination. We implemented a system of context organization that would be able to determine the last intent a user was routed to and used it for page navigation between programs lists and program pages as well as news lists and news pages. 

For example, if a user asks for *"number one"* that could either mean a HackerOne program, a BugCrowd program, or a lesson number. Session-level attributes help us know what the user wants without forcing them to be more specific.

What are the accomplishments your team is proud of?

- Bug Browser is our first display interface skill entering production
- Bug Browser is also our first skill which dynamically gets information and can do advanced functions with the data
- Receiving incredibly positive feedback from multiple users during beta testing and while live including hearing from members of the field directly
- Coming up with a unique use case for Alexa that meets the needs of security researchers and can be used by anyone interested in cybersecurity and security vulnerabilities
- Partnering with BugCrowd to see what security researchers want in an Alexa skill

# Features:
* Learn about BugCrowd and HackerOne
  * Try, *Alexa ask Bug Browser to tell me some facts about BugCrowd.*
  * Try, *Alexa ask Bug Browser to introduce me to BugCrowd.*
  * Try, *Alexa ask Bug Browser to tell me what bug bounties and bug bounty platforms are*
  * See the Alexa app or interface for a recap of this information (iOS, Android, and Fire TV)

* Learn how to use BugCrowd
  * Try, *Alexa how do you use BugCrowd?*
  
* Get bounties from BugCrowd and/or HackerOne
  * Try, *Alexa ask Bug Browser, how do you find bounties?*
  * Try, *Alexa ask Bug Browser, what companies are looking for security researchers?*
  * Try, *Alexa ask Bug Browser, what are some bounties available from BugCrowd?*
  * Try, *Alexa ask Bug Browser to tell me about HackerOne programs*
  * See the Alexa app or interface for the list of programs (iOS, Android, and Fire TV)
   
* Get more bounties beyond the first set of cards provided
  * Try, *Alexa next page*
  * Try, *Alexa previous page*
  * Try, *Yes* when prompted if you want to hear more programs
  
* Get additional details for bounties from BugCrowd and/or HackerOne
  * Try, *Alexa ask Bug Browser to tell me more about program number five* after asking for the list on the desired platform
  * Try, *Alexa ask Bug Browser to tell me more about BugCrowd bounty number five*
  * Try, *Yes* when prompted if you want to learn about more programs
  * See the Alexa app or interface for additional details such as program requirements (iOS, Android, and Fire TV)
  
* Learn about hacking news using The New York Times and [NewsAPI](https://newsapi.org/)
  * Try, *Alexa ask Bug Browser to give me a flash briefing on hacks*
  * Try, *Alexa ask Bug Browser to tell me the latest news on vulnerabilities*
  * Tap on the article for additional details (Echo Spot and Echo Show only)
  * See the Alexa app or interface for additional details (iOS, Android, and Fire TV)
  
* Learn about the BugCrowd Vulnerability Rating Taxonomy (VRT)
  * Try, *Alexa ask Bug Browser to tell me about the VRT*
  * See the Alexa app or interface for additional details (iOS, Android, and Fire TV)
  
* Learn about BugCrowd through videos (Echo Spot and Echo Show only)
  * Try, *Alexa ask Bug Browser to introduce me to BugCrowd with a video*

* Learn about HTTP status codes
  * Try, *Alexa ask Bug Browser to list HTTP status codes*
  
* Learn about cybersecurity through video tutorials (Echo Spot and Echo Show only)
  * Try, *Alexa ask Bug Browser to play the lesson introduction video*
  * Try, *Alexa ask Bug Browser to teach me Same-Origin Policy*
  * Try, *Alexa ask Bug Browser to teach me about types of XSS*
  * Try, *Alexa ask Bug Browser to teach me about directory traversal*
  * Try, *Alexa ask Bug Browser to teach me about session fixation*
  * Try, *Alexa ask Bug Browser to teach me about clickjacking*
  * Try, *Alexa ask Bug Browser to teach me about remote file inclusion*
  * Try, *Alexa ask Bug Browser to teach me about how multipart POSTs work*
  * Try, *Alexa ask Bug Browser to teach me about null terminators*
  * Try, *Alexa ask Bug Browser to teach me about unchecked redirects*
  * Try, *Alexa ask Bug Browser to teach me about methods of storing passwords*
  * Try, *Alexa ask Bug Browser to teach me about block cipher modes*
  * Try, *Alexa ask Bug Browser to teach me about stream cipher key reuse*
  * Try, *Alexa ask Bug Browser to teach me about ECB mode*

## Coming Soon:
* Asking for program details by name so user can ask for details about the program without asking for the latest list of programs.
* Video Queue (Awaiting SDK Support)
* Confirm Choices *ex. Did you say you want more details about program Netflix?*
* Highlight text and automatically switch cards for Display Interface (Awaiting SDK Support)
* Font color customized (Awaiting SDK Support)
* Learn about bugs in your own code (ArrayOutOfBounds exception in Java, etc.)

# Built With
* [Node.js](https://nodejs.org/en/)
  * [request-promise](https://www.npmjs.com/package/request-promise)
  * [alexa-sdk](https://www.npmjs.com/package/alexa-sdk)
  * [cheerio](https://www.npmjs.com/package/cheerio)
  * [bluebird](https://www.npmjs.com/package/bluebird)
* [jQuery](https://www.npmjs.com/package/jquery)
* Lambda
and [over 20 more dependancies](https://github.com/as0218PUSD/BugBrowser/network/dependencies)

# Legal
We are developers, not legal experts. If you own any of the images or content we use and would like it removed for any reason, feel free to open an issue through the Alexa App or on GitHub. We will promptly act on your request. This skill is not affiliated with or endorsed by HackerOne, BugCrowd, or any of its affiliates. All product names, logos, and brands are property of their respective owners. All company, product and service names used in this website are for identification purposes only. Use of these names, logos, and brands does not imply endorsement.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) for details.

## Image Credits
https://www.bugcrowd.com/wp-content/uploads/2018/03/1803-Bugcrowd-BB-Blog-Twitter.png

https://assets.bugcrowdusercontent.com/packs/images/tracker/logo/vrt-logo-ba20b1de556f194607f690788f072798.svg

https://pngtree.com/freebackground/motherboard-line-science-and-technology-business-background-blu-ray-abstract_389364.html

https://www.stevens.edu/sites/stevens_edu/files/Mission_0.jpg

https://betanews.com/wp-content/uploads/2015/06/Security-e1436347233484.jpg

