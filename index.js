var Promise = require('bluebird');
var promisify = require('bluebird-events');
var dgram = require('dgram');

module.exports = Promise.method(function (port, address) {
  var server = dgram.createSocket('udp4');

  var promise = promisify(server, {
    resolve: 'listening'
  });

  server.on('message', function (msg, rinfo) {
    function reply(rmsg) {
      server.send(rmsg, 0, rmsg.length, rinfo.port, rinfo.address);
    }

    var sessionId = msg.readUInt32BE(3);
    var challenge = '1234567';

    if (rinfo.size === 7) {
      // Handshake
      var rmsg = new Buffer(13);
      rmsg.write('\x09', 0);
      rmsg.writeUInt32BE(sessionId, 1);
      rmsg.write(challenge, 5);
      rmsg.write('\x00', 12);
      reply(rmsg);
    } else if (rinfo.size === 15) {
      // Data response
      var rmsgStr = '';
      rmsgStr += '\x00';
      rmsgStr += '\x00\x00\x00\x01';
      rmsgStr += 'splitnum\x00';
      rmsgStr += '\x80\x00';
      rmsgStr += 'hostname\x00example.com\x00';
      rmsgStr += 'gametype\x00DUMMY\x00';
      rmsgStr += 'game_id\x00GS4DUMMYSRV\x00';
      rmsgStr += 'version\x001.0\x00';
      rmsgStr += 'plugins\x00\x00';
      rmsgStr += 'map\x00world\x00';
      rmsgStr += 'numplayers\x000\x00';
      rmsgStr += 'maxplayers\x0020\x00';
      rmsgStr += 'hostport\x0012345\x00';
      rmsgStr += 'hostip\x00127.0.0.1\x00\x00';
      rmsgStr += '\x01\x70\x6C\x61\x79\x65\x72\x5F\x00\x00';
      var rmsg = new Buffer(rmsgStr, 'binary');
      reply(rmsg);
    }
  });

  server.bind(port, address || 'localhost');

  return promise.then(function () {
    return server;
  });
});
