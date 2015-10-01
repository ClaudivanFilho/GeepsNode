angular.module("Geeps")
    .controller('BaseCtrl', BaseController);

BaseController.$inject = ['$scope', '$http', 'Pedidos', 'Entregadores', 'Empresa'];

function BaseController($scope, $http, Pedidos, Entregadores, Empresa) {

    $scope.pedService = Pedidos;
    $scope.entService = Entregadores;
    $scope.empService = Empresa;

    $scope.logout = logout;

    function logout() {
        console.log("looogout");
        $http.get('/empresa/logout')
            .success(function(data) {
                window.location.href = '/auth/login';
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }
}
