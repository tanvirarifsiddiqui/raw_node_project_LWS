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
const {parseJson} = require('../helpers/utilities');

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


    //handling body here
    let decoder = new StringDecoder('utf-8');
    let requestData = "";
    request.on('end', () => {
        requestData += decoder.end();

        // push request properties inside request properties

        requestProperties.body = parseJson(requestData);

        // we have to keep chosen handler here
        chosenHandler(requestProperties, (statusCode, payload) => {
            statusCode = typeof (statusCode) === "number" ? statusCode : 500;
            payload = typeof (payload) === "object" ? payload : {};

            const payloadString = JSON.stringify(payload);


            //return the final response
            response.setHeader("content-type", "application/json");
            response.writeHead(statusCode);
            response.end(payloadString);

        });

    });

    request.on('data', (chunk) => {
        requestData += decoder.write(chunk);

        //i have to add it into the request properties
    });

};

//export
module.exports = handler;
