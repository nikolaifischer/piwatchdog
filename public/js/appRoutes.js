    angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainController'
        })
        // Settings page
        .when('/settings', {
            templateUrl: 'views/settings.html',
            controller: 'SettingsController'
        });


    $locationProvider.html5Mode(true);

}]);