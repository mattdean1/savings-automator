const config = require('./example-app-config');
const Starling = require('starling-developer-sdk');
const starlingApiWrapper = require('./starling-api-wrapper');
const start = (app) => {
  const starlingClient = new Starling({apiUrl: config.sandboxApi});
  app.use('/api/sandbox', starlingApiWrapper.sandboxAccessTokenMiddleware);
  app.get('/api/sandbox/transactions', (req, res) => starlingApiWrapper.transactions(req, res, starlingClient, req.session.accessToken));
  app.get('/api/sandbox/balance', (req, res) => starlingApiWrapper.balance(req, res, starlingClient, req.session.accessToken));
  app.get('/api/sandbox/customer', (req, res) => starlingApiWrapper.customer(req, res, starlingClient, req.session.accessToken));
};
module.exports = { start };
