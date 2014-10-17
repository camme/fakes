Faki
========

faki.js is a fake api maker to start your frontend project a lot faster. It also works as a contract between the frontend and the backend.

Its main goal is to quickly create endpoints with data that might be fake, but look relevant.

**THIS IS ONLY THE FIRST DRAFT. NO CODE HAS BEEN WRITTEN YET**


## Add endpoint

Add fake endpoints with data:

    var faki = require('fake');
    
    // Create a new type of data, with its endpoint name and its data structure
    faki.get('page', '/page/:slug', function() {
        return {
            id: faki.data.id,
            title: faki.data.lorem(3),
            intro: faki.data.lorem(50),
            description: faki.data.lorem(200, 3),
            images: fake.list(fake.data.image, 5),
            tags: fake.list(fake.data.tag, 5, 10)
        };
    });
    
    // Start the fake API server
    faki.start(8080);
    
Or, as a promise:

    faki.get('page', '/page/:slug').then(function() {
        return {
            id: faki.data.id,
            title: faki.data.lorem(3),
            intro: faki.data.lorem(50),
            description: faki.data.lorem(200, 3),
            images: fake.list(fake.data.image, 5),
            tags: fake.list(fake.data.tag, 5, 10)
        };
    });
    
    
## Add endpoint that list data type
    
This will create a list of pages, as defined above. Thats why we give it an ID

    faki.get('pages', '/page', function() {
        return fake.list('page', 10);
    });
    
## POST endpoints:

You can create post, put and delete endpoints and what they will return.

** We should also build a mechanism that warns if the incoming request doesnt have the correct data **

    faki.post('page', '/page/:slug').then(function() {
        return {
            message: 'updated'
        };
    });
    
## Random values

Random values can be added as an array, and the random function will pick one from the array

    faki.get('user', '/user/:guid').then(function() {
        return {
            id: faki.data.id,
            name: faki.data.name,
            gender: faki.random(['male', 'female'])
        };
    });
    
## Deep objects
    
You can also create more complex objects like this:
    
    faki.get('location', '/location/:id').then(function() {
        return {
            id: faki.data.id,
            events: fake.list({
                title: faki.data.lorem(10),
                startDate: faki.data.date,
                sponsors: fake.list({
                    name: faki.data.lorem(2),
                    tags: fake.list(fake.data.tag, 2, 5)
                })
            }),
            title: faki.data.lorem(10),
            geo: faki.data.geo
        };
    });
    