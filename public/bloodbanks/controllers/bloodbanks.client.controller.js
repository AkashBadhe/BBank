// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'articles' controller
angular.module('bloodbanks').controller('BloodbanksController', ['$scope', '$routeParams', '$location', 'Authentication', 'Bloodbanks',
    function($scope, $routeParams, $location, Authentication, Bloodbanks) {
    	// Expose the Authentication service
        $scope.authentication = Authentication;

        // Create a new controller method for creating new articles
        $scope.create = function() {
        	// Use the form fields to create a new bloodbank $resource object
            var bloodbank = new Articles({
                state: this.state,
                city: this.city,
                district: this.district,
                h_name: this.h_name,
                address: this.address,
                pincode: this.pincode,
                contack: this.contact,
                helpline: this.helpline,
                fax: this.fax,
                category: this.category,
                website: this.website,
                email: this.email,
                blood_component: this.blood_component,
                blood_group: this.blood_group,
                service_time: this.service_time,
                latitude: this.latitude,
                longitude: this.longitude
            });

            // Use the article '$save' method to send an appropriate POST request
            bloodbank.$save(function(response) {
            	// If an article was created successfully, redirect the user to the article's page 
                $location.path('bloodbanks/' + response._id);
            }, function(errorResponse) {
            	// Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for retrieving a list of bloodbanks
        $scope.find = function() {
        	// Use the article 'query' method to send an appropriate GET request
            $scope.bloodbanks = Bloodbanks.query();
        };

        // Create a new controller method for retrieving a single article
        $scope.findOne = function() {
        	// Use the article 'get' method to send an appropriate GET request
            $scope.bloodbank = Bloodbanks.get({
                bloodbankId: $routeParams.bloodbankId
            });
        };

        // Create a new controller method for updating a single article
        $scope.update = function() {
        	// Use the article '$update' method to send an appropriate PUT request
            $scope.bloodbank.$update(function() {
            	// If an article was updated successfully, redirect the user to the article's page 
                $location.path('bloodbanks/' + $scope.bloodbank._id);
            }, function(errorResponse) {
            	// Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for deleting a single article
        $scope.delete = function(bloodbank) {
        	// If an article was sent to the method, delete it
            if (bloodbank) {
            	// Use the article '$remove' method to delete the article
                bloodbank.$remove(function() {
                	// Remove the article from the articles list
                    for (var i in $scope.bloodbanks) {
                        if ($scope.bloodbanks[i] === bloodbank) {
                            $scope.bloodbanks.splice(i, 1);
                        }
                    }
                });
            } else {
            	// Otherwise, use the article '$remove' method to delete the article
                $scope.article.$remove(function() {
                    $location.path('bloodbanks');
                });
            }
        };
    }
]);