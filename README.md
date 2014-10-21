Fakes
========

fakes.js is a fake api maker to start your frontend project a lot faster. It also works as a contract between the frontend and the backend.

Its main goal is to quickly create endpoints with data that might be fake, but look relevant.

When an endpoint is created, and the data for that endpoint had been dynamically created as well, the same data will be returned each time the endpoint is called.

It uses [faker](https://github.com/FotoVerite/Faker.js) to creates its fake data (but it wraps all faker methods to combine its mechanics, but you shouldnt notice any effect of that).


**THIS IS ONLY AN EARLY ALPHA**

## Add endpoint

Add fake endpoints with data:

    var fakes = require('fakes');
    var faker = fakes.faker;

    // Create a new type of data, with its endpoint name and its data structure
    var page = fakes.get('/page/:slug')
        
        // This is what the endpoint will return
        .returns({
            guid: fakes.data.guid,
            title: faker.lorem.sentence(3),
            intro: faker.lorem.sentence(10),
            description: faker.lorem.paragraphs(2)
        });
      
    // Start the fake API server
    fakes.start(8080);   
    
    
## Add endpoint that list data type
    
This will create a list of pages, as defined above.

    var pageList = fakes.get('/page')
        .returns({
            list: fakes.list(page, 10)
        })
    
## Make the endpoint always generate new data 

    // Create a new type of data, with its endpoint name and its data structure
    var page = fakes.get('/page/:slug')
        
        // This is what the endpoint will return
        .returns({
            guid: fakes.data.guid,
            title: faker.lorem.sentence(3),
            intro: faker.lorem.sentence(10),
            description: faker.lorem.paragraphs(2)
        })
      
        // Dont cache anything
       .cache(false);

## Add endpoint with list of links
    
This will create a list of links to entries

    fakes.get('/menu')
        .returns({
            list: fakes.list(fakes.link(page), 10)
        })
    
    
## POST endpoints (THIS IS NOT IMPLEMENTED YET):

You can create post, put and delete endpoints and what they will return.

**We should also build a mechanism that warns if the incoming request doesnt have the correct data**

    fakes.post('/page/:slug')
        .returns({
            message: 'updated'
        };
    
    
## Random values

Random values can be added as an array, and the random function will pick one from the array

    var user = fakes.get('/user/:guid')
        .returns({
            id: fakes.data.guid,
            name: fakes.faker.name.findName,
            gender: fakes.random(['male', 'female', 'other'])
        });

    
## Deep objects
    
You can also create more complex objects like this:
   
    var page = fakes
        .get('/foo/:id')
        .returns({
            
            // Create a random V4 GUID
            guid: fakes.data.guid,

            // Create a random name from faker.js
            name: faker.name.findName,

            // Get a random image from faker.js
            image: faker.image.imageUrl,

            // Pick a random value from the provided array
            gender: fakes.random(['male', 'female', 'other']),

            // Always return the static content
            foo: "static",

            // Create a deep object
            participants: {

                // Create a new name from faker.js
                name: faker.name.findName,

                // Another deep object, this time a list with between 1 to 4 entries
                friends: fakes.list({ 
                    
                    // Create a new name from faker.js
                    foo: faker.name.findName, 

                    // Create a list of words and pifkc them from faker.js
                    tags: fakes.list(faker.lorem.words(1), 5)

                }, 1, 4)

            },

        });

   
