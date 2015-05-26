var express = require('express');
var path = require('path');
var router = express.Router();
var Empresa = require('../models/empresa');

router.get('/dashboard', function(req, res, next) {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    return res.render('dashboard', {'email' : req.user.email});
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/auth/login');
    req.session.notice = "You have successfully been logged out !";
});

module.exports = router;