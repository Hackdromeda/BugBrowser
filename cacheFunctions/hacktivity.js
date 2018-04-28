const AWS = require('aws-sdk');
const https = require('https');
const rp = require('request-promise');
const Bluebird = require('bluebird');
const s3 = new AWS.S3();

function writeToS3(bucket, key, data){
  AWS.config.region = 'us-east-1';
  var s3 = new AWS.S3();
  var params = {
      Bucket : bucket,
      Key : key,
      Body : data,
      ContentType: 'application/json',
      ACL:'public-read'
  }
  s3.putObject(params, function(err, data) {
    if (err) {
        console.log(err, err.stack);
    }
    else {
        console.log(data);
    }
  });
}

exports.handler = function(event, context, callback) {
    var options1 = {
      uri: `https://hackerone.com/hacktivity.json`,
        transform: function (body) {
          return body;
        }
    };
    var options2 = {
      uri: `https://hackerone.com/hacktivity.json?sort_type=latest_disclosable_activity_at&filter=type%3Apublic&range=forever&limit=100`,
        transform: function (body) {
          return body;
        }
    };
    var options3 = {
      uri: `https://haveibeenpwned.com/api/v2/breaches`,
        transform: function (body) {
          return body;
        }
    };

    var request1 = rp(options1);
    var request2 = rp(options2);
    var request3 = rp(options3);

    Bluebird.all([request1, request2, request3])
            .spread(function (response1, response2, response3) {
              writeToS3('bugbrowsercache', 'hacktivity.json', response1);
              writeToS3('bugbrowsercache', 'hacktivityBugReportFinder.json', response2);
              writeToS3('bugbrowsercache', 'breaches.json', response3);
            }).then(() => {
              callback(null);
            });

}