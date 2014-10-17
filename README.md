Faki
========

faki.js is a fake api maker to start your frontend project a lot faster. It also works as a contract between the frontend and the backend.

Its main goal is to quickly create endpoints with data that might be fake, but look relevant.

**THIS ONLY THE FIRST DRAFT. NO CODE HAS BEEN WRITTEN YET**


## Add endpoint

Add fake endpoints with data:

    var faki = require('fake');
    
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
    
    faki.get('pages', '/page', function() {
        return fake.list('page', 10);
    });
    
## POST endpoints:

    faki.post('page', '/page/:slug').then(function() {
        return {
            message: 'updated'
        };
    });
    
## Random values

    faki.get('user', '/user/:guid').then(function() {
        return {
            id: faki.data.id,
            name: faki.data.name,
            gender: faki.random(['male', 'female'])
        };
    });
    
    
