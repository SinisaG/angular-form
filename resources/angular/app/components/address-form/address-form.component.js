(function () {
    angular
        .module('app')
        .component('addressForm', {
            templateUrl: 'views/components/address-form.template.html',
            controller: 'addressFormCtrl',
            controllerAs: 'vm'
        });

}) ();