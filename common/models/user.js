module.exports = function(userModel) {
  userModel.getIdentity = (user, provider = 'tvt') => {
    return new Promise((resolve, reject) => {
      let identities = user.identities();

      identities.forEach(identity => {
        if (identity.provider === provider) {
          resolve(identity);
        }
      });

      reject("Couldn't find tvt identity");
    });
  };
};
