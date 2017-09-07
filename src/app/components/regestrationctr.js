import { psw, baseurl } from '../app.module.js';

psw.controller('regestrationctr', function ($scope, $state, $timeout, $http) {

    $scope.show_pass = () => {
        document.querySelectorAll('.pass').forEach((elem) => {
            elem.type = elem.type == 'password' ? 'text' : 'password';
        })
    }
    $scope.sign_up = () => {
        var alert = document.querySelector('.alert');
        var login = document.querySelector('input[name=login]').value;
        var pswrd = document.querySelector('input[name=pswrd]').value;
        var pswrdrp = document.querySelector('input[name=pswrdrp]').value;
        var outp = document.querySelector('output');

        if (pswrd !== pswrdrp)
            return false,
                alert.style.visibility = 'visible',
                outp.value = 'passwords are not equal';
        $http({
            method: 'POST',
            url: baseurl + '/signup',
            headers: { 'Content-Type': 'application/json' },
            data: { login: login, password: pswrd }
        }).then((response) => {
            alert.style.visibility = 'visible';
            outp.value = response.data.text;
            console.log(response.data.text)
        }).catch((err) => {
            alert.style.visibility = 'visible';
            outp.value = err.data.text;
        })
    }



})