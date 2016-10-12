angular.module('SettingsCtrl', []).controller('SettingsController', function($scope, $mdDialog,SettingsService) {


	$scope.settings = {

	};


	SettingsService.get(function(response){

		$scope.settings = response[0];
		console.log(response);

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