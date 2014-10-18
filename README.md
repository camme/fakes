Faki
========

faki.js is a fake api maker to start your frontend project a lot faster. It also works as a contract between the frontend and the backend.

Its main goal is to quickly create endpoints with data that might be fake, but look relevant.

When an endpoint is created, and the data for that endpoint had been dynamically created as well, the same data will be returned each time the endpoint is called.

**THIS IS ONLY A VERY EARLY ALPHA**


## Add endpoint

Add fake endpoints with data:

    var faki = require('fake');

    // Create a new type of data, with its endpoint name and its data structure
    faki.get('page', '/page/:slug')
        
        // This is what the endpoint will return
        .returns({
            id: faki.data.id,
            title: faki.data.lorem(3),
            intro: faki.data.lorem(50),
            description: faki.data.lorem(200, 3),
            images: faki.list(faki.data.image, 5),
            tags: faki.list(faki.data.tag, 5, 10)
        })
        
        // If this is used, it will create as many entries as provided when the server starts.
        // If it is omitted the fake API will just create content dynamically whenever its called.
        .create(10);
      
    // Start the fake API server
    faki.start(8080);   
    
    
## Add endpoint that list data type
    
This will create a list of pages, as defined above. Thats why we give it an ID

    faki.get('pages', '/page', function() {
        return faki.list('page', 10);
    });
    
    
## POST endpoints:

You can create post, put and delete endpoints and what they will return.

**We should also build a mechanism that warns if the incoming request doesnt have the correct data**

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
            events: faki.list({
                title: faki.data.lorem(10),
                startDate: faki.data.date,
                sponsors: faki.list({
                    name: faki.data.lorem(2),
                    tags: faki.list(faki.data.tag, 2, 5)
                }, 5)
            }, 10, 30),
            title: faki.data.lorem(10),
            geo: faki.data.geo
        };
    });
    