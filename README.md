# gs4-dummy-server

A dummy GS4 query server for testing.

## Usage

Install the module:

```
npm install gs4-dummy-server --save
```

Then, import the module and call it. For example:

```js
var gs4DummyServer = require('gs4-dummy-server');

gs4DummyServer().then(function (server) {
  // Retrieve the address of the server
  // Example: {address: '127.0.0.1', family: 'IPv4', port: 21943}
  var address = server.address();

  // Do something to test against the server

  // Close the server once finished
  server.close();
});
```

## Options

gs4-dummy-server takes two optional arguments:

- **port** - The port to have the server listen on (default is a random port)
- **address** - The address to have the server listen on (default is `localhost`)
