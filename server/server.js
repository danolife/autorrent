const loopback = require('loopback');
const boot = require('loopback-boot');
const app = (module.exports = loopback());
const cookieParser = require('cookie-parser');
const session = require('express-session');

// Passport configurators..
const loopbackPassport = require('loopback-component-passport');
const PassportConfigurator = loopbackPassport.PassportConfigurator;
const passportConfigurator = new PassportConfigurator(app);

/*
 * body-parser is a piece of express middleware that
 *   reads a form's input and stores it as a javascript
 *   object accessible through `req.body`
 *
 */
const bodyParser = require('body-parser');

/**
 * Flash messages for passport
 *
 * Setting the failureFlash option to true instructs Passport to flash an
 * error message using the message given by the strategy's verify callback,
 * if any. This is often the best approach, because the verify callback
 * can make the most accurate determination of why authentication failed.
 */
const flash = require('express-flash');

// Load the provider configurations
let parameters = {};
try {
  parameters = require('../parameters.json');
} catch (err) {
  console.error('Please configure autorrent in `parameters.json`.');
  console.error(
    'Copy `parameters.json.template` to `parameters.json` and replace the secret/clientID/clientSecret values with your own.'
  );
  process.exit(1);
}

let config = require('./config.json');
config['tvt-login'] = Object.assign(
  {},
  config['tvt-login'],
  parameters['tvt-login']
);

// -- Add your pre-processing middleware here --

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    let baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      let explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module) app.start();
});

// to support JSON-encoded bodies
app.middleware('parse', bodyParser.json());
// to support URL-encoded bodies
app.middleware(
  'parse',
  bodyParser.urlencoded({
    extended: true
  })
);

// The access token is only available after boot
app.middleware(
  'auth',
  loopback.token({
    model: app.models.accessToken
  })
);

app.middleware('session:before', cookieParser(parameters.secret));
app.middleware(
  'session',
  session({
    secret: parameters.secret,
    saveUninitialized: true,
    resave: true
  })
);

// Initialize passport
passportConfigurator.init();

// We need flash messages to see passport errors
app.use(flash());

passportConfigurator.setupModels({
  userModel: app.models.user,
  userIdentityModel: app.models.userIdentity,
  userCredentialModel: app.models.userCredential
});

config['tvt-login'].session = config['tvt-login'].session !== false;
passportConfigurator.configureProvider('tvt-login', config['tvt-login']);
