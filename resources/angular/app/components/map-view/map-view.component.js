(function () {
    angular
        .module('app')
        .component('mapView', {
            templateUrl: 'views/components/map-view.template.html',
            controller: 'mapViewCtrl',
            controllerAs: 'vm',
            bindings: {
                streetLocation: '<'
            }
        });
}) ();