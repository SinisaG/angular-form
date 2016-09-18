(function () {
    angular
        .module('app')
        .controller('addressFormCtrl', addressFormCtrl);

    function addressFormCtrl(geoService, $mdToast) {
        var vm = this;
        //model
        vm.address = {};
        vm.showMap = false;
        vm.location = undefined;
        vm.submit = submit;

        function submit(address) {
            //we can also do further validation here
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
                controller: function addressToastCtrl() { },
                locals: scope,
                bindToController: true,
                controllerAs: 'vm',
                templateUrl: template
            });
        }
    }

})();