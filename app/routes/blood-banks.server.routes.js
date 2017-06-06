// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var bloodBanks = require('../../app/controllers/blood-banks.server.controller'),
	users = require('../../app/controllers/users.server.controller');
// Define the routes module' method
module.exports = function(app) {
	// Set up the 'articles' base routes 
	app.route('/api/bloodBanks')
	   .get(bloodBanks.list)
	   .post(users.requiresLogin, bloodBanks.create);
	
	// Set up the 'articles' parameterized routes
	app.route('/api/bloodBanks/:bloodBankId')
	   .get(bloodBanks.read)
	   .put(users.requiresLogin, bloodBanks.hasAuthorization, bloodBanks.update)
	   .delete(users.requiresLogin, bloodBanks.hasAuthorization, bloodBanks.delete);

	// Set up the 'articleId' parameter middleware   
	app.param('bloodBankId', bloodBanks.bloodBankByID);
};