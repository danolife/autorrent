'use strict';
const request = require('request');
const app = require('../server');

module.exports = {
  getUserInfo: function(req) {
    return new Promise((resolve, reject) => {
      getTvtAccessToken(req)
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

function getCurrentUser(req) {
  let UserIdentityModel = app.models.userIdentity;
  let userId = req.accessToken.userId;
  return new Promise((resolve, reject) => {
    UserIdentityModel.findOne({ user: userId })
      .then(function(userIdentity) {
        if (userIdentity) {
          resolve(userIdentity);
        } else {
          reject("Couldn't find user identity");
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  });
}

function getTvtAccessToken(app, req) {
  return new Promise((resolve, reject) => {
    getCurrentUser(app, req)
      .then(function(userIdentity) {
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
