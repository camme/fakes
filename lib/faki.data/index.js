var path = require('path');
var walk = require('fs-walk');

var thisFile = path.join(__dirname, "index.js");

var methods = {};

function register(name, f) {
    
    if (methods[name]) {
        throw new Error('method already exists');
    }

    methods[name] = f;

}

walk.walkSync(__dirname, function(basedir, filename, stat) {

    if (!stat.isDirectory()) {

        var file = path.join(basedir, filename);
        
        // exclude this file
        if (file !== thisFile) {
            require(file)(register);
        }
    }

});

module.exports = methods;
