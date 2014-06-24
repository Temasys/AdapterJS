# AdapterJS

> Creating a common API for WebRTC in the browser

[![browser support](https://ci.testling.com/Temasys/AdapterJS.png)
](https://ci.testling.com/Temasys/AdapterJS)

## Setup

- Install or update to the latest version of node and npm
- Install `grunt-cli` (See: http://gruntjs.com/getting-started)
- Run `npm install` to install dev dependencies.
- Run `npm install -g browserify` and `npm install -g testling` (might require sudo) to install the necessary tools to test locally
- Run `npm start` to start a local webserver to be able access the demo and doc folders (WebRTC won't work from your local file-system). This will popup Chrome (Mac). You can configure a different browsers in the `start.sh` file.

## Development

- Run `npm test` to execute jshint and run the tests in your local Chrome (Mac). You can configure this in the `test.sh` file.
- Run `grunt jshint` to run jshint on its own.
- Run `grunt publish` to create production version in `publish` folder

## Folders

### publish

The production version of the library and a minified copy of it

### source

The adapter.js library development file

### tests

Tape tests
