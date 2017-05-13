import { Meteor } from 'meteor/meteor';
import '../imports/api/tasks.js';
var cheerio = require('cheerio');

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({
  extratorrentSearch: function(qs) {
    $ = cheerio.load(Meteor.http.get("http://extratorrent.cc/search/?search="+qs+"&s_cat=&pp=&srt=seeds&order=desc").content);
    let link = $('table.tl tr.tlr').first().find('td').first().find('a').first().attr('href');
    if (link) {
      return ('http://extratorrent.cc'+link);
    }
    return null;
  }
})
