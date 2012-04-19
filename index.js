var fs = require('fs'),
    ws = require('websock'),
    socket,
    config = {
        ready: false,
        LiveReload: '1.6',
        applyJSLive: false,
        applyCSSLive: true,
        applyIMGLive: true,
        port: 50072,
        socket: {},
        fileType : [
            '*.php',
            '*.js',
            '*.css',
            '*.php',
            '*.html',
            '*.jpg'
        ]
    },
    cli = require('./cli')(config.fileType),
    HOMEPATH = process.env.PWD,
    files= [];

process.setMaxListeners(0);

cli.getFileList('data', function (files) {
    this.files = files;
    this.files.forEach(function (file) {
        fs.watchFile(file, function (curr, prev) {
            if (config.ready) {
                onChange(file, curr, prev);
            }
        });
    });
});
cli.run();

ws.listen(config.port, function (socket) {
    config.socket = socket;
    console.log( 'Browser: Connected socket (' + socket.version + ')' );

    socket.send( "!!ver:" + config.LiveReload );

    socket.on('message', function ( msg ) {
      console.log( 'Browser: ' + msg );
    });
    socket.on('close', function () {
      console.log( 'Browser: Disconnected');
    });
    config.ready = true;
});

var onChange = function (path, current, previous) {
  if (current.mtime > previous.mtime) {
      sendRefresh(HOMEPATH);
  };
};

var sendRefresh = function (path) {
  var message = JSON.stringify(['refresh', {
    path: path,
    apply_js_live: config.applyJSLive,
    apply_css_live: config.applyCSSLive,
    apply_images_live: config.applyIMGLive
  }]);
  console.log( "Sending 'Refresh' command.." );

  config.socket.send(message);
};

console.log( 'Simple-livereload is starting...' );
