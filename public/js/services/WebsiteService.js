angular.module('WebsiteServ', []).service('WebsiteService', ['$http', function($http){

       return {
        // call to get all websites
        get : function(cb) {
            $http.get("/api/websites")
            .then(function(response) {
                //First function handles success
               cb(response.data);
            }, function(response) {
                //Second function handles error
               console.log("Error getting data from the DB");
               console.log(response);
            });
                return;
        },


        // these will work when more API routes are defined on the Node side of things
        // call to POST and create a new website
        create : function(websiteData, cb) {
             $http.post('/api/websites', websiteData).then(function(response){
                cb(response.data);
            });
             return;
        },


        update : function(websiteData, cb) {
             $http.put('/api/websites/'+websiteData.id, websiteData).then(function(response){
                cb(response.data);
            });
             return;
        },

        // call to DELETE a website
        delete : function(id, cb) {
            console.log("Deleting");
            $http.delete('/api/websites/' + id).then(function(response){
                cb (response.data);
            });
        },

        check : function(url,cb) {
            console.log("Trying to check "+url);
            $http.post("/api/check", url)
            .then(function(response) {
                //First function handles success
               cb(response.data);
            }, function(response) {
                //Second function handles error
               console.log("Error checking Website");
            });
                return;
        }


    }       

    
}])

