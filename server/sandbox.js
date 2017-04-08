const  _ = require('lodash');
const moment = require('moment');
const redis = require('redis');
const config = require('./config');
const Starling = require('starling-developer-sdk');
const starlingApiWrapper = require('./starling-api-wrapper');
const persistence = require('./sandboxTokenPersistence');
const debug = require('debug')('app:sandbox');

const EXPIRY_THRESHOLD = 15 * 60 * 1000;

const pullTokensFromConfig = (db) => {
  persistence.setSandboxTokens(db, {access_token: process.env.sandboxAccessToken || config.sandboxAccessToken, refresh_token: process.env.refreshToken || config.refreshToken, token_type: 'Bearer', expires_in: 0});
};

const client = redis.createClient({
  url: process.env.REDIS_URL,
});

const initialiseSandboxTokenStore = (db) => {
  // Check DB
  const tokenStore = persistence.getSandboxTokens(db);
  debug('initialiseSandboxTokenStore :: Existing token store', tokenStore);
  const access_token = tokenStore ? tokenStore['access_token'] : null;
  if (!access_token) {
    debug('initialiseSandboxTokenStore :: creating token store with tokens from app configuration', process.env.sandboxAccessToken || config.sandboxAccessToken, process.env.refreshToken || config.refreshToken);
    pullTokensFromConfig(db);
  }

  keepSandboxTokensFresh(db)
};

const keepSandboxTokensFresh = (db) => {
  // Refresh using DB token immediately
  refresh(db).catch((e) => {
    debug('Refresh token is invalid, trying again after pull from app config', _.get(e, 'response.status'), _.get(e, 'response.data.error'), _.get(e, 'response.data.error_description'));
    pullTokensFromConfig(db);

    // Try refresh using DB token
    refresh(db).catch((err) => {
      console.error('Your refresh tokens (persisted and the one in config) have both been used before, use the developer portal to generate new tokens, put then in the configuration file here and restart. (',
        _.get(err, 'response.status'), _.get(err, 'response.data.error'), _.get(err, 'response.data.error_description'), ')');
    });
  });

  setTimeout(() => keepSandboxTokensFresh(db), EXPIRY_THRESHOLD);
};

const refresh = (db) => {
  const tokenStore = persistence.getSandboxTokens(db);
  const refresh_token = tokenStore ? tokenStore['refresh_token'] : null;
  debug('refresh :: refreshing access token with refresh_token', refresh_token);
  if (!refresh_token) {
    console.error('ERROR: missing refresh token. Update your app configuration with a new refresh token.');
    return ;
  }

  return starlingApiWrapper.refreshAccessToken(refresh_token, 'sandbox')
    .then(response => {
      debug('refresh :: refreshed access token OK', response.data);
      persistence.setSandboxTokens(db, response.data);
    });
};

const start = (app) => {
  debug('Starting sandbox app...');

  let db;
  debug('Initialising sandbox token store...');
  const dbRef = persistence.initialise((readyDb) => {
    db = readyDb;
    debug('Sandbox token store db ready');
    initialiseSandboxTokenStore(db);
    debug('Sandbox app started.');
  });

  const withDb = (req, res, thunk) => {
    if (db) {
      thunk(req, res);
    } else {
      // DB not ready yet
      res.status(503).end();
    }
  };

  const getAccessToken = (db) => persistence.getSandboxTokens(db)['access_token'];
  const starlingClient = new Starling({apiUrl: config.sandboxApi});

  app.get('/api/sandbox/customer', (req, res) => {
    starlingApiWrapper.customer(req, res, starlingClient, getAccessToken(db));
  });
  app.get('/api/sandbox/balance', (req, res) => starlingApiWrapper.balance(req, res, starlingClient, getAccessToken(db)));
  app.get('/api/sandbox/ping', (req, res) => {
    console.log('called');
      client.get('hardcoded', (err, resp) => {
        console.log(resp);
        res.json(resp);
      });
  });
  app.get('/api/sandbox/transactions', (req, res) =>{
  starlingApiWrapper.transactions(req, res, starlingClient, getAccessToken(db)).
  then(function(resp){
    client.setex('hardcoded', 60*60*24, 'false');
    console.log('transactions');
    var list = _.get(resp, 'data._embedded.transactions', []);

    var promises = [];
    for(var i = 0; i < list.length; i+= 1){
      promises.push(  starlingApiWrapper.transaction(starlingClient, getAccessToken(db), list[i]['id']));
    }
    Promise.all(promises).then(function(res){
      for(var i = 0; i < res.length; i += 1){
        res[i] = _.get( res[i], 'data', [])
      }
      client.setex('getAll', 60*60*24, JSON.stringify(res));
    });

  });
  client.get('getAll', (err, resp) => {
    try{
      res.send(JSON.parse(resp || '[]'));
    }
    catch(err){
      res.send([]);
    }
  });
});
  app.post('/api/sandbox/webhook', (req, res) => {
    console.log('Something received');
      console.log(req.body);
    starlingApiWrapper.transactions(req, res, starlingClient, getAccessToken(db)).
    then(function(resp){
      client.setex('hardcoded', 60*60*24, 'false');
      console.log('Received webhook');
      var list = _.get(resp, 'data._embedded.transactions', []);
      var promises = [];
      for(var i = 0; i < list.length; i+= 1){
        promises.push(  starlingApiWrapper.transaction(starlingClient, getAccessToken(db), list[i]['id']));
      }
      Promise.all(promises).then(function(res){
             console.log('Updated via webhook');
             for(var i = 0; i < res.length; i += 1){
               res[i] = _.get( res[i], 'data', [])
             }
            client.setex('getAll', 60*60*24, JSON.stringify(res));
            client.setex('hardcoded', 60*60*24, 'true');
      });
      res.json(_.get(resp, 'data._embedded.transactions', []))
  });
  if(req.body.content.reference !== 'SAVING'){
    if(req.body.content.type === 'TRANSACTION_FASTER_PAYMENT_IN'){
      client.get('IN_Income_Savings', (err, resp) => {
        console.log('IN_Income_Savings')
        if(Number(resp)){
          starlingApiWrapper.payment(starlingClient, getAccessToken(db), '' + (req.body.content.amount * Number(resp3)/100 ));
        }
      });
    }
    else if(req.body.content.type === 'TRANSACTION_FASTER_PAYMENT_OUT'){
      var tax = 0;
      client.get('OUT_RoundUp', (err2, resp2) => {
        client.get('OUT_PersonalTax', (err3, resp3) => {
          console.log('OUT_PersonalTax');
          if(Number(resp2)){
            tax += Math.ceil(req.body.content.amount) - req.body.content.amount;
          }
          if(Number(resp3)){
            tax += (req.body.content.amount * Number(resp3)/100);
          }
          console.log('Tax: ' + tax);
          if(tax){
            starlingApiWrapper.payment(starlingClient, getAccessToken(db), '' + tax);
          }
        });
      });
    }

  }
});
}
module.exports = { start };
