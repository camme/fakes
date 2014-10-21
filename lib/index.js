var express = require('express');
var faker = require('faker');
var fakeData = require('./faki.data');

var app = express();

// We wrap FAKER so they return a function that has settings instead.
// We need to call the original FAKER function for each generated item. 
// But when we define our schema, we want to use the same arguments
// as the original
var wrapFaker = function(obj, wrapper) {
    var keys = Object.keys(obj);
    keys.forEach(function(key) {

        var item = obj[key];

        if (typeof item == 'function') {
            wrapper[key] = function() {
                return function() {
                    return item.apply(item, arguments);
                }
            };
        } else if (typeof item == 'object') {
           wrapper[key] = wrapFaker(item, {}); 
        } 

    });

    return wrapper;
}

var schemas = {};
var faki = {};

faki.data = fakeData;
faki.faker = wrapFaker(faker, {});

function addSchema(id, entry, method) {

    var schema = schemas[id];

    if (!schema) {
        schema = schemas[id] = {};
    }

    var methodSchema = schema[method];

    if (!methodSchema) {
        methodSchema = schema[method] = entry;
    }

}


var Entry = function(path, method) {

    var self = this;

    //this.id = id;
    this.path = path;
    this.method = method;
    this.hasCreate = false;
    this.shouldCache = true;
    this.data = {};
    this.dataList = [];

    //addSchema(this.id, this, this.method);

    app[this.method](path, function(req, res) {
        res.json(self.getData(req));
    });

};

// Use this to create an endpoint where the data will not be cached to a specific
// endpoint path
Entry.prototype.cache = function(cache) {
    this.shouldCache = cache;
    return this;
}

Entry.prototype.getData = function(req) {

    var data = this.data[req.path];

    if (!data) {
        if (this.shouldCache) {
        this.data[req.path] = data = this.createData();
        this.dataList.push({
            id: req.path,
            data: data
        });
        } else {
            data = this.createData();
        }
    }

    return data;

}

Entry.prototype.fakeRequest = function() {

    var path = this.path;
    var keysRe = /(:\w+)/g;
    var key = keysRe.exec(path);

    while(key) {
        var randomWord = faki.data.lorem(1)().toLowerCase().replace(/[,\.]/,'');
        path = path.replace(key[0], randomWord);
        key = keysRe.exec(path);
    }

    this.getData({path: path});

}


Entry.prototype.createData = function(){

    if (!this.schema) {
        throw new Error('no schema defined');
    }

    return buildData(this.schema, {});

};

function buildData(dataObject, data) {

    if (typeof dataObject == 'function') {
        return { test: 1 };
    }

    var keys = Object.keys(dataObject);   

    keys.forEach(function(key) {

        var value = dataObject[key];

        if (typeof value == "object") {
            data[key] = buildData(value, {});

        } else if (typeof value == 'function') {
            data[key] = value();
            if (typeof data[key] == 'function') {
                data[key] = data[key]();
            }
        } else {
            data[key] = value;
        }

    });

    return data;

}


Entry.prototype.returns = function(schema) {
    this.schema = schema;
    return this;
};


Entry.prototype.create = function(amount, max) {
    this.hasCreate = true;
    return this;
};





faki.get = function(path) {
    var entry = new Entry(path, 'get');
    return entry;
};

faki.list = function(f, amount, max) {
    return function() {

        var list = [];

        var start = 0;
        if (max) {
            start = Math.round(Math.random() * amount) + 1;
            amount = Math.round(Math.random() * max) + 1; 
        }

        // There is a special case of the list function that works in combination
        // with the link function. Its used when we want to create a list of links
        // and each link should go to a unique path. When that happens, we just return the function
        // dirrectly.
        if (f._type == "link-function") {
            return f(amount);
        }

        for(var i = start; i < start + amount; i++){ 
            if (typeof f == 'function') {

                var value = f();

                if (typeof value == 'function') {
                    value = value();
                }
                list.push(value);

            } else if (f.constructor == Entry) {
                var entry = f; //schemas[f]['get'];
                list.push(entry.createData({}));
            } else {
                var data = buildData(f, {});
                list.push(data);
            }
        }

        return list;

    }
}

// This creates a link reult to an existsing endpoint.
// If its called from the list function, we create a set of unique links
// in the same amount as the list requires
faki.link = function(f) {

    var linkFunction = function(amount) {

        amount = amount || 1;
        var link;
        if (typeof f == 'function') {
            link = f();
        } else {

            var entry = f; //schemas[f]['get'];

            if (entry.dataList.length < amount) {
                for(var i = 0, ii = amount; i < ii; i++){ 
                    entry.fakeRequest();
                }
            }

            var list = [];
            var copy = entry.dataList.concat([]);
            while (list.length < amount) {
                var index = Math.round(Math.random() * (copy.length - 1));
                var item = copy.splice(index, 1);
                list.push(item[0].id);
            }

            link = amount == 1 ? list[0] : list;

        }

        return link;

    }

    linkFunction._type = 'link-function';

    return linkFunction;

}

faki.random = function(list) {

    return function() {
        
        var index = Math.round(Math.random() * (list.length - 1));
        if (index < 0) index = 0;

        return list[index];

    };

};


faki.start = function(port, next) {

    app.listen(port, function(err) {

        console.log('Started faki server at port %s', port);

        if (typeof next == 'function') {
            next(err);
        }

    });

}


module.exports = faki;
