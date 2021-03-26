const express = require('express');
const router = express.Router();
const request = require("request");
const utilDetail = require('./products-utils');
let detail = {};
let description = {};
let currency = '';
let itemId = '';


router.get('/:id', function (req, res, next) {
     itemId = req.params.id;
    request({
        url: `${utilDetail.URL}/items/${itemId}`,
        json: false
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            detail = body;
            currency = utilDetail.getCurrency(body);
        }
        next();
    })
}, function (req, res, next) {
    request({
        url: `${utilDetail.URL}/items/${itemId}/description`,
        json: false
    }, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            description = body;
        }
        next();
    });
}, function (req, res, next) {
    request({
        url: `${utilDetail.URL}/currencies/${currency}`,
        json: false
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            res.send(utilDetail.buildDetail(detail, description, body));
        }
    })
});

module.exports = router;