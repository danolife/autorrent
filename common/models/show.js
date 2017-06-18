'use strict';
const _ = require('lodash');

module.exports = function(Show) {
  Show.observe('before save', preprocessor);
};

let preprocessor = function(ctx, next) {
  if (ctx.instance) {
    ctx.instance = replaceDots(ctx.instance);
  } else {
    ctx.data = replaceDots(ctx.data);
  }
  next();
};

let replaceDots = function(obj) {
  if (obj['all_images']) {
    let all_images = obj['all_images'];
    _.each(all_images, function(v, k) {
      all_images[k] = _.mapKeys(v, function(value, key) {
        return _.replace(key, '.', ',');
      })
    });
  }
  return obj;
};
