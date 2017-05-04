// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// Define a new 'ArticleSchema'
var BloodBankSchema = new Schema({
	id : {type: String},
    state : {type: String},
    city : {type: String},
    district : {type: String},
    h_name : {type: String},
    address : {type: String},
    pincode : {type: String},
    contact : {type: String},
    helpline : {type: String},
    fax : {type: String},
    category : {type: String},
    website : {type: String},
    email : {type: String},
    blood_component : {type: String},
    blood_group : {type: String},
    service_time : {type: String},
    latitude : {type: String},
    longitude : {type: String}
});

// Create the 'Article' model out of the 'ArticleSchema'
mongoose.model('BloodBank', BloodBankSchema);