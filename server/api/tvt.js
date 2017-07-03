'use strict';
const request = require('request');
const app = require('../server');
const UserModel = app.models.user;

module.exports = {
  getUserInfo: function(user) {
    return new Promise((resolve, reject) => {
      getTvtAccessToken(user)
        .then(function(accessToken) {
          let url = 'https://api.tvshowtime.com/v1/user';
          request(
            {
              url: url,
              qs: {
                access_token: accessToken
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

              let user = JSON.parse(body).user;

              resolve(user);
            }
          );
        })
        .catch(function(err) {
          console.log(err);
        });
    });
  }
};

function getTvtAccessToken(user) {
  return new Promise((resolve, reject) => {
    UserModel.getIdentity(user)
      .then(userIdentity => {
        if (userIdentity.credentials.accessToken) {
          resolve(userIdentity.credentials.accessToken);
        } else {
          reject("Couldn't find access token");
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  });
}
