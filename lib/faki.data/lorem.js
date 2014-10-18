module.exports = function(register) {

    var data = 'Vestibulum id ligula porta felis euismod semper. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Nullam quis risus eget urna mollis ornare vel eu leo. Etiam porta sem malesuada magna mollis euismod. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.';

    var words = data.split(' ');

    register('lorem', function(amountOfWords, max) {
    
        return function() {

            var startIndex = Math.round(Math.random() * (words.length - amountOfWords)) + amountOfWords;
            if (startIndex < 0) startIndex = 0;
            var sentence = words.slice(startIndex, startIndex + amountOfWords).join(' ');
            sentence = (sentence[0] + "").toUpperCase() + sentence.substring(1);
            return sentence;
            
        };

    });

}
