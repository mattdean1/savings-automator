
<p align="center">
    <img height="180" width="180" src="https://www.starlingbank.com/static-files/developer-portal/github/starter-web.png">
</p>

<h1 align="center">
  <a href="http://developer.starlingbank.com/get-started">Starling Developers</a>
  <br>Web Starter Kit
</h1>


This project contains a sample web application that integrates with the Starling Bank API to retrieve a customer's transaction history.
The application is comprised of a simple REST api written in javascript using nodejs with express.
The web UI is a single-page application (SPA) that makes use of React.

Looking for the [Mobile Starter Kit](https://github.com/starlingbank/developer-api-mobile-app-starter) instead?

## Getting Started
Please also take a look at the higher-level [Getting Started Guide](http://developer.starlingbank.com/get-started) on our site, which covers usage of our API as a whole.

### Prerequisites

The only prerequisite is [Node.js](https://nodejs.org). The best way to install Node.js is with [nvm](https://github.com/creationix/nvm).

### Installation

From the root of the project, install dependencies as follows. Use either the `yarn` or `npm` package manager.

```bash
yarn install
```

####Compile the source code

```bash
yarn run build
```

####Start the application

```bash
node server/main.js
```

This will serve the client application on `localhost:8888` using the default configuration.

### Configuration

You must register your application on our [Starling Developers](https://developer.starlingbank.com/get-started) site
 to obtain a `client_id` and `client_secret`. The `client_id` and `client_secret` should then be configured in the `server/config.json` file.
 The redirect URL registered in the developer portal must match the configured URL in this application.

####Production
The `config.json` file will look like this for production
```JSON
{
  "clientId": "<your client id>",
  "clientSecret": "<your client secret>",
  "cookieSecret": "21e361d0-ff2c-4763-a084-1032f2103ce8",
  "redirectUri": "http://localhost:8888/oauth",
  "partnerApiBase": "https://api.starlingbank.com",
  "oauthBase": "https://oauth.starlingbank.com"
}
```
Simply replace `<your client id>` and `<your client secret>` with your `client_id` and `client_secret` for your application.

Then start the app in production using the following command
```bash
node server/main.js
```

####Sandbox
For the sandbox environment use the specialized config file, `config_sandbox.json`, setup as follows:
```JSON
{
  "clientId": "<your client id>",
  "clientSecret": "<your client secret>",
  "cookieSecret": "21e361d0-ff2c-4763-a084-1032f2103ce8",
  "partnerApiBase": "https://api.starlingbank.com",
  "initialRefresh": "<refresh token>"
}
```
Where the `<refresh token>` is a sandbox customer's token from your [developer account](https://developer.starlingbank.com/sandbox).

You can then start the application in the sandbox environment
```bash
node server/sandbox/sandbox.js
```

####Personal Access
This starter kit can also be used to access your own Starling Bank data, right out of the box. This can be achieved using `config_personal.json`.
```JSON
{
  "cookieSecret": "21e361d0-ff2c-4763-a084-1032f2103ce8",
  "partnerApiBase": "https://api.starlingbank.com",
  "initialRefresh": "<personal access token>"
}
```
Where the `<personal access token>` is your personal access token, which can be obtained from your [developer account](https://developer.starlingbank.com/token) after linking it to your customer account.

You can then start the application for use with personal access tokens
```bash
node server/sandbox/sandbox.js
```

## Mobile Starter Kit Users

Those using the [React Native mobile starter kit](https://github.com/starlingbank/developer-api-mobile-app-starter) need to also
 clone this repo and follow the installation instructions above, while replacing the contents of the `config.json` file with that given in the mobile starter kit [README.md](https://github.com/starlingbank/developer-api-mobile-app-starter)   
