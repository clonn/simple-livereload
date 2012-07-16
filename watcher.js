var fs = require('fs'),
    config = require('./config'),
    configFolderPath = process.cwd(),
    vm = require('vm'),
    path = require('path');

function reverseFile (dirname) {
    var dirname = dirname || configFolderPath;
    fs.readdir(dirname, function (err, files) {

        files.forEach(function (file, idx) {
            var fullpath = path.join(dirname, file),
                executeFlag = true;

            fs.stat(fullpath, function (err, stats) {

                if (stats.isDirectory()) {
                    reverseFile(fullpath);
                }
                else {
                    config.excludeFile.forEach(function (fp, idx) {
                        if (fullpath.match(fp)) {
                            executeFlag = false;
                            return;
                        }
                    });

                    if (!executeFlag) {
                        return;
                    }

                    config.includeFile.forEach(function (fp, idx) {
                        if (fullpath.match(fp)) {
                            watchFile(fullpath);
                            return;
                        }
                    });
                }

            });
        });
    });
}

function watchFile(fullpath) {

    fs.watchFile(fullpath, {presistent: true}, function (curr, prev) {

        if (+curr.mtime !== +prev.mtime) {
            console.log(fullpath + ': File modified');
            module.exports.fire('update', {
                fullpath: fullpath,
                curr: curr,
                prev: prev
            });

        }
    });

}

/**
  * Set export instances, and set setter.
  */

module.exports.callbacks = [];

module.exports.on = function (event, cb) {
    if (this.callbacks[event]) {
        console.log('this event is register');
        return;
    }

    this.callbacks[event] = cb;
}

module.exports.fire = function (event, obj) {
    if (this.callbacks[event]) {
        this.callbacks[event].call(this, obj);
    }
};

module.exports.setConfig = function (path) {

        configFolderPath = path || configFolderPath;
        console.log('Setup => Loading Path :' + configFolderPath);

        var configFile = 'config.js',
            encode = 'utf8',
            src;

        try {
            src = fs.readFileSync(configFolderPath + '/' + configFile, encode);
            vm.runInNewContext(config, src, configFile);
        } catch (e) {

        }

};

module.exports.run = function () {
    console.log('Start Watching path is :' + configFolderPath);
    reverseFile(configFolderPath);
};

module.exports.config = config;
module.exports.folderPath = configFolderPath;
