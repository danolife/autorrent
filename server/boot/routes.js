const tvtApi = require('../api/tvt');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

module.exports = function(app) {
  let UserModel = app.models.user;
  app.get('/getUserProfile', ensureLoggedIn('/auth/tvt'), function(req, res) {
    let userId = req.accessToken.userId;

    UserModel.findOne({ id: userId, include: ['identities'] }).then(user => {
      // If we already have an username, we do not need to call TVT API
      if (user.username.indexOf('undefined') === -1) {
        return res.redirect('/');
      }

      tvtApi
        .getUserInfo(req)
        .then(userInfo => {
          user.username = userInfo.name;

          let identities = user.identities();
          identities.forEach(identity => {
            if (identity.provider === 'tvt') {
              identity.profile = userInfo;
              identity.save();
            }
          });

          user.save();

          return res.redirect('/');
        })
        .catch(err => {
          console.error(err);
          return res.redirect('/');
        });
    });
  });
};
