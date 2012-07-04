/**
 * @overview
 *
 * @author 
 * @version 2012/07/04
 */

var config = require('../main');
config.setConfig();
config.on('update', function (obj) {
    console.log(obj);        
});
config.run();

