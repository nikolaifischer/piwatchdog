angular.module('sampleApp', ['ngRoute', 'appRoutes','ngMaterial', 'MainCtrl', 'SettingsCtrl', 'WebsiteServ','SettingsServ'])
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue-grey',{
    	'default': '700'
    })
    .accentPalette('orange');
}).directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  }
});