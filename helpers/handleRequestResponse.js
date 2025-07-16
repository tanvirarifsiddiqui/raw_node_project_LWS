/*
 * Title: Handle Request Response
 * Description: handle Request and Response
 * Author: Md. Tanvir Arif Siddiqui
 * Date: 7/14/2025
 * Time: 5:44 PM
 */
//dependencies
const url = require("url");
const {StringDecoder} = require("string_decoder");
const routes = require('../routes');
const {notFoundHandler} = require('../handlers/route_handlers/notFoundHandler');

//Module Scaffolding

const handler = {};
handler.handleRequestResponse = (request, response) => {
    // response handling
    const parsedUrl = url.parse(request.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = request.method.toLowerCase();
    const queryStringObject = parsedUrl.query;
    const headerObject = request.headers;

    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;


    const requestProperties = {
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headerObject,
    };

    chosenHandler(requestProperties, (statusCode, payload) => {
        statusCode = typeof (statusCode) === "number" ? statusCode : 500;
        payload = typeof (payload) === "object" ? payload : {};

        const payloadString = JSON.stringify(payload);


        //return the final response
        response.writeHead(statusCode);
        response.end(payloadString);


    });
    //handling body here
    let decoder = new StringDecoder('utf-8');
    let requestData = "";
    request.on('end', () => {
        requestData += decoder.end();
        console.log(requestData);
    });
    request.on('data', (chunk) => {
        requestData += decoder.write(chunk);
    });

};

//export
module.exports = handler;
