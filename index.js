var fs = require('fs'),
    spawn = require('child_process').spawn,
    ws = require('websock'),
    socket,
    config = {
        ready: false,
        LiveReload: '1.6',
        applyJSLive: false,
        applyCSSLive: true,
        applyIMGLive: true,
        port: 35728,
        socket: {},
        fileType : [
            '*.php',
            '*.js',
            '*.scss',
            '*.css',
            '*.php',
            '*.html',
            '*.jpg'
        ]
    },
    watched = [],
    cli = require('./cli')(config.fileType),
    HOMEPATH = process.env.PWD;

cli.getFileList('data', function (files) {
    files.forEach(function (file) {
        if (watched[file]) {
            return;
        }
        watched[file] = true;
        fs.watchFile(file, function (curr, prev) {
            if (config.ready) {
                onChange(file, curr, prev);
            }
        });
    });
});

var connect = function (port) {
    port = port || config.port;

    console.log('Simple-livereload is starting...');
    console.log('server port :' + port);

    cli.run();

    console.log("connect server...");
    ws.listen(port, function (socket) {
        console.log(port);
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
};

var setConfig = function (cfg) {
    var i;
    for (i in cfg) {
        config[i] = cfg[i];
        console.log(i);
    }

    console.log(config);
};

var onChange = function (path, current, previous) {
    var regStr = config.fileType.join("$|\\"),
        reg;

    regStr += "$";
    regStr = regStr.replace(/\*/g, "\\");
    regStr = regStr.replace(/\\+/g, "\\");
    reg = new RegExp(regStr, "ig");

    if ( ! reg.exec(path)) {
        return;
    }

    if (current.size != previous.size && current.mtime > previous.mtime) {
      console.log("file has been Changed : " + path);
      if (path.indexOf(".scss") > -1) {
          spawn('compass_lite', [path, path.replace(".scss", ".css")]);
          return;
      }
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

  config.socket.send(message);
};

module.exports.connect = connect;
module.exports.setConfig = setConfig;
