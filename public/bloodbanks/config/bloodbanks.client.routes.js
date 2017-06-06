// Invoke 'strict' JavaScript mode
'use strict';

// Configure the 'articles' module routes
angular.module('bloodbanks').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/bloodbanks', {
			templateUrl: 'bloodbanks/views/list-bloodbanks.client.view.html'
		}).
		when('/bloodbanks/create', {
			templateUrl: 'bloodbanks/views/create-bloodbank.client.view.html'
		}).
		when('/bloodbanks/:bloodbankById', {
			templateUrl: 'bloodbanks/views/view-bloodbank.client.view.html'
		}).
		when('/bloodbanks/:bloodbankById/edit', {
			templateUrl: 'bloodbankById/views/edit-bloodbank.client.view.html'
		});
	}
]); 