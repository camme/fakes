var faki = require('../');

faki
    .get('temp', '/test/:id')
    .returns({
        name: faki.data.lorem(2),
        description: faki.data.lorem(20),
        list: faki.list(faki.data.lorem(5), 5, 10),
        gender: faki.random(['male', 'female']),
        data: {
            intro: faki.data.lorem(10),
            tags: faki.list(faki.data.lorem(1), 2, 5)
        }
    });

faki
    .get('temp', '/test')
    .returns({
        list: faki.list('temp', 20)
    });



faki.start(9090);
