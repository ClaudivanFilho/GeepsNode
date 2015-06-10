var assert = require("assert");
var Empresa = require("../../models/empresa");
var Endereco = require("../../models/endereco");
var mongoose = require("mongoose");

describe('Endereco com Empresa TEST', function(){

    beforeEach(function(done){
        var empresa = new Empresa({
            nome: 'bar teste',
            img_path: 'hood-river-day-trip',
            email: 'Day Trip',
            senha: 'asdasdok'
        });
        empresa.save(function(err) {
            var endereco = new Endereco({
                rua : "Rua Joao Lira",
                bairro : "Bela Vista",
                numero : "448",
                cidade : "Campina Grande",
                estado : "Paraiba"
            });
            endereco.save(function(err) {
                empresa.endereco = endereco._id;
                empresa.save(function(){
                    done();
                });
            });
        });
    })

    afterEach(function(done){
        Empresa.remove(function(){
            Endereco.remove(done);
        })
    })

    describe('ENDERECO COM EMPRESA' , function(){

        it('Precisa existir o inverso', function(done){
            Empresa.find({}).populate('endereco').exec(function(err, empresas){
                assert.equal(1, empresas.length);
                assert.equal("Bela Vista", empresas[0].endereco.bairro);
                done();
            });
        })
    });
})