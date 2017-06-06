// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'bloodbanks' service
angular.module('bloodbanks').factory('Bloodbanks', ['$resource', function($resource) {
	// Use the '$resource' service to return an article '$resource' object
    return $resource('api/bloodbanks/:bloodbankId', {
        bloodbankId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);
