var faki = require('../');
var faker = faki.faker;

var page = faki
    .get('/page/:id')
    .returns({
        guid: faki.data.guid,
        avatar: faki.faker.random.avatar_uri,
        name: faki.faker.name.findName,
        description: faki.faker.lorem.sentence(20),
        list: faki.list(faki.data.lorem(5), 5, 10),
        image: faki.faker.image.imageUrl,
        gender: faki.random(['male', 'female']),
        foo: "static",
        tree: {
            name: faki.faker.name.findName,
            list: faki.list({ 
                foo: faki.faker.name.findName, 
                tags: faki.list(faki.faker.lorem.words(1), 5)
            }, 1, 4)
        },
    })
    .cache(false);

faki.get('/pages')
    .returns({
        list: faki.list(page, 20)
    });

faki
    .get('/menu')
    .returns({
        list: faki.list(faki.link(page), 5)
    });



faki.start(9090);


