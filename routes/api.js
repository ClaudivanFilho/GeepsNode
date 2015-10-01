var express = require('express');
var path = require('path');
var router = express.Router();
var Empresa = require('../models/empresa');
var Usuario = require('../models/usuario');
var Entregador = require('../models/entregador');
var Pedido = require('../models/pedido');

router.get('/cleardb', function(req, res, next) {
    Usuario.remove(function() {
        Empresa.remove(function() {
            Entregador.remove(function() {
                Pedido.remove(function() {
                    return res.render('auth/login');
                });
            });
        });
    });
});

router.get('/empresas', function(req, res, next) {
    Empresa.find(function(err, empresas) {
        res.send(empresas);
    })
});

router.get('/usuarios', function(req, res, next) {
    Usuario.find(function(err, usuarios) {
        res.send(usuarios);
    })
});

router.get('/entregadores', function(req, res, next) {
    Entregador.find(function(err, entregadores) {
        res.send(entregadores);
    })
});

router.get('/api/empresa', function(req, res, next) {
    Empresa.findOne({
        email: req.user.email
    }).populate('endereco').exec(function(err, empresa) {
        return res.json(empresa);
    });
});

router.get('/api/entregadores', function(req, res, next) {
    Entregador.find({
        empresa: req.user._id
    }).populate('usuario').exec(function(err, entregadores) {
        return res.json(entregadores);
    });
});

router.get('/api/pedidos', function(req, res, next) {
    if (!req.user) {
        return res.error("nenhum usuário antenticado");
    }
    Pedido.find({
        $and: [{
            empresa: req.user._id
        }, {
            $or: [{
                status: 'EM ANDAMENTO'
            }, {
                status: 'REGISTRADO'
            }]
        }]
    }).populate(['endereco_entrega', 'cliente', 'entregador']).exec(function(err, pedidos) {
        Pedido.populate(pedidos, {
            path: 'entregador.usuario',
            model: 'Usuario'
        }, function(err, pedidos) {
            return res.json(pedidos);
        });
    });
});

module.exports = router;