
export var psw = angular.module('psw', ['ui.router']);
export var baseurl = 'http://localhost:3000';
///////////////////////////////////////SERVICE//////////////////////////////////////////
psw.service('$auth', function ($state, $transitions) {
    this.auth = function () {
        var auth = localStorage.getItem('auth');
        $transitions.onSuccess({}, function ($transitions, event) {

            if (!auth) {
                $state.go('home'); $state.defaultErrorHandler(function (err) { console.log(err) })
            }
        })
        if (!auth) {
            $state.go('home'); $state.defaultErrorHandler(function (err) { console.log(err) });
        }
    }
    this.auth_home = function () {
        var auth = localStorage.getItem('auth');

        if (auth) {
            $state.go('dashboard'); $state.defaultErrorHandler(function (err) { console.log(err) })
        }
    }
});
///////////////////////////////////////CONFIG///////////////////////////////////////////////
psw.config(($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) => {

    $locationProvider.hashPrefix('');
    $stateProvider
        .state('home', {
            url: '',
            templateUrl: 'src/app/components/home.html',
            controller: 'homectr',
            resolve: {
                auth: function ($auth) { return $auth.auth_home(); }
            }
        })
        .state('regestration', {
            url: '/regestration',
            templateUrl: 'src/app/components/regestration.html',
            controller: 'regestrationctr',
            resolve: {
                auth: function ($auth) { return $auth.auth_home(); }
            }

        })
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: 'src/app/components/dashboard.html',
            controller: 'dashctr',
            resolve: {
                auth: function ($auth) { return $auth.auth(); }
            }
        })
})

////////////////////////FIlTERS////////////////////////////

psw.filter('validate',()=>{
    return (x)=>{
        if(x.match('<|>|!|/|\/|/|\'|%|\"|{|}|\,')) return false
        else return true
    }
}
)



