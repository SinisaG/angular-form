(function () {
    'use strict';

    angular.module('app', [
        // vendor packages
        'ngResource',
        'ui.router',
        'ngMaterial'
    ])
})();

(function () {
    'use strict';

    appConfig.$inject = ["$mdThemingProvider", "$stateProvider", "$urlMatcherFactoryProvider"];
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
            templateUrl: 'views/home.template.html',
            controller: 'AppCtrl as vm'
        });
    }
})();

(function () {
    'use strict';

    angular.module('app')
        .controller('AppCtrl', appController)
    ;

    function appController()
    {

    }

})();

(function () {
    angular
        .module('app')
        .constant('APP_CONFIG', {
            api: {
                maps: {
                    url: 'https://maps.googleapis.com/maps/api/geocode/json',
                    apiKey: 'AIzaSyB8rj--gV05jgyRt_bcA-_8PBnwxVDD9g0',
                    errors: {
                        ZERO_RESULTS: "Not a valid address.",
                        GENERIC: "We could not locate this address"
                    },
                    view: 'https://www.google.com/maps/embed/v1/search?key=:key&q=:q'
                }
            }
        });
}) ();
(function () {
    geoService.$inject = ["$resource", "APP_CONFIG", "$q"];
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
            resource.get({address: addressFormatted}).$promise.then(function (result) {
                //handle not found
                if (GEO_SERVICE_CONFIG.errors[result.status]) {
                    d.reject({
                        message: GEO_SERVICE_CONFIG.errors[result.status]
                    });
                } else {
                    d.resolve(result.results[0].geometry.location);
                }
            }).catch(function (error){
                var error = {
                    message: GEO_SERVICE_CONFIG.errors.GENERIC
                }
                d.reject(error);
            });
            return d.promise;
        }
    }
})();
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
(function () {
    addressFormCtrl.$inject = ["APP_CONFIG", "$sce"];
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
(function () {
    angular
        .module('app')
        .component('addressForm', {
            templateUrl: 'views/components/address-form.template.html',
            controller: 'addressFormCtrl',
            controllerAs: 'vm'
        });

}) ();
(function () {
    addressFormCtrl.$inject = ["geoService", "$mdToast"];
    angular
        .module('app')
        .controller('addressFormCtrl', addressFormCtrl);

    function addressFormCtrl(geoService, $mdToast) {
        var vm = this;
        //model
        vm.address = {};
        vm.showMap = false;
        vm.location = undefined;
        
        vm.submit = function (address) {
            geoService.geoCode(address).then(function (location) {
                var message = "The coordinates for this address are: :lat, :lng"
                    .replace(':lat', location.lat)
                    .replace(':lng', location.lng);

                showToast(
                    {
                        message: message
                    },
                    'views/toasts/toast-success.template.html'
                )
                vm.location = location;
                vm.showMap = true;
            }).catch(function (err) {
                
                showToast(
                    {
                        error: err.message
                    },
                    'views/toasts/toast-error.template.html'
                )
            })
        }

        function showToast(scope, template) {
            $mdToast.show({
                hideDelay: 3000,
                position: 'top left',
                controller: function addressToastErrCtrl() { },
                locals: scope,
                bindToController: true,
                controllerAs: 'vm',
                templateUrl: template
            });
        }
    }

})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJhcHAuY29uZmlnLmpzIiwiYXBwLmNvbnRyb2xsZXIuanMiLCJjb25maWcuY29uc3RhbnQuanMiLCJzZXJ2aWNlcy9nZW8uc2VydmljZS5qcyIsImNvbXBvbmVudHMvbWFwLXZpZXcvbWFwLXZpZXcuY29tcG9uZW50LmpzIiwiY29tcG9uZW50cy9tYXAtdmlldy9tYXAtdmlldy5jb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy9hZGRyZXNzLWZvcm0vYWRkcmVzcy1mb3JtLmNvbXBvbmVudC5qcyIsImNvbXBvbmVudHMvYWRkcmVzcy1mb3JtL2FkZHJlc3MtZm9ybS5jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLENBQUEsWUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxPQUFBOztRQUVBO1FBQ0E7UUFDQTs7OztBQ1BBLENBQUEsWUFBQTtJQUNBOzs7SUFFQSxRQUFBLE9BQUE7U0FDQSxPQUFBOztJQUVBLFNBQUEsVUFBQSxvQkFBQSxnQkFBQSw0QkFBQTtRQUNBLDJCQUFBLFdBQUE7O1FBRUEsbUJBQUEsTUFBQTthQUNBLGVBQUE7YUFDQSxjQUFBOztRQUVBLGVBQUEsTUFBQTtZQUNBLE1BQUE7WUFDQSxLQUFBO1lBQ0EsYUFBQTtZQUNBLFlBQUE7Ozs7O0FDakJBLENBQUEsWUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQTtTQUNBLFdBQUEsV0FBQTs7O0lBR0EsU0FBQTtJQUNBOzs7Ozs7QUNSQSxDQUFBLFlBQUE7SUFDQTtTQUNBLE9BQUE7U0FDQSxTQUFBLGNBQUE7WUFDQSxLQUFBO2dCQUNBLE1BQUE7b0JBQ0EsS0FBQTtvQkFDQSxRQUFBO29CQUNBLFFBQUE7d0JBQ0EsY0FBQTt3QkFDQSxTQUFBOztvQkFFQSxNQUFBOzs7Ozs7NERDWkEsQ0FBQSxZQUFBO0lBQ0E7U0FDQSxPQUFBO1NBQ0EsUUFBQSxjQUFBOztJQUVBLFNBQUEsV0FBQSxXQUFBLFlBQUEsSUFBQTs7UUFFQSxJQUFBLHFCQUFBLFdBQUEsSUFBQTs7UUFFQSxJQUFBLFdBQUE7WUFDQSxtQkFBQTtZQUNBLEVBQUEsS0FBQSxtQkFBQSxRQUFBLFNBQUE7OztRQUdBLE9BQUE7WUFDQSxTQUFBOzs7UUFHQSxTQUFBLFFBQUEsU0FBQTtZQUNBLElBQUEsbUJBQUEsUUFBQSxTQUFBLE1BQUEsUUFBQSxjQUFBLE1BQUEsUUFBQSxXQUFBLE1BQUEsUUFBQTtZQUNBLElBQUEsSUFBQSxHQUFBO1lBQ0EsU0FBQSxJQUFBLENBQUEsU0FBQSxtQkFBQSxTQUFBLEtBQUEsVUFBQSxRQUFBOztnQkFFQSxJQUFBLG1CQUFBLE9BQUEsT0FBQSxTQUFBO29CQUNBLEVBQUEsT0FBQTt3QkFDQSxTQUFBLG1CQUFBLE9BQUEsT0FBQTs7dUJBRUE7b0JBQ0EsRUFBQSxRQUFBLE9BQUEsUUFBQSxHQUFBLFNBQUE7O2VBRUEsTUFBQSxVQUFBLE1BQUE7Z0JBQ0EsSUFBQSxRQUFBO29CQUNBLFNBQUEsbUJBQUEsT0FBQTs7Z0JBRUEsRUFBQSxPQUFBOztZQUVBLE9BQUEsRUFBQTs7OztBQ3BDQSxDQUFBLFlBQUE7SUFDQTtTQUNBLE9BQUE7U0FDQSxVQUFBLFdBQUE7WUFDQSxhQUFBO1lBQ0EsWUFBQTtZQUNBLGNBQUE7WUFDQSxVQUFBO2dCQUNBLGdCQUFBOzs7OztzRENSQSxDQUFBLFlBQUE7SUFDQTtTQUNBLE9BQUE7U0FDQSxXQUFBLGVBQUE7O0lBRUEsU0FBQSxnQkFBQSxZQUFBLE1BQUE7UUFDQSxJQUFBLEtBQUE7UUFDQSxHQUFBLGlCQUFBOztRQUVBLFNBQUEsZUFBQSxnQkFBQTtZQUNBLElBQUEsTUFBQSxXQUFBLElBQUEsS0FBQTtZQUNBLE1BQUE7aUJBQ0EsUUFBQSxRQUFBLFdBQUEsSUFBQSxLQUFBO2lCQUNBLFFBQUEsTUFBQSxlQUFBLE1BQUEsTUFBQSxlQUFBO1lBQ0EsT0FBQSxLQUFBLG1CQUFBOzs7OztBQ2RBLENBQUEsWUFBQTtJQUNBO1NBQ0EsT0FBQTtTQUNBLFVBQUEsZUFBQTtZQUNBLGFBQUE7WUFDQSxZQUFBO1lBQ0EsY0FBQTs7Ozs7MERDTkEsQ0FBQSxZQUFBO0lBQ0E7U0FDQSxPQUFBO1NBQ0EsV0FBQSxtQkFBQTs7SUFFQSxTQUFBLGdCQUFBLFlBQUEsVUFBQTtRQUNBLElBQUEsS0FBQTs7UUFFQSxHQUFBLFVBQUE7UUFDQSxHQUFBLFVBQUE7UUFDQSxHQUFBLFdBQUE7O1FBRUEsR0FBQSxTQUFBLFVBQUEsU0FBQTtZQUNBLFdBQUEsUUFBQSxTQUFBLEtBQUEsVUFBQSxVQUFBO2dCQUNBLElBQUEsVUFBQTtxQkFDQSxRQUFBLFFBQUEsU0FBQTtxQkFDQSxRQUFBLFFBQUEsU0FBQTs7Z0JBRUE7b0JBQ0E7d0JBQ0EsU0FBQTs7b0JBRUE7O2dCQUVBLEdBQUEsV0FBQTtnQkFDQSxHQUFBLFVBQUE7ZUFDQSxNQUFBLFVBQUEsS0FBQTs7Z0JBRUE7b0JBQ0E7d0JBQ0EsT0FBQSxJQUFBOztvQkFFQTs7Ozs7UUFLQSxTQUFBLFVBQUEsT0FBQSxVQUFBO1lBQ0EsU0FBQSxLQUFBO2dCQUNBLFdBQUE7Z0JBQ0EsVUFBQTtnQkFDQSxZQUFBLFNBQUEsc0JBQUE7Z0JBQ0EsUUFBQTtnQkFDQSxrQkFBQTtnQkFDQSxjQUFBO2dCQUNBLGFBQUE7Ozs7O0tBS0EiLCJmaWxlIjoiYW5ndWxhci5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFtcbiAgICAgICAgLy8gdmVuZG9yIHBhY2thZ2VzXG4gICAgICAgICduZ1Jlc291cmNlJyxcbiAgICAgICAgJ3VpLnJvdXRlcicsXG4gICAgICAgICduZ01hdGVyaWFsJ1xuICAgIF0pXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgICAgICAgLmNvbmZpZyhhcHBDb25maWcpO1xuXG4gICAgZnVuY3Rpb24gYXBwQ29uZmlnKCRtZFRoZW1pbmdQcm92aWRlciwgJHN0YXRlUHJvdmlkZXIsICR1cmxNYXRjaGVyRmFjdG9yeVByb3ZpZGVyKSB7XG4gICAgICAgICR1cmxNYXRjaGVyRmFjdG9yeVByb3ZpZGVyLnN0cmljdE1vZGUoZmFsc2UpXG5cbiAgICAgICAgJG1kVGhlbWluZ1Byb3ZpZGVyLnRoZW1lKCdkZWZhdWx0JylcbiAgICAgICAgICAgIC5wcmltYXJ5UGFsZXR0ZSgnb3JhbmdlJylcbiAgICAgICAgICAgIC5hY2NlbnRQYWxldHRlKCdvcmFuZ2UnKTtcbiAgICAgICAgXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKHtcbiAgICAgICAgICAgIG5hbWU6ICdob21lJyxcbiAgICAgICAgICAgIHVybDogJycsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2hvbWUudGVtcGxhdGUuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQXBwQ3RybCBhcyB2bSdcbiAgICAgICAgfSk7XG4gICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdBcHBDdHJsJywgYXBwQ29udHJvbGxlcilcbiAgICA7XG5cbiAgICBmdW5jdGlvbiBhcHBDb250cm9sbGVyKClcbiAgICB7XG5cbiAgICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcbiAgICAgICAgLmNvbnN0YW50KCdBUFBfQ09ORklHJywge1xuICAgICAgICAgICAgYXBpOiB7XG4gICAgICAgICAgICAgICAgbWFwczoge1xuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwczovL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvZ2VvY29kZS9qc29uJyxcbiAgICAgICAgICAgICAgICAgICAgYXBpS2V5OiAnQUl6YVN5Qjhyai0tZ1YwNWpneVJ0X2JjQS1fOFBCbnd4VkREOWcwJyxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBaRVJPX1JFU1VMVFM6IFwiTm90IGEgdmFsaWQgYWRkcmVzcy5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIEdFTkVSSUM6IFwiV2UgY291bGQgbm90IGxvY2F0ZSB0aGlzIGFkZHJlc3NcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB2aWV3OiAnaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9tYXBzL2VtYmVkL3YxL3NlYXJjaD9rZXk9OmtleSZxPTpxJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG59KSAoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcbiAgICAgICAgLnNlcnZpY2UoJ2dlb1NlcnZpY2UnLCBnZW9TZXJ2aWNlKTtcblxuICAgIGZ1bmN0aW9uIGdlb1NlcnZpY2UoJHJlc291cmNlLCBBUFBfQ09ORklHLCAkcSkge1xuICAgICAgICBcbiAgICAgICAgdmFyIEdFT19TRVJWSUNFX0NPTkZJRyA9IEFQUF9DT05GSUcuYXBpLm1hcHM7XG5cbiAgICAgICAgdmFyIHJlc291cmNlID0gJHJlc291cmNlKFxuICAgICAgICAgICAgR0VPX1NFUlZJQ0VfQ09ORklHLnVybCxcbiAgICAgICAgICAgIHsga2V5OiBHRU9fU0VSVklDRV9DT05GSUcuYXBpS2V5LCBhZGRyZXNzOiAnJyB9XG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdlb0NvZGU6IGdlb0NvZGVcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBnZW9Db2RlKGFkZHJlc3MpIHtcbiAgICAgICAgICAgIHZhciBhZGRyZXNzRm9ybWF0dGVkID0gYWRkcmVzcy5zdHJlZXQgKyBcIiBcIiArIGFkZHJlc3MuaG91c2VOdW1iZXIgKyBcIiBcIiArIGFkZHJlc3MucG9zdENvZGUgKyBcIiBcIiArIGFkZHJlc3MuY2l0eTtcbiAgICAgICAgICAgIHZhciBkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIHJlc291cmNlLmdldCh7YWRkcmVzczogYWRkcmVzc0Zvcm1hdHRlZH0pLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIC8vaGFuZGxlIG5vdCBmb3VuZFxuICAgICAgICAgICAgICAgIGlmIChHRU9fU0VSVklDRV9DT05GSUcuZXJyb3JzW3Jlc3VsdC5zdGF0dXNdKSB7XG4gICAgICAgICAgICAgICAgICAgIGQucmVqZWN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IEdFT19TRVJWSUNFX0NPTkZJRy5lcnJvcnNbcmVzdWx0LnN0YXR1c11cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZC5yZXNvbHZlKHJlc3VsdC5yZXN1bHRzWzBdLmdlb21ldHJ5LmxvY2F0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3Ipe1xuICAgICAgICAgICAgICAgIHZhciBlcnJvciA9IHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogR0VPX1NFUlZJQ0VfQ09ORklHLmVycm9ycy5HRU5FUklDXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGQucmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGQucHJvbWlzZTtcbiAgICAgICAgfVxuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgICAgIC5jb21wb25lbnQoJ21hcFZpZXcnLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbXBvbmVudHMvbWFwLXZpZXcudGVtcGxhdGUuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnbWFwVmlld0N0cmwnLFxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxuICAgICAgICAgICAgYmluZGluZ3M6IHtcbiAgICAgICAgICAgICAgICBzdHJlZXRMb2NhdGlvbjogJzwnXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xufSkgKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdtYXBWaWV3Q3RybCcsIGFkZHJlc3NGb3JtQ3RybCk7XG5cbiAgICBmdW5jdGlvbiBhZGRyZXNzRm9ybUN0cmwoQVBQX0NPTkZJRywgJHNjZSkge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5mb3JtYXRNYXBRdWVyeSA9IGZvcm1hdE1hcFF1ZXJ5O1xuICAgICAgICBcbiAgICAgICAgZnVuY3Rpb24gZm9ybWF0TWFwUXVlcnkoc3RyZWV0TG9jYXRpb24pIHtcbiAgICAgICAgICAgIHZhciB1cmwgPSBBUFBfQ09ORklHLmFwaS5tYXBzLnZpZXc7XG4gICAgICAgICAgICB1cmwgPSB1cmxcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgnOmtleScsIEFQUF9DT05GSUcuYXBpLm1hcHMuYXBpS2V5KVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKCc6cScsIHN0cmVldExvY2F0aW9uLmxhdCArIFwiLFwiICsgc3RyZWV0TG9jYXRpb24ubG5nKTtcbiAgICAgICAgICAgIHJldHVybiAkc2NlLnRydXN0QXNSZXNvdXJjZVVybCh1cmwpO1xuICAgICAgICB9XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxuICAgICAgICAuY29tcG9uZW50KCdhZGRyZXNzRm9ybScsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY29tcG9uZW50cy9hZGRyZXNzLWZvcm0udGVtcGxhdGUuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnYWRkcmVzc0Zvcm1DdHJsJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJ1xuICAgICAgICB9KTtcblxufSkgKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdhZGRyZXNzRm9ybUN0cmwnLCBhZGRyZXNzRm9ybUN0cmwpO1xuXG4gICAgZnVuY3Rpb24gYWRkcmVzc0Zvcm1DdHJsKGdlb1NlcnZpY2UsICRtZFRvYXN0KSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIC8vbW9kZWxcbiAgICAgICAgdm0uYWRkcmVzcyA9IHt9O1xuICAgICAgICB2bS5zaG93TWFwID0gZmFsc2U7XG4gICAgICAgIHZtLmxvY2F0aW9uID0gdW5kZWZpbmVkO1xuICAgICAgICBcbiAgICAgICAgdm0uc3VibWl0ID0gZnVuY3Rpb24gKGFkZHJlc3MpIHtcbiAgICAgICAgICAgIGdlb1NlcnZpY2UuZ2VvQ29kZShhZGRyZXNzKS50aGVuKGZ1bmN0aW9uIChsb2NhdGlvbikge1xuICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID0gXCJUaGUgY29vcmRpbmF0ZXMgZm9yIHRoaXMgYWRkcmVzcyBhcmU6IDpsYXQsIDpsbmdcIlxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgnOmxhdCcsIGxvY2F0aW9uLmxhdClcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoJzpsbmcnLCBsb2NhdGlvbi5sbmcpO1xuXG4gICAgICAgICAgICAgICAgc2hvd1RvYXN0KFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICd2aWV3cy90b2FzdHMvdG9hc3Qtc3VjY2Vzcy50ZW1wbGF0ZS5odG1sJ1xuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICB2bS5sb2NhdGlvbiA9IGxvY2F0aW9uO1xuICAgICAgICAgICAgICAgIHZtLnNob3dNYXAgPSB0cnVlO1xuICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHNob3dUb2FzdChcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVyci5tZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICd2aWV3cy90b2FzdHMvdG9hc3QtZXJyb3IudGVtcGxhdGUuaHRtbCdcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2hvd1RvYXN0KHNjb3BlLCB0ZW1wbGF0ZSkge1xuICAgICAgICAgICAgJG1kVG9hc3Quc2hvdyh7XG4gICAgICAgICAgICAgICAgaGlkZURlbGF5OiAzMDAwLFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAndG9wIGxlZnQnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uIGFkZHJlc3NUb2FzdEVyckN0cmwoKSB7IH0sXG4gICAgICAgICAgICAgICAgbG9jYWxzOiBzY29wZSxcbiAgICAgICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogdGVtcGxhdGVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG59KSgpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
