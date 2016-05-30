var assert = require('chai').assert;
var gamedig = require('gamedig');

var gs4DummyServer = require('..');

function generatePort() {
  return parseInt(Math.random() * 10000, 10);
}

describe('gs4DummyServer', function () {
  it('binds a server', function () {
    var port = generatePort();

    return gs4DummyServer(port).then(function (server) {
      server.close();
    });
  });

  it('takes a port', function () {
    var port = generatePort();

    return gs4DummyServer(port).then(function (server) {
      var address = server.address();
      assert(address.port === port, 'ports do not match');
      server.close();
    });
  });

  it('takes an address', function () {
    var port = generatePort();
    var ip = '127.123.123.123';

    return gs4DummyServer(port, ip).then(function (server) {
      var address = server.address();
      assert(address.address === ip, 'addresses do not match');
      server.close();
    });
  });

  it('responds to queries', function (done) {
    // Increase timeout for querying
    this.timeout(5000);

    gs4DummyServer().then(function (server) {
      var address = server.address();

      gamedig.query({
        type: 'minecraft',
        host: address.address,
        port: address.port
      }, function (state) {
        if (state.error) {
          throw new Error(state.error);
        }

        server.close();
        done();
      });
    });
  });
});
