var assert = require("assert");
var Pedido = require("../../models/pedido");
var mongoose = require("mongoose");
var Usuario = require("../../models/usuario");
var Empresa = require("../../models/empresa");
var Endereco = require("../../models/endereco");
var Entregador = require("../../models/entregador");


/**
 * OBSERVA��o: como o node trabalha de forma assynchrona, ent�o � necess�ria a chamada dessa
 * fun��o done() para indicar que precisa esperar por algum processo.
 *
 * para rodar os test basta ir na prompt e digitar ->  $> mocha
 */

describe('Entregador TEST', function(){

    beforeEach(function(done){
        var empresa = new Empresa({
            nome: 'bar teste',
            img_path: 'hood-river-day-trip',
            email: 'Day Trip',
            senha: 'asdasdok'
        });

        empresa.save(function(err){
            var endereco = new Endereco({
                rua : "Rua Joao Lira",
                bairro : "Bela Vista",
                numero : "448",
                cidade : "Campina Grande",
                estado : "Paraiba"
            });
            endereco.save(function(err) {
                var usuario = new Usuario({
                    name: "Cliente",
                    phone: "99876534",
                    countryCode: "+55",
                    regId: "aopdpaodspoajsdij1231ej1d09"
                });

                var usuario2 = new Usuario({
                    name: "Entregador",
                    phone: "99876534",
                    countryCode: "+55",
                    regId: "aopdpaodspoajsdij1231ej1d09"
                });

                var entregador = new Entregador({
                    usuario : usuario2._id,
                    empresa: empresa._id
                });

                usuario.save(function(){
                    usuario2.save(function(){
                        entregador.save(function(){
                            done();
                        });
                    });
                });
            });
        });

    });

    afterEach(function(done) {
        // remove todos os registros do bd
        Empresa.remove({}, function () {
            Usuario.remove({}, function () {
                Entregador.remove({}, function () {
                    done();
                });
            });
        });
    });

    describe('TESTA CRIACAO DO USUARIO' , function(){
        it('Precisa existir uma usuario no BD', function(done){
            Usuario.find(function(err, usuarios){
                assert.equal(2, usuarios.length);
                Empresa.find(function(err, empresas) {
                    assert.equal(1, empresas.length);
                    Entregador.find(function (err, entregadores) {
                        assert.equal(1, entregadores.length);
                        assert.equal(usuarios[1].name, "Entregador");
                        assert.equal(empresas[0]._id, entregadores[0].empresa);
                        assert.equal(usuarios[1]._id, entregadores[0].usuario);
                        done();
                    });
                });
            });
        });
    });
});