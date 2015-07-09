var express = require('express');
var router = express.Router();
var path = require('path');
var Empresa = require('../models/empresa');
var Usuario = require("../models/usuario");
var Entregador = require("../models/entregador");

router.get('/entregadores', function(req, res, next) {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    Empresa.find({email: req.user.email}, function(err, empresas){
        Entregador.find({empresa: empresas[0]._id}).populate('usuario').exec(function(err, entregadores){
            return res.render('entregadores', {'empresa' : empresas[0], 'entregadores': entregadores});
        });
    });
});

router.get('/entregador', function(req, res, next) {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    res.sendFile(path.join(__dirname+'/../views/entregador.html'));
});

router.post('/entregador', function(req, res){
    var nome_entregador = req.body.nome_entregador;
    var num_entregador = req.body.telefone_entregador;

    if (num_entregador.trim() == "") {
        res.sendFile(path.join(__dirname+'/../views/entregador.html'), {message: "Número do Entregador Requerido"});
    }
    Usuario.find({
        telefone: num_entregador
    },function(err, usuarios){
        var user;
        if (usuarios.length == 0) {
            // cria um novo Usuario do sistema (Entregador também é usuário)
            user = new Usuario({
                telefone : num_entregador
            });
            user.save(function(){
                var entregador = new Entregador({
                    nome : nome_entregador,
                    usuario : user._id,
                    empresa: req.user._id
                })
                entregador.save(function(){
                    return res.redirect('/empresa/dashboard');
                });
            });
        } else {
            user = usuarios[0];

            Entregador.find({empresa: req.user._id, usuario: user._id}, function (err, entregadores) {
                // Verifica se o telefone passado já consta no banco de entregadores para determinada empresa
                if(entregadores.length == 0){
                    var entregador = new Entregador({
                        usuario : user._id,
                        empresa: req.user._id
                    })
                    entregador.save(function(){
                        return res.redirect('/empresa/dashboard');
                    });
                } else {
                    return res.redirect('/empresa/dashboard');
                }
            });
        }
    });
});

router.post('/entregador/editar', function(req, res){
    var nome_entregador = req.body.nome_entregador;
    var id_entregador = req.body.id_entregador;
    Entregador.update({_id: id_entregador},
        {nome: nome_entregador},
        {upsert: true}).exec(function(err){
            return res.redirect('/empresa/entregadores');
        });
    //TODO testar
});

router.post('/entregador/excluir', function(req, res){
    Entregador.remove({_id:req.body.id_entregador}, function(err){
        if(err){
            return res.redirect('/empresa/dashboard', {message: "Ocorreu um erro interno"});
        }
    });
    return res.redirect('/empresa/entregadores');
});

module.exports = router;
