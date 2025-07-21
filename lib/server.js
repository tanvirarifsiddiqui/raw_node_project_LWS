/*
 * Title: Server Library
 * Description: Server Related files
 * Author: Md. Tanvir Arif Siddiqui
 * Date: 7/1/2025
 * Time: 3:42 PM
 */

// dependencies
const http = require('http');
const {handleRequestResponse} = require('../helpers/handleRequestResponse');
const environment = require('../helpers/environment');

// server object module Scaffolding

const server = {};

server.createServer = () => {
    const createServerVariable = http.createServer(server.handleReqRes);
    createServerVariable.listen(environment.port, () => {
        console.log(`The Environment Variable is ${process.env.NODE_ENV}`);
        console.log(`Server listening on port ${environment.port}`);
    });
};

server.handleReqRes = handleRequestResponse;

server.init = () => {
    server.createServer();
};

module.exports = server;
