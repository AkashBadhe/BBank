// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	BloodBank = mongoose.model('BloodBank');

// Create a new error handling controller method
var getErrorMessage = function(err) {
	if (err.errors) {
		for (var errName in err.errors) {
			if (err.errors[errName].message) return err.errors[errName].message;
		}
	} else {
		return 'Unknown server error';
	}
};

// Create a new controller method that creates new bloodBanks
exports.create = function(req, res) {
	// Create a new bloodBank object
	var bloodBank = new BloodBank(req.body);

	// Set the bloodBank's 'creator' property
	bloodBank.creator = req.user;

	// Try saving the bloodBank
	bloodBank.save(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the bloodBank 
			res.json(bloodBank);
		}
	});
};

// Create a new controller method that retrieves a list of bloodBanks
exports.list = function(req, res) {
	// Use the model 'find' method to get a list of bloodBanks
	BloodBank.find().populate('creator', 'firstName lastName fullName').exec(function(err, bloodBanks) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the bloodBank 
			res.json(bloodBanks);
		}
	});
};

// Create a new controller method that returns an existing bloodBank
exports.read = function(req, res) {
	res.json(req.bloodBanks);
};

// Create a new controller method that updates an existing bloodBank
exports.update = function(req, res) {
	// Get the bloodBank from the 'request' object
	var bloodBank = req.bloodBank;

	for(var key in req.body){
		if(req.body.hasOwnProperty(key)){
			bloodBank[key] = req.body[key];	
		}
	}
	
	// Try saving the updated bloodBank
	bloodBank.save(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the bloodBank 
			res.json(bloodBank);
		}
	});
};

// Create a new controller method that delete an existing bloodBank
exports.delete = function(req, res) {
	// Get the bloodBank from the 'request' object
	var bloodBank = req.bloodBank;

	// Use the model 'remove' method to delete the bloodBank
	bloodBank.remove(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the bloodBank 
			res.json(bloodBank);
		}
	});
};

// Create a new controller middleware that retrieves a single existing bloodBank
exports.bloodBankByID = function(req, res, next, id) {
	// Use the model 'findById' method to find a single bloodBank 
	BloodBank.findById(id).populate('creator', 'firstName lastName fullName').exec(function(err, bloodBank) {
		if (err) return next(err);
		if (!bloodBank) return next(new Error('Failed to load bloodBank ' + id));

		// If an bloodBank is found use the 'request' object to pass it to the next middleware
		req.bloodBank = bloodBank;

		// Call the next middleware
		next();
	});
};

// Create a new controller middleware that is used to authorize an bloodBank operation 
exports.hasAuthorization = function(req, res, next) {
	// If the current user is not the creator of the bloodBank send the appropriate error message
	// if (true || req.bloodBank.creator.id !== req.user.id) { // TODO: Enalbe this check.
	// 	return res.status(403).send({
	// 		message: 'User is not authorized'
	// 	});
	// }

	// Call the next middleware
	next();
};