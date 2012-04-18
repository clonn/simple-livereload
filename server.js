var fs = require('fs'),
    config = {
        fileType : [
            '*.js',
            '*.css',
            '*.php',
            '*.html',
            '*.jpg'
        ]
    },
    cli = require('./cli')(config.fileType),
    files= [];

process.setMaxListeners(0);
        
cli.getFileList('data', function (files) {
    this.files = files; 
    this.files.forEach(function (file) {
        fs.watchFile(file, function (curr, prev) {
            console.dir(prev);
        });
    });
});
cli.run();
