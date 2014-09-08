var freeport = require('freeport');
var spawn = require('child_process').spawn;
var path = require('path');
var app = path.resolve(path.join(__dirname, '../../../samples/server/index.js'));
var server;

module.exports = {
    startServer: function(cb) {
        freeport(function (err, port) {
            if (err) {
                cb(err);
            }
            console.log('Spawn a new server on port %s', port);
            process.env.PORT = port;
            server = spawn('node', [app], {
                stdio: [process.stdin, 'pipe', process.stderr],
                cwd: process.cwd(),
                env: process.env
            });
            server.stdout.on('data', function (data) {
                console.log(data.toString());
                if (/^Magic happens on port/.test(data)) {
                    cb();
                }
            });
        });
    },
    browse: function (location, cb) {
        if (!cb) {
            cb = location;
            location = '/';
        }
        this
            .url(path.join('http://localhost:' + process.env.PORT, location))
            .call(cb);
    },
    stopServer: function (cb) {
        console.log('Kill server');
        server.kill();
        cb();
    }
};
