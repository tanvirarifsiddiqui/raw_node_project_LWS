/*
 * Title: Token Handler
 * Description: Handler to handle Token related routes
 * Author: Md. Tanvir Arif Siddiqui
 * Date: 18/14/2025
 * Time: 5:46 PM
 */

//dependencies
const data = require('../../lib/data');
const {hashString} = require("../../helpers/utilities");
const {parseJson} = require("../../helpers/utilities");
const {createRandomString} = require("../../helpers/utilities");

//Module Scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
    //perform required operation

    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._token[requestProperties.method](requestProperties, callback);
    } else
        callback(405);
}

handler._token = {} //private module scaffolding


handler._token.get = (requestProperties, callback) => {

    //validation token
    const token = typeof (requestProperties.queryStringObject.token) === "string"
    && requestProperties.queryStringObject.token.trim().length === 21
        ? requestProperties.queryStringObject.token
        : false;

    if (token) {
        data.read("tokens", token, (err, tokenInfo) => {
            const tokenObject = parseJson(tokenInfo);
            if (!err && tokenInfo) {
                callback(200, tokenObject);
            } else {
                callback(404, {
                    error: "requested user not found!"
                });
            }
        });

    } else {
        callback(400, {
            error: "Invalid token",
        })
    }

};


handler._token.post = (requestProperties, callback) => {

    //just like login feature
    //phone number validation
    const phoneNumber = typeof (requestProperties.body.phone) === "string"
    && requestProperties.body.phone.trim().length === 11
        ? requestProperties.body.phone
        : false;

    //password validation
    const password = typeof (requestProperties.body.password) === "string"
    && requestProperties.body.password.trim().length > 0
        ? requestProperties.body.password
        : null;

    if (phoneNumber && password) {

        data.read('users', phoneNumber, (err, result) => {
            const resultObject = parseJson(result);
            let hashedPassword = hashString(password);
            if (hashedPassword === resultObject.password) {
                //creating new token
                let tokenId = createRandomString(20);
                let expires = Date.now() + 60 * 60 * 1000;
                let tokenObject = {
                    phoneNumber,
                    'id': tokenId,
                    expires
                }

                //store token
                data.create('tokens', tokenId, tokenObject, (err, result) => {
                    if (!err) {
                        callback(200, tokenObject);
                    } else {
                        callback(500, {
                            error: "There is a problem in server",
                        });
                    }
                });
            }
        })

    } else {
        callback(400, {
            error: 'You have a problem in your request',
        });
    }

};


handler._token.put = (requestProperties, callback) => {

    //validation token
    const token = typeof (requestProperties.body.token) === "string"
    && requestProperties.body.token.trim().length === 21
        ? requestProperties.body.token
        : false;

    const extend = typeof (requestProperties.body.extend) === "boolean"
    && requestProperties.body.extend === true
        ? requestProperties.body.extend
        : false;

    if (token && extend) {
        // token Validation
        data.read("tokens", token, (err, result) => {
            if (!err && result) {
                const resultObject = parseJson(result);
                //checking token is expired or not
                if (resultObject.expires > Date.now()) {
                    resultObject.expires = Date.now() + 60 * 60 * 1000;
                    data.update("tokens", token, resultObject, (err) => {
                        if (!err) {
                            callback(200, {
                                message: "token extended successfully",
                            });
                        } else {
                            callback(404, {
                                error: "requested user not found!"
                            });
                        }
                    });
                } else {
                    callback(404, {
                        error: "Token Already Expired!"
                    })
                }

            } else {
                callback(404, {
                    error: "Invalid token",
                })
            }
        })
    } else {
        callback(400, {
            error: "There was a problem in your request",
        })
    }
};

handler._token.delete = (requestProperties, callback) => {
    //validation token
    const token = typeof (requestProperties.queryStringObject.token) === "string"
    && requestProperties.queryStringObject.token.trim().length === 21
        ? requestProperties.queryStringObject.token
        : false;
    if (token) {
        data.delete("tokens", token, (err) => {
            if (!err) {
                callback(200, {
                    message: "token deleted successfully",
                })
            } else {
                callback(404, {
                    error: "There was a problem in server",
                })
            }
        })
    } else {
        callback(404, {
            error: "Invalid token",
        })
    }

};


module.exports = handler;
