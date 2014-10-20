Faki
========

faki.js is a fake api maker to start your frontend project a lot faster. It also works as a contract between the frontend and the backend.

Its main goal is to quickly create endpoints with data that might be fake, but look relevant.

When an endpoint is created, and the data for that endpoint had been dynamically created as well, the same data will be returned each time the endpoint is called.

It uses [faker](https://github.com/FotoVerite/Faker.js) to creates its fake data (but it wraps all faker methods to combine its mechanics, but you shouldnt notice any effect of that).


**THIS IS ONLY A VERY EARLY ALPHA**

## Add endpoint

Add fake endpoints with data:

    var faki = require('faki');

    // Create a new type of data, with its endpoint name and its data structure
    var page = faki.get('/page/:slug')
        
        // This is what the endpoint will return
        .returns({
            guid: faki.data.guid,
            title: faki.faker.lorem.sentence(3),
            intro: faki.faker.lorem.sentence(10),
            description: faki.faker.lorem.paragraphs(2)
        });
      
    // Start the fake API server
    faki.start(8080);   
    
    
## Add endpoint that list data type
    
This will create a list of pages, as defined above.

    faki.get('/page')
        .returns({
            list: faki.list(page, 10)
        })
    
    
## Add endpoint with list of links
    
This will create a list of links to entries

    faki.get('/menu')
        .returns({
            list: faki.list(faki.link(page), 10)
        })
    
    
## POST endpoints (THIS IS NOT IMPLEMENTED YET):

You can create post, put and delete endpoints and what they will return.

**We should also build a mechanism that warns if the incoming request doesnt have the correct data**

    faki.post('/page/:slug')
        .returns({
            message: 'updated'
        };
    
    
## Random values

Random values can be added as an array, and the random function will pick one from the array

    var user = faki.get('/user/:guid')
        .returns({
            id: faki.data.guid,
            name: faki.faker.name.findName,
            gender: faki.random(['male', 'female'])
        });

    
## Deep objects (THIS EXAMPLE ISNT IMPLEMENTED YET)
    
You can also create more complex objects like this:
    
    faki.get('location', '/location/:id')
        .returns({
            id: faki.data.id,
            events: faki.list({
                title: faki.faker.lorem.sentence(1),
                sponsors: faki.list({
                    name: faki.data.lorem(2),
                    tags: faki.list(faki.data.tag, 2, 5)
                }, 5)
            }, 10, 30),
            title: faki.data.lorem(10),
            geo: faki.data.geo
        });
    
