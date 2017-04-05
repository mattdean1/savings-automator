const config = require('./config');
const Starling = require('starling-developer-sdk');
const starlingApiWrapper = require('./starling-api-wrapper');
const start = (app) => {
  const starlingClient = new Starling();
  app.get('/api/my/transactions', (req, res) => starlingApiWrapper.transactions(req, res, starlingClient, config.personalAccessToken));
  app.get('/api/my/balance', (req, res) => starlingApiWrapper.balance(req, res, starlingClient, config.personalAccessToken));
  app.get('/api/my/customer', (req, res) => starlingApiWrapper.customer(req, res, starlingClient, config.personalAccessToken));
};
module.exports = { start };
