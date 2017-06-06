// Set the 'NODE_ENV' variable
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var fs = require('fs'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    obj,
    config = require('./config/config.js');


var db = mongoose.connect(config.db);

fs.readFile('BloodBankDetails.js', 'utf8', function(err, data) {
    var schema = {},
        i,
        column;
    if (err) throw err;
    obj = JSON.parse(data);

    for (i = 0; i < obj.fields.length; i++) {
        column = obj.fields[i];
        schema[column.label] = { type: getColumnType(column.type) };
    }

    var mongooseSchema = new Schema(schema);
    var model = mongoose.model(config.bloodBankModel, mongooseSchema); //Get model name as function parameter.
    createDefaultData(model, schema, obj.data);
});


function getColumnType(type) {
    if (type === 'string') {
        return 'String';
    }
}

function createDefaultData(model, schema, data) {
    model.find({}).exec(function(err, collection) {
        if (collection.length === 0) {
            for (var i = 0; i < data.length; i++) {
                var obj = {}, j=0;
                for (var key in schema) {
                    if (schema.hasOwnProperty(key)) {
                        obj[key] = data[i][j];
                    }
                    j++;
                }
                model.create(obj);
            }
        }
    });
}
