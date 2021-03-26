const express = require('express');
const router = express.Router();
const request = require("request");
const utilList = require('./products-utils');
let productListController = [];
let currency = '';


router.get('/', function (req, res, next) {
    const searchItem = req.query.q;
    request({
        url: `${utilList.URL}/sites/MLA/search?q=${searchItem}`,
        json: false
    }, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            productListController = body;
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
            res.send(utilList.buildResponseList(productListController, body));
        }
    });
});

module.exports = router;