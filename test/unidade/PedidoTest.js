var assert = require("assert");
var Pedido = require("../../models/pedido");
var mongoose = require("mongoose");

/**
 * OBSERVA��o: como o node trabalha de forma assynchrona, ent�o � necess�ria a chamada dessa
 * fun��o done() para indicar que precisa esperar por algum processo.
 *
 * para rodar os test basta ir na prompt e digitar ->  $> mocha
 */

describe('Pedido TEST', function(){

    beforeEach(function(done){
        Pedido.create({
            status : "EM ANDAMENTO"
        }, function(){
            done();
        });
    })

    afterEach(function(done){
        Pedido.remove(done);
    })

    describe('TESTA CRIACAO DE UM Pedido' , function(){
        it('Precisa existir um endereco  no BD', function(done){
            Pedido.find(function(err, pedidos){
                assert.equal(1, pedidos.length);
                done();
            });
        })
    });
})
