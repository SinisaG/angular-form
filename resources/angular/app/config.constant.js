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