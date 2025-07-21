/*
 * Title: Project Initial File
 * Description: Main Index File
 * Author: Md. Tanvir Arif Siddiqui
 * Date: 7/1/2025
 * Time: 3:42 PM
 */

// dependencies
const http = require('http');
const {handleRequestResponse} = require('./helpers/handleRequestResponse');
const environment = require('./helpers/environment');
const server = require('./lib/server');
const workers = require('./lib/worker');

// app object module Scaffolding

const app = {};

app.init = () => {
    //start the server
    server.init();

    // start the workers
    workers.init();
}

app.init();


module.exports = app;
