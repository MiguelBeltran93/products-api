"use strict";

const express = require("express");
const appDocs = express();
const router = express.Router();


const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");


const swaggerOptions = {
    swaggerDefinition: {
        info: {
            version: "1.0.0",
            title: "document api",
            description: "API Documentation fo use",
            contact: {
                name: "Miguel Beltran",
                url: "https://www.linkedin.com/in/miguel-%C3%A1ngel-beltr%C3%A1n-p%C3%A9rez-031174172/"
            },
            servers: ["http://localhost:8080/"]
        },

    },
    basePath: "/",
    apis: ["/api/items?q=:item"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

appDocs.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

module.exports = appDocs;