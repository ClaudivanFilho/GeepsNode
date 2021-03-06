var express = require('express');
var path = require('path');
var router = express.Router();
var Empresa = require("../models/empresa");

// ATUALIZA O CARTÃO !!!
router.post('/billing', function(req, res, next){
    var stripeToken = req.body.stripeToken;
    if(!stripeToken){
        return res.status(500).send('Please provide a valid card.');
    }
    Empresa.findById(req.user._id, function(err, user) {
        if (err) return next(err);
        user.setCard(stripeToken, function (err) {
            if (err) {
                if(err.code && err.code == 'card_declined'){
                    return res.status(500).send('Your card was declined. Please provide a valid card.');
                }
                return res.status(500).send('An unexpected error occurred.' + err);
            }
            return res.status(200).send('Billing has been updated.');
        });
    });
});

// ATUALIZA O PLANO !!!
router.post('/plan', function(req, res, next){
    if (!req.user) {
        return res.redirect('/auth/login');
    }

    var plan = req.body.plan;
    var stripeToken = null;

    if(plan){
        plan = plan.toLowerCase();
    }

    if(req.body.stripeToken){
        stripeToken = req.body.stripeToken;
    }

    if(!req.user.stripe.last4 && !req.body.stripeToken){
        return res.status(500).send('Please add a card to your account before choosing a plan.');
    }

    Empresa.findById(req.user._id, function(err, user) {
        if (err) return next(err);

        if(user.stripe.plan == plan){
            return res.status(500).send('The selected plan is the same as the current plan.');
        }

        user.setPlan(plan, stripeToken, function (err) {
            var msg;

            if (err) {
                if(err.code && err.code == 'card_declined'){
                    msg = 'Your card was declined. Please provide a valid card.';
                } else if(err && err.message) {
                    msg = err.message;
                } else {
                    msg = 'An unexpected error occurred.';
                }
                return res.status(500).send(msg);
            }
            req.logout();
            req.session.notice = "You have successfully been logged out!";
            return res.status(200).send('Seu plano foi atualizado com sucesso!');
        });
    });
});

module.exports = router;
