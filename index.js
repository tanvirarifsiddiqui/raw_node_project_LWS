/*
 * Title: Index File
 * Description: Main Index File
 * Author: Md. Tanvir Arif Siddiqui
 * Date: 7/1/2025
 * Time: 3:42 PM
 */

// dependencies
const http = require('http');
const {handleRequestResponse} = require('./helpers/handleRequestResponse');
const environment = require('./helpers/environment');
const {sendTwilioSms} = require('./helpers/notifications');

// app object module Scaffolding

const app = {};

app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`The Environment Variable is ${process.env.NODE_ENV}`);
        console.log(`Server listening on port ${environment.port}`);
    });
};

app.handleReqRes = handleRequestResponse;

app.createServer();
