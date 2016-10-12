angular.module('SettingsServ', []).service('SettingsService', ['$http', function($http){

       return {
        // call to get all websites
        get : function(cb) {
            $http.get("/api/settings")
            .then(function(response) {
                //First function handles success
               cb(response.data);
            }, function(response) {
                //Second function handles error
               console.log("Error getting data from the DB");
            });
                return;
        },


        create : function(settingsData, cb) {
             $http.post('/api/settings/',settingsData).then(function(response){
                cb(response.data);
            });
             return;
        }

    }       

    
}])

