import { psw, baseurl } from '../app.module.js';

psw.controller('homectr', function ($scope, $state, $timeout, $http ,$filter) {

    $scope.sign_in = () => {
        var alert = document.querySelector('.alert');
        var login = document.querySelector('input[name=login]').value;
        var pswrd = document.querySelector('input[name=pswrd]').value;
        var outp  = document.querySelector('output');

         if(!$filter('validate')(login) || !$filter('validate')(pswrd)) 
         return false,
         alert.style.visibility = 'visible',
         outp.value = 'inputs contain restricted symbols';
        $http({
            method: 'POST',
            url: baseurl + '/signin',
            headers: { 'Content-Type': 'application/json' },
            data: { login: login, password: pswrd }
        }).then((response) => {
            alert.style.visibility = 'visible';
            outp.value = response.data.text;
            console.log(response.data);
            if (response.data.status === "OK") localStorage.setItem('auth', response.data.token), $state.go('dashboard', {})
        }).catch((err) => {
            alert.style.visibility = 'visible';
            outp.value = err.data.text;
        })
    }

    $scope.show_pass = () => {
        var passw = document.querySelector('input[name=pswrd]');
        passw.type = passw.type == 'password' ? 'text' : 'password';
    }
});