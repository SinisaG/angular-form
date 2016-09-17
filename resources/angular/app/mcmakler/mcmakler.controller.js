(function () {
    'use strict';

    angular.module('mcmakler')
        .controller('TestCtrl', testController)
    ;

    function testController($log)
    {
        activate();

        function activate()
        {
            $log.debug('Hi! I\'m your test controller.');
        }
    }

})();
