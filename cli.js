var CLI = function(fileType) {
    var spawn = require('child_process').spawn,
        EventEmitter = require('events').EventEmitter,
        _cliEvent = new EventEmitter(),
        _types = [
            '*.js',
            '*.css',
            '*.html'
        ],
        executeFlag = true,
        init,
        _typeCount = 0,
        _fileList = [],
        _findFileEvent,
        _getFileListEvent,
        _mergeTypeEvent;

    _mergeTypeEvent = function(fileType) {
        if (typeof fileType === "object") {
            _types = fileType;
        }
    };

    _findFileEvent = function () {
        _types.forEach(function (type) {
            var findCli = spawn('find', ['-name', type]);

            findCli.stdout.on('data', function (data) {
                //console.log('stdout: ' + data.toString());
                _fileList = _fileList.concat(data.toString().split("\n"));
            });
            findCli.stderr.on('data', function (data) {
                //console.log('stderr: ' + data);
                _typeCount ++;
            });
            findCli.on('exit', function (code) {
                //console.log('ps process exited with code ' + code);
                //console.log(_fileList);
                _typeCount ++;
                if (_typeCount >= _types.length && executeFlag) {
                    _cliEvent.emit('data');
                    _cliEvent.removeAllListeners('data')
                    executeFlag = false;
                }
            });
        });
    };

    _getFileListEvent = function(typeStatus, callback) {
        _cliEvent.on(typeStatus, function () {
            callback(_fileList, this);
        });
    };

    init = function () {
       var types = arguments[0];
       _mergeTypeEvent(types);
       _findFileEvent();
    };

    init(fileType);

    return {
        run: _findFileEvent,
        mergeType: _mergeTypeEvent,
        getFileList: _getFileListEvent
    };
};

module.exports = CLI;
