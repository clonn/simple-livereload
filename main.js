var fs = require('fs');
var path = require('path');
var _watchedFiles = [];

//module.exports.reverseFile = reverseFile function (dirname) {
function reverseFile (dirname) {
    var dirname = dirname || __dirname;
    fs.readdir(dirname, function (err, files) {

        files.forEach(function (file, idx) {
            var fullpath = path.join(dirname, file);
            fs.stat(fullpath, function (err, stats) {

                if (stats.isDirectory()) {
                    reverseFile(fullpath);
                }
                else {
                    if (fullpath.match('.swp')) {
                        return;
                    }
                    watchFile(fullpath);
                }

            });
        });
    });
}

function watchFile(fullpath) {

    var o = fs.watchFile(fullpath, {presistent: true}, function (type, filename) {

            /*
        switch (type) {
            case 'rename':
                fs.unwatchFile(fullpath);
                //watchFile(fullpath);
                break;
            default:
                console.dir(type);
                console.dir(filename);
                break;
        }
        */
    });
    o.on('change', function (curr, prev) {
        if (+curr.mtime !== +prev.mtime) {
            console.log(fullpath + ': File modified');

        }
    });

}

reverseFile(__dirname);
