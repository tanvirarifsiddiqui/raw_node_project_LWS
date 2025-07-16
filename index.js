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

// app object module Scaffolding

const app = {};

//configuration

app.config = {
    port: 3000
};


app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`Server listening on port ${app.config.port}`);
    });
};

app.handleReqRes = handleRequestResponse;

app.createServer();
