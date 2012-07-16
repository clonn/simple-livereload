var watcher = require('./watcher'),
    ws = require('websock'),
    config = require('./config');


// Create WebSocket server, the port setting is from config.js file.
var createServer = function (port) {
    // Set websocket server.
    ws.listen(port, function (socket) {
        config.socket = socket;

        socket.send( "!!ver:" + config.LiveReload );

        socket.on('message', function ( msg ) {
            console.log( 'Browser: ' + msg );
        });

        socket.on('close', function () {
            console.log( 'Browser: Disconnected');
        });

        config.ready = true;
    });
};

// file update event, have to registed before executed start function.
// onChange will call websocket event to client message.
var onChange = function (obj) {

    var path = obj.fullpath,
        current = obj.curr,
        previous = obj.prev;

    sendRefresh(path);
};

// Send message to Client who linked to websocket server.
var sendRefresh = function (path) {
  var message = JSON.stringify(['refresh', {
    path: path,
    apply_js_live: config.applyJSLive,
    apply_css_live: config.applyCSSLive,
    apply_images_live: config.applyIMGLive
  }]);

  if (!config.socket) {
      return;
  }

  config.socket.send(message);
};

/**
 *
 * module export
 * setPort
 * setup port number.
 *
 */
module.exports.setPort = function (port) {
    config.port = port;
    return config;
};

// initial function.
module.exports.start = start = function () {

    var port = config.port;

    port = parseInt(port, 10);

    // watch files, and register update callback event.
    watcher.on('update', onChange);
    // execute watcher.
    watcher.run();


    // show system log message.
    console.log('Simple-livereload is starting...');
    console.log('server port :' + port);
    console.log("connect server...");

    // create Websocket server.
    createServer(port);

};

