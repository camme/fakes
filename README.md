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
    
...and it will give you something like this when you call `http://localhost:8080/page/foo`

    {
        "guid": "67d82ad7-f466-4798-8e48-5722fee1258d",
        "title": "Veniam sint cupiditate.",
        "intro": "Et sed corporis voluptatibus architecto omnis.",
        "description": "Nostrum non esse voluptatem\nillo est sit ex vel qui\nminus officiis repellat aut ipsa quo perferendis ea inventore eius\nomnis reiciendis natus atque maxime necessitatibus exercitationem voluptas aut dignissimos\n \r\teveniet sequi et est qui\nprovident aut sunt saepe ipsum\narchitecto sint reprehenderit voluptas beatae eum qui\n \r\teos vel eos hic provident iusto consequatur autem\ndolor qui nemo ut tenetur\nquos corporis molestiae adipisci veritatis\nnesciunt debitis sed voluptatum et\nnobis occaecati blanditiis minus\nenim vel laboriosam alias ea et neque necessitatibus cupiditate culpa."
    }
    
If you call the same address, the same content will be returned. However, if you call a new url, it will generate new content for you.
    
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

   
## Roadmap

These are some features that we would like to implement:

- ~~GET endpoints~~
- ~~Add option to not cache data~~
- ~~Deep objects~~
- ~~Add faker.js integration~~
- ~~Add random selection from array~~
- ~~Add generated list with data from other endpoint~~
- ~~Add link to other endpoint~~
- POST endpoints
  - Return an answer when something is posten
  - Verify that the incoming data is ok
- More examples
- Use **fakes** as a test to validate the real data
  - Make it test a real endpoint
  - Generate reports based on validation of structure and basic data type
  
 