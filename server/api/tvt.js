'use strict';
const request = require('request');

module.exports = {
  getUserInfo: function() {
    return new Promise((resolve, reject) => {
      let url = 'https://api.tvshowtime.com/v1/user';
      request(
        {
          url: url,
          qs: {
            access_token: 'afa50306517a2b77e0aa8ba3a90be37b'
          }
        },
        function(error, response, body) {
          if (error) {
            console.log('error:', error);
            reject(error);
          }
          console.log(
            'Status: %s, URL: %s',
            response && response.statusCode,
            url
          );
          resolve(body);
        }
      );
    });
  }
};
