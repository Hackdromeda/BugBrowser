# Privacy Policy
The Privacy Policy was last updated on September 16, 2018. Bug Browser and its developers may without notice to you and at its sole discretion, amend this policy. Please review this policy from time to time. 

**Bug Browser can collect the following information and/or perform the following actions:**

1. Read and write logs which may contain session information, Alexa Skill user information, and error messages
2. Connection Information (IP Addresses)
3. Read, write, and create lists in the Alexa app
4. Analytics automatically collected by Amazon
5. Provide information to APIs
    * [Have I Been Pwned](https://haveibeenpwned.com/API/v2) receives your email address to check for any security vulnerabilities or flaws that exposed your data.
    * [Alexa List API](https://developer.amazon.com/alexa-skills-kit/shopping-and-to-do-lists) receives the programs you want to save to your Alexa list.
    * [News API](https://newsapi.org/docs) does not receive any personal information.
    * [Google Custom Search API](https://developers.google.com/custom-search/) receives your query which may include any personal information you speak.
    * [StackExchange API](https://api.stackexchange.com/docs) does not receive any personal information.

We are committed to protecting the privacy and confidentiality of Bug Browser users' private data. We may have to provide personal information, which would be limited to any logs on AWS CloudWatch, to comply with any requests from authorities in the region you are connected to. You are connected to AWS Lambda based on your region. Bug Browser is hosted in the following regions: Asia Pacific (Tokyo), EU (Ireland), US East (N. Virginia), and US West (Oregon). Any logs and data is stored on AWS CloudWatch in that same region. If you have any questions about our data collection policies and methods, please use the contact information below.

The purpose of this skill is to help create a more secure web and help create bug-free code. As such, we do not sell or trade to outside parties your personal information. We also do not transfer this information without your express consent (see account linking below). We do not sell or offer third-party products or services on our skill.

**By using our Alexa Skill, you hereby consent to our [Privacy Policy](PRIVACYPOLICY.md), our [License](LICENSE.md), our [Terms of Use](TERMSOFUSE.md) and agree to any applicable Terms and Conditions including those of the APIs used, Alexa, and Amazon.**

# Personal Information
Here is additional information to help you understand how Alexa skills work with an explanation of how we process the data as needed. Information adapted from [here](https://petsymposium.org/2017/papers/hotpets/amazon-alexa-skills-ecosystem-privacy.pdf).

## COPPA (US)
Children Online Privacy Protection Act

The Children's Online Privacy Protection Act (COPPA) puts parents in control when it comes to the collection of personal information from children under the age of 13 years old. We do not specifically market to children under the age of 13 years old. Our target audiences are laid out in the [README](README.md).

## Audio availability

Although users interact with Skills using voice commands, the audio is not made accessible to the developers. Instead, all voice commands are transcribed and sent to the developers as text. This design choice by Amazon has several privacy benefits: first, Skill developers cannot create a unique user fingerprint using the rich audio data. Second, the voice data cannot be used to infer user’s age, gender, emotional state, etc., unless this information is explicitly conveyed in the choice of vocabulary (e.g., using gendered verbs and expletives).

  * Alexa interactions can be done via voice, display, and text. We use the voice transcript, text, or touch interaction to direct you to the correct Intent.

## userId

The userId is a unique identifier given by Amazon to each user. Amazon assigns a different userId for each Skill used so the userId’s usefulness for cross-Skill tracking is limited. This userID can be reset by disabling and re-enabling a skill.

## Permissions

Developers can configure their Skill to request access to the address of the user’s device at the “Full Address” or “Country & Postal Code Only” levels. Developers can also configure a skill to read and write to user’s Alexa lists, such as shopping or to-do. A user enabling such a Skill is prompted for consent with a permissions card in the Alexa app. List permissions apply to all of the user’s lists. Permissions can be revoked in the Skills section of the Alexa app.

  * List permissions are used to save bounties you want to hack.

## Account Linking

Developers can configure their skill to request access to the profile scope of an Amazon user's account through Login with Amazon. When a user unlinks or uninstalls the Skill, the developer immediately loses access to their name and email.

   * Account linking is used to get your email address and check if your email address has been involved in internet hacks. This uses data from Have I Been Pwned. This information is not sold or traded.
   
# Questions

Should you have any questions about our policies or skill, please reach out to us via GitHub messages, our contact information on GitHub, or via email at feedback@bugbrowser.net.
