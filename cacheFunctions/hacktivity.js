const AWS = require('aws-sdk');
const https = require('https');
const rp = require('request-promise');
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
      rp({
        uri: `https://hackerone.com/hacktivity.json`,
        transform: function (body) {
          return body;
        }
      }).then((data) => {
        writeToS3('bugbrowsercache', 'hacktivity.json', data);
        callback(null); //callback(response.StatusCode);
      }).catch((error) => {
        console.log(error);
      });
}