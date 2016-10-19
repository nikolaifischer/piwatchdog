angular.module('MainCtrl', []).controller('MainController', function($scope, $interval, $location, $mdDialog, WebsiteService) {

    $scope.newSite = {
    	name: "",
    	url:""
    };

    $scope.showNewSite=false;
    $scope.isOpen=false;
    $scope.editModus=false;
    $scope.websites = [];

    WebsiteService.get(function(sites){
   		console.log(sites);
   		$scope.websites = mapToFrontend(sites);

   });


    $scope.saveEdit = function(id){

    	var index = findInArrayById(id);
    	if(index >-1) {

    		// Update Object as it is in the frontend in the DB
    		WebsiteService.update($scope.websites[index], function(response){
    			console.log("Service has updated");
    			console.log(response);
    			$scope.websites[index].editModus=false;
   		 	});

    	}
    }



    $scope.delete = function(id){
		var index = findInArrayById(id);
		if(index >-1) {

			// Update Object as it is in the frontend in the DB
			WebsiteService.delete($scope.websites[index].id, function(response){
				console.log("Service has deleted");
				console.log(response);


			    WebsiteService.get(function(sites){
   					$scope.websites = mapToFrontend(sites);
   				});
				
			});

		}
    }


    $scope.saveNewSite = function () {

    	WebsiteService.create($scope.newSite, function (response) {

    		$scope.showNewSite=false;


			WebsiteService.get(function(sites){
   					$scope.websites = mapToFrontend(sites);
   					var date =  Date.now();

				    $scope.newSite = {
				    	name: "",
				    	url:"",
				    	last_checked: date
				    };
   				});

    	});



    }

    $scope.goTo = function(path){
      $location.path(path);
    }





  // FRONT-END ONLY METHODS

  	// Shows the Confirm Dialog before a website is deleted
    $scope.showConfirm = function(ev,id) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this item?')
          .textContent('The watchdog will no longer monitor this website')
          .ariaLabel('Delete')
          .targetEvent(ev)
          .ok('Yes')
          .cancel('No');

    $mdDialog.show(confirm).then(function() {
    	$scope.delete(id);
     ;
    }, function() {
      //do nothing
    });
  };


  $scope.addNewSite = function () {
    $scope.showNewSite=true;

  }


// HELPER METHODS

 // Maps the ID of the website in the database on the position in the array.
 findInArrayById = function (id) {


 	for(var i =0 ; i<$scope.websites.length; i++) {

 		if($scope.websites[i].id==id){
 			return i;
 		}
 	}
 	return -1;

 }


// This Methods maps the website response array from the DB to the format which is needed to display the site in the frontend.


	mapToFrontend = function (websitesInDb) {

    // IF YOU ARE DOING CHANGES HERE, BE SURE TO ALSO MAKE THEM IN THE updateValues() METHOD, IF APPLICABLE

	 	var websitesInFrontend = [];

	 	for(var i =0; i<websitesInDb.length; i++) {
	 		var nextWebsite = {};
	 		nextWebsite.name= websitesInDb[i].name;
	 		nextWebsite.interval = websitesInDb[i].interval;
	 		nextWebsite.url = websitesInDb[i].url;
	 		nextWebsite.id = websitesInDb[i]._id;
	 		nextWebsite.isOnline = websitesInDb[i].isOnline;
	 		nextWebsite.last_checked = jQuery.timeago(websitesInDb[i].last_checked);
	 		nextWebsite.editModus = false;
	 		
      if(nextWebsite.isOnline) {
	 		  nextWebsite.imagePath = "./media/screenshots/"+websitesInDb[i]._id+".png";
      }
      else {
        nextWebsite.imagePath="./media/screenshots/offline.png"
      }

	 		websitesInFrontend.push(nextWebsite);

	 	
	 	}

	 	return websitesInFrontend;

	}


	updateValues = function (websitesInDb) {
		for(var i =0; i<websitesInDb.length; i++) {
			var dbWebsite = websitesInDb[i];
			var frontEndIndex = findInArrayById(dbWebsite._id);
			if(frontEndIndex > -1 && $scope.websites[frontEndIndex].editModus==false) {
	       
				$scope.websites[frontEndIndex].last_checked= jQuery.timeago(dbWebsite.last_checked);
				$scope.websites[frontEndIndex].isOnline= dbWebsite.isOnline;
        if(dbWebsite.isOnline) {
          $scope.websites[frontEndIndex].imagePath = "./media/screenshots/"+dbWebsite._id+".png?decache="+Math.random();  
        }
        else {
          $scope.websites[frontEndIndex].imagePath = "./media/offline.png"
        }
				
			
			}


		}

	}

// Updates the Data displayed in the frontend. Is called every 30s by the $interval service.
	getData = function () {
	    WebsiteService.get(function(sites){
	   		
	   		updateValues(sites);
	   		$("time.timeago").timeago();
	  	 });

	}


	$interval(getData,10000);


});



