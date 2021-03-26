const express = require('express');
const router = express.Router();
const request = require("request");
const utilList = require('./products-utils');
let productListController = [];
let currency = '';

/**
 * @swagger
 * /api/items?q=:item:
 *  get:
 *      summary: GET and add query param q=:item
 *      description: use to request list products by name item
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: param
 *            name: q
 *            description: name item for search
 *     responses:
 *      200:
 *          description: items search by name
 *          schema;
 *          type: json
 *
 *
 */
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