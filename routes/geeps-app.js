var express = require('express');
var path = require('path');
var router = express.Router();
var Usuario = require('../models/usuario');
var Pedido = require('../models/pedido');
var gcm = require('../config/gcm-service');

router.post('/cadastro', function(req, res){
    var a = new Usuario({
        nome: req.body.name,
        telefone: req.body.phone,
        codigoPais: req.body.countryCode,
        regId: req.body.regId
    });
    a.save(function(err, a){
        if(err) return res.send(500, 'Error occurred: database error.');
        res.json({'message' : 'usuario cadastrado com sucesso'});
    });
});

router.post('/check', function(req, res){
    var telefone = req.body.phone;
    Usuario.find({
        telefone: telefone
    },function(err, usuarios){
        if (usuarios.length == 0) {
            res.json({'success' : 'usuario nao cadastrado'});
        } else {
            res.json({
                '_id': usuarios[0]._id,
                'nome': usuarios[0].name,
                'telefone': usuarios[0].phone,
                'codigoPais': usuarios[0].countryCode,
                'regId': usuarios[0].regId
            });
        }
    });
});

router.post('/pedidos', function(req, res){
    var telefone = req.body.phone;
    Usuario.find({
        telefone: telefone
    }, function(err, usuarios){
        if (usuarios.length == 0) {
            res.json({'error': 'telefone nao cadastrado'});
        } else {
            var arrayPedidos = [];
            Pedido.find({usuario:usuarios[0]}).populate(['empresa']).exec(function(err, pedidos) {
                for (var i=0; i<pedidos.length; i++) {
                    var jsonObj = {};
                    jsonObj['id'] = pedidos[i]._id;
                    jsonObj['empresa_nome'] = pedidos[i].empresa.nome;
                    arrayPedidos.push(jsonObj);
                }
                return res.json(arrayPedidos);
            });
        }
    });
});



router.get('/testgcm', function(req, res) {
    gcm.sendNotificacaoPedido(
        'APA91bFpJ9lHajNdf41Gi0KyfXtEHjvwo7ZUuvcGuRLI7C0t_or5KjoMQbXUjZ01gfV7Rqo5OfgjKlMQDaKoSB4DcTQ116ZsZULJ4KY6W99gn2-YwtlxQJc',
        'Bar Do Cuscuz',
        "REGISTRADO");
});


module.exports = router;