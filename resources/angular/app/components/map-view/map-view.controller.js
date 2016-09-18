(function () {
    angular
        .module('app')
        .controller('mapViewCtrl', addressFormCtrl);

    function addressFormCtrl(APP_CONFIG, $sce) {
        var vm = this;
        vm.formatMapQuery = formatMapQuery;

        function formatMapQuery(streetLocation) {
            var url = APP_CONFIG.api.maps.view;
            url = url
                .replace(':key', APP_CONFIG.api.maps.apiKey)
                .replace(':q', streetLocation.lat + "," + streetLocation.lng);
            return $sce.trustAsResourceUrl(url);
        }
    }

})();