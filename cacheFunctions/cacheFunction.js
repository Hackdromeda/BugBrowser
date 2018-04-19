const AWS = require('aws-sdk');
const http = require("https");
const s3 = new AWS.S3();


function writeToS3(bucket, key, data){
    var s3 = new AWS.S3();
        var params = {
            Bucket : bucket,
            Key : key,
            Body : data
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
    var options = {
        "method": "GET",
        "hostname": [
          "hackerone",
          "com"
        ],
        "path": [
          "programs",
          "search.json"
        ]
      };
      
      var req = http.request(options, function (res) {
        var chunks = [];
      
        res.on("data", function (chunk) {
          chunks.push(chunk);
        });
      
        res.on("end", function () {
          var data = Buffer.concat(chunks);
          writeToS3('bugbrowser', '/data/response.json', data)
        });
      });
      
      req.end();
}