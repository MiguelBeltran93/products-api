const express = require('express');
const router = express.Router();
const request = require("request");
const utilList = require('../public/javascripts/utils');
let productList = [];
let currency = '';


router.get('/', function (req, res, next) {
    const searchItem = req.query.q;
    request({
        url: `${utilList.URL}/sites/MLA/search?q=${searchItem}`,
        json: false
    }, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            productList = body;
            currency = utilList.getCurrencyByList(body);
        }
        next();
    });
}, function (req, res, next) {
    request({
        url: `${utilList.URL}/currencies/${currency}`,
        json: false
    }, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            res.send(utilList.buildResponseList(productList, body));
        }
    });
});

module.exports = router;