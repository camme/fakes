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


var Entry = function(id, path, method) {

    var self = this;

    this.id = id;
    this.path = path;
    this.method = method;
    this.hasCreate = false;

    var checkKey = (/\/:(\w+)/i).exec(this.path);
    this.key = checkKey ? checkKey[1] : null;
    this.data = this.key ? {} : null;

    addSchema(this.id, this, this.method);
    
    app[this.method](path, function(req, res) {
        res.json(self.getData(req));
   });

};

Entry.prototype.getData = function(req) {

    var data = this.key ? this.data[req.params[this.key]] : this.data;

    if (!data) {
        if (this.key) {
            this.data[req.params[this.key]] = data = this.createData();
        } else {
            this.data = data = this.createData();
        }
    }

    return data;

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





faki.get = function(id, path) {
    var entry = new Entry(id, path, 'get');
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

        for(var i = start; i < start + amount; i++){ 
            if (typeof f == 'function') {
                list.push(f());
            } else {
                var entry = schemas[f]['get'];
                list.push(entry.createData({}));
            }
        }

        return list;

    }
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
