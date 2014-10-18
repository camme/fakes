var faki = require('../');

faki
    .get('temp', '/test/:id')
    .returns({
        name: faki.faker.name.findName,
        description: faki.faker.lorem.sentence(20),
        list: faki.list(faki.data.lorem(5), 5, 10),
        image: faki.faker.image.imageUrl
    });

faki
    .get('temp', '/test')
    .returns({
        list: faki.list('temp', 20)
    });



faki.start(9090);
