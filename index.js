var explorer = require('./main'),
    ws = require('websock'),
    config = explorer.config;

// initial function.
var start = function () {

    // watch files, and register update callback event.
    explorer.on('update', onChange);
    // execute explorer.
    explorer.run();

    port = port || config.port;

    // show system log message.
    console.log('Simple-livereload is starting...');
    console.log('server port :' + port);
    console.log("connect server...");

    // create Websocket server.
    createServer();

};

// Create WebSocket server, the port setting is from config.js file.
var createServer = function () {
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

  config.socket.send(message);
};

if (!config.port) {
    throw 'Port is not defined.';
}
connect(config.port);
