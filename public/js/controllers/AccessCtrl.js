angular.module("GeepsAccess")
    .controller('AccessCtrl', AccessController);

AccessController.$inject = ['$scope', '$http'];

function AccessController($scope, $http) {

    $scope.plans = [
        {
            id : 'economico',
            nome : 'Econômico',
            preco : 'R$ 75,00'
        },
        {
            id : 'completo',
            nome : 'Completo',
            preco : 'R$ 150,00 (Grátis 30 dias de avaliação)'
        },
        {
            id : 'master',
            nome : 'Master',
            preco : 'R$ 200,00'
        }
    ];

    $scope.registerdata = {};

    $scope.registerdata.stripe = {};

    $scope.registerdata.stripe.plan = 'completo';

    $scope.submitLogin = function() {
        $http.post('/auth/login', $scope.logindata)
            .success(function() {
                window.location.href = '/';
            })
            .error(function(data) {
                $scope.error = data;
                $scope.password = "";
            });
    }

    $scope.submitRegister = function() {
        console.log($scope.registerdata);
        $http.post('/auth/register', $scope.registerdata)
            .success(function() {
                window.location.href = '/auth/login';
            })
            .error(function(data) {
                $scope.error = data;
            });

    }

}
