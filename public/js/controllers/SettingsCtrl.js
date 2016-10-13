angular.module('SettingsCtrl', []).controller('SettingsController', function($scope, $mdDialog,SettingsService) {


	$scope.settings = {

	};


	
	SettingsService.get(function(response){

		// This would mean, there is no settings object in the Database yet.
		if(response.length <1) {

			SettingsService.create($scope.settings, function(response){

				$scope.settings = response[0];
				return;
			});

		}
		
		else {
			$scope.settings = response[0];
		}
	});




/*
	SettingsService.get(function(response){

		console.log (response);

	});

*/

  $scope.save = function() {
      	SettingsService.create($scope.settings, function(response){


	});


    };
  




});