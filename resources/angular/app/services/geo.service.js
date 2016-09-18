(function () {
    angular
        .module('app')
        .service('geoService', geoService);

    function geoService($resource, APP_CONFIG, $q) {

        var GEO_SERVICE_CONFIG = APP_CONFIG.api.maps;

        var resource = $resource(
            GEO_SERVICE_CONFIG.url,
            { key: GEO_SERVICE_CONFIG.apiKey, address: '' }
        );

        return {
            geoCode: geoCode
        };

        function geoCode(address) {
            var addressFormatted = address.street + " " + address.houseNumber + " " + address.postCode + " " + address.city;
            var d = $q.defer();
            resource.get({ address: addressFormatted }).$promise.then(function (result) {
                //here we could also validate that the match is exact - not approximation
                //(address actually exist, but for demo sake, we are loose with our validation)
                //handle not found
                if (GEO_SERVICE_CONFIG.errors[result.status]) {
                    d.reject({
                        message: GEO_SERVICE_CONFIG.errors[result.status]
                    });
                } else {
                    d.resolve(result.results[0].geometry.location);
                }
            }).catch(function (error) {
                var error = {
                    message: GEO_SERVICE_CONFIG.errors.GENERIC
                }
                d.reject(error);
            });
            return d.promise;
        }
    }
})();