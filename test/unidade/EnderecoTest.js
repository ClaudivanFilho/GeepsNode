var assert = require("assert");
var Empresa = require("../../models/empresa");
var Endereco = require("../../models/endereco");
var mongoose = require("mongoose");

/**
 * OBSERVA��o: como o node trabalha de forma assynchrona, ent�o � necess�ria a chamada dessa
 * fun��o done() para indicar que precisa esperar por algum processo.
 *
 * para rodar os test basta ir na prompt e digitar ->  $> mocha
 */

describe('Endereco TEST', function(){

    beforeEach(function(done){
        // cria uma empresa
        Endereco.create({
            rua : "Rua Joao Lira",
            bairro : "Bela Vista",
            numero : "448",
            cidade : "Campina Grande",
            estado : "Paraiba",
        }, function(){
            done();
        });
    })

    afterEach(function(done){
        // remove todos os registros do bd
        Endereco.remove({}, function(){
            done();
        });
    })

    describe('TESTA CRIACAO DE UM ENDERECO' , function(){
        it('Precisa existir um endereco  no BD', function(done){
            Endereco.find(function(err, enderecos){
                assert.equal(1, enderecos.length);
                done();
            });
        })
    });
})
