'use strict';
const api = require('../api/tvt');

module.exports = function(app) {
  app.get('/getUserProfile', function(req, res) {
    api
      .getUserInfo(req)
      .then(function(user_info) {
        res.send(user_info);
      })
      .catch(function(err) {
        console.log(err);
      });
  });
};
