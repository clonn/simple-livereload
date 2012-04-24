#Simple Livereload#

livereload on [node](http://nodejs.org) version, and make it very simple, easy using. Simple livereload is under on linux base, and Chrome browser only. 

##Installation##

    npm install -g simple-livereload

##Quick Start##

simple-livereload supports command line, and you have to set port parameter, if you need.

Before you execute simple-livereload, please switch to your folder, then execute cli below,

    simple-livereload port

Another way is that create a server and you can change watch files setting,

    var sp = require('simple-livereload'),
        config;

    config = {
        port: 8888,
        fileType: [
            '*.jpg',
            '*.rb',
            '*.php'
        ]
    };
    sp.setConfig(config);
    sp.connect();

Of course, after initial server, open your chorme browser and set config of livereload on chrome browser. Enjoy it.

##Requirement##

Server: linux

Client: [Chrome browser](https://www.google.com/chrome)

Chrome extension: [livereload](https://chrome.google.com/webstore/detail/jnihajbhpnppcggbcgedagnkighmdlei)

##Reference##

[livereload Github](https://github.com/mockko/livereload)

[node-livereload](https://github.com/josh/node-livereload)

## License 

(The MIT License)

Copyright (c) Caesar Chi  &lt;clonncd@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
