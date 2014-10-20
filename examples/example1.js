var faki = require('../');

// Create a new type of data, with its endpoint name and its data structure
faki.get('/page/:slug')

    // This is what the endpoint will return
    .returns({
        guid: faki.data.guid,
        title: faki.faker.lorem.sentence(3),
        intro: faki.faker.lorem.sentence(10),
        description: faki.faker.lorem.paragraphs(2),

        // This will randomize a list fo cats. Faker will give us the same url for each entry
        // but the images are randomized
        images: faki.list(faki.faker.image.cats, 5)
    });

// Start the fake API server
faki.start(8080);   

