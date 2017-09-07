import { psw, baseurl } from '../app.module.js';

psw.controller('dashctr', function ($scope, $state, $timeout, $http) {

    var tok = localStorage.getItem('auth');
    var outp = document.querySelector('output');
    var alert = document.querySelector('.alert');
    var card = document.querySelectorAll('.card');
    var name = document.querySelector('input[name=name]');
    var login = document.querySelector('input[name=login]');
    var pswrd = document.querySelector('input[name=pswrd]');


    $scope.add_app = () => {

        var data = { name: name.value, login: login.value, password: pswrd.value }
        $http({
            method: 'POST',
            url: baseurl + '/addapp',
            headers: { 'Content-Type': 'application/json', 'x-auth': tok },
            data: data
        }).then((response) => {
            alert.style.visibility = 'visible';
            outp.value = response.data.text;
            if (response.data.status === '1') $scope.apps.unshift(data);
        }).catch((err) => {
            console.log(err.data)
        })
    }
    $scope.get_apps = () => {

        $http({
            method: 'POST',
            url: baseurl + '/getapps',
            headers: { 'Content-Type': 'application/json', 'x-auth': tok },
        }).then((response) => {
            if (response.data.docs.length > 0)
                alert.style.visibility = 'visible';
            outp.value = response.data.text;
            $scope.apps = response.data.docs;
        }).catch((err) => {
            console.log(err)
        })
    }
    $scope.delete_app = (id, index) => {
        var alert = document.querySelector('.alert_update_' + index);
        var data = { name: name, login: login, password: pswrd }
        $http({
            method: 'POST',
            url: baseurl + '/deleteapp',
            headers: { 'Content-Type': 'application/json', 'x-auth': tok },
            data: { appid: id }
        }).then((response) => {
            if (response.data.status === '1') alert.style.visibility = 'visible', alert.innerText = response.data.text;;
        }).catch((err) => {
            console.log(err)
        })
    }
    $scope.update_app = (id, index) => {
        var alert = document.querySelector('.alert_update_' + index);
        var login = document.querySelector('input[name=updatelogin_' + index + ']').value;
        var pswrd = document.querySelector('input[name=updatepswrd_' + index + ']').value;

        var data = { appid: id, name: name, login: login, password: pswrd }
        $http({
            method: 'POST',
            url: baseurl + '/updateapp',
            headers: { 'Content-Type': 'application/json', 'x-auth': tok },
            data: data
        }).then((response) => {
            alert.style.visibility = 'visible';
            alert.innerText = response.data.text;
        }).catch((err) => {
            console.log(err)
        })
    }

    $scope.logout = () => {
        localStorage.removeItem('auth');
        $state.go('home', {})
    }
    $scope.show_pass = () => {
        [].forEach.call(document.querySelectorAll('.pass'), (elm) => { elm.type = elm.type == 'password' ? 'text' : 'password' });
    }
    $scope.get_apps();

})