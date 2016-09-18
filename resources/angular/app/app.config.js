(function () {
    'use strict';

    angular.module('app')
        .config(appConfig);

    function appConfig($mdThemingProvider, $stateProvider, $urlMatcherFactoryProvider) {
        $urlMatcherFactoryProvider.strictMode(false)

        $mdThemingProvider.theme('default')
            .primaryPalette('orange')
            .accentPalette('orange');
        
        $stateProvider.state({
            name: 'home',
            url: '',
            templateUrl: '/views/home.template.html',
            controller: 'AppCtrl as vm'
        });
    }
})();
