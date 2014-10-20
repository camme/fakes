var uuid = require('node-uuid');

module.exports = function(register) {

    register('guid', function(amountOfWords, max) {
    
        return function() {
            return uuid.v4();
        };

    });

}
