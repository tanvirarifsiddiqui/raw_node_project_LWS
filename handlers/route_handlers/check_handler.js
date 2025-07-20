//dependencies
const data = require("../../lib/data");
const {parseJson, createRandomString} = require("../../helpers/utilities");
const tokenHandler = require("./token_handler");
const {maxChecks} = require("../../helpers/environment");
//Module Scaffolding
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
    //perform required operation

    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._check[requestProperties.method](requestProperties, callback);
    } else
        callback(405);
}

handler._check = {} //private module scaffolding

handler._check.post = (requestProperties, callback) => {
    //validate inputs
    let protocol = typeof (requestProperties.body.protocol) === "string"
    && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1
        ? requestProperties.body.protocol : false;

    let url = typeof (requestProperties.body.url) === "string"
    && requestProperties.body.url.trim().length > 0
        ? requestProperties.body.url : false;

    let method = typeof (requestProperties.body.method) === "string"
    && ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1
        ? requestProperties.body.method : false;

    let successCode = typeof (requestProperties.body.successCode) === "object"
    && requestProperties.body.successCode instanceof Array
        ? requestProperties.body.successCode : false;

    let timeoutSeconds = typeof (requestProperties.body.timeoutSeconds) === "number"
    && requestProperties.body.timeoutSeconds % 1 === 0 && requestProperties.body.timeoutSeconds >= 1 && requestProperties.body.timeoutSeconds <= 5
        ? requestProperties.body.timeoutSeconds : false;

    //Next step
    if (protocol && url && method && successCode && timeoutSeconds) {
        //token validation
        const token = typeof (requestProperties.headerObject.token) === "string"
        && requestProperties.headerObject.token.trim().length === 21
            ? requestProperties.headerObject.token : false;
        // Lookup the user phone by reading the token
        data.read('tokens', token, (err, tokenData) => {
            if (!err && tokenData) {
                const phoneNumber = parseJson(tokenData).phoneNumber;
                data.read('users', phoneNumber, (err, userData) => {
                    if (!err && userData) {
                        tokenHandler._token.verify(token, phoneNumber, (isTokenVerified) => {
                            if (isTokenVerified) {
                                const userObject = parseJson(userData);
                                const userChecks = typeof (userObject.checks) === "object"
                                && userObject.checks instanceof Array ? userObject.checks : [];
                                if (userChecks.length < maxChecks) {
                                    const checkId = createRandomString(20);
                                    const checkObject = {
                                        id: checkId,
                                        userPhone: phoneNumber,
                                        protocol,
                                        url,
                                        method,
                                        successCode,
                                        timeoutSeconds
                                    };

                                    // save the object
                                    data.create('checks', checkId, checkObject, (err) => {
                                        if (!err) {
                                            //now save the check object into the main users database
                                            userObject.checks = userChecks;
                                            userObject.checks.push(checkId);

                                            //now save the new user data
                                            data.update('users', phoneNumber, userObject, (err) => {
                                                if (!err) {

                                                    //return the data about the new check
                                                    callback(200, checkObject);
                                                } else {
                                                    callback(500, {
                                                        error: "There was a problem in the server side",
                                                    });
                                                }
                                            });
                                        } else {
                                            callback(500, {
                                                error: "There was a problem in the server side",
                                            });
                                        }
                                    });

                                } else {
                                    callback(401, {
                                        error: "Users Already reached max check limit"
                                    })
                                }
                            }
                        });
                    } else {
                        callback(403, {
                            error: "Authentication Error",
                        });
                    }
                });

            } else {
                callback(403, {
                    error: "Authentication Error",
                });
            }
        });

    } else {
        callback(400, {
            error: "There was a problem in your request",
        });
    }

};

handler._check.get = (requestProperties, callback) => {

    const id = typeof (requestProperties.queryStringObject.id) === "string"
    && requestProperties.queryStringObject.id.trim().length === 21
        ? requestProperties.queryStringObject.id : false;

    if (id) {
        //lookup the check
        data.read('checks', id, (err, checkData) => {
            if (!err && checkData) {
                //token validation
                const token = typeof (requestProperties.headerObject.token) === "string"
                && requestProperties.headerObject.token.trim().length === 21
                    ? requestProperties.headerObject.token : false;
                // Lookup the user phone by reading the token
                data.read('tokens', token, (err, tokenData) => {
                    if (!err && tokenData) {
                        const phoneNumber = parseJson(tokenData).phoneNumber;
                        data.read('users', phoneNumber, (err, userData) => {
                            if (!err && userData) {
                                tokenHandler._token.verify(token, phoneNumber, (isTokenVerified) => {
                                    if (isTokenVerified) {
                                        callback(200, parseJson(checkData));
                                    } else {
                                        callback(403, {
                                            error: "Authentication Error",
                                        });
                                    }
                                });
                            } else {
                                callback(403, {
                                    error: "Authentication Error",
                                });
                            }
                        });

                    } else {
                        callback(403, {
                            error: "Authentication Error",
                        });
                    }
                });

            } else {
                callback(500, {
                    error: "Checks Not Found! You  have a problem in your request",
                });
            }
        },)
    } else {
        callback(400, {
            error: "You  have a problem in your request",
        });
    }

};

handler._check.put = (requestProperties, callback) => {

    //validate inputs
    const id = typeof (requestProperties.queryStringObject.id) === "string"
    && requestProperties.queryStringObject.id.trim().length === 21
        ? requestProperties.queryStringObject.id : false;

    let protocol = typeof (requestProperties.body.protocol) === "string"
    && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1
        ? requestProperties.body.protocol : false;

    let url = typeof (requestProperties.body.url) === "string"
    && requestProperties.body.url.trim().length > 0
        ? requestProperties.body.url : false;

    let method = typeof (requestProperties.body.method) === "string"
    && ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1
        ? requestProperties.body.method : false;

    let successCode = typeof (requestProperties.body.successCode) === "object"
    && requestProperties.body.successCode instanceof Array
        ? requestProperties.body.successCode : false;

    let timeoutSeconds = typeof (requestProperties.body.timeoutSeconds) === "number"
    && requestProperties.body.timeoutSeconds % 1 === 0 && requestProperties.body.timeoutSeconds >= 1 && requestProperties.body.timeoutSeconds <= 5
        ? requestProperties.body.timeoutSeconds : false;

    //Next step
    if (id) {
        if (protocol || url || method || successCode || timeoutSeconds) {
            //token validation
            const token = typeof (requestProperties.headerObject.token) === "string"
            && requestProperties.headerObject.token.trim().length === 21
                ? requestProperties.headerObject.token : false;
            // Lookup the user phone by reading the token
            data.read('checks', id, (err, checkData) => {
                if (!err && checkData) {
                    const checkObject = parseJson(checkData);
                    const phoneNumber = checkObject.userPhone;
                    tokenHandler._token.verify(token, phoneNumber, (isTokenVerified) => {
                        if (isTokenVerified) {
                            if (protocol) {
                                checkObject.protocol = protocol;
                            }
                            if (url) {
                                checkObject.url = url;
                            }
                            if (method) {
                                checkObject.method = method;
                            }
                            if (successCode) {
                                checkObject.successCode = successCode;
                            }
                            if (timeoutSeconds) {
                                checkObject.timeoutSeconds = timeoutSeconds;
                            }

                            // save the object
                            data.update('checks', id, checkObject, (err) => {
                                if (!err) {

                                    //return the data about the new check
                                    callback(200, {
                                        message: "Successfully updated check data.",
                                    });

                                } else {
                                    callback(500, {
                                        error: "There was a problem in the server side",
                                    });
                                }
                            });
                        } else {
                            callback(403, {
                                error: "Authentication Error",
                            });
                        }
                    });


                } else {
                    callback(403, {
                        error: "checks not found!",
                    });
                }
            });
        } else {
            callback(400, {
                error: "you must provide at least one field to update!",
            })
        }

    } else {
        callback(400, {
            error: "Check not Found!",
        });
    }

};

handler._check.delete = (requestProperties, callback) => {
    //validate inputs
    const id = typeof (requestProperties.queryStringObject.id) === "string"
    && requestProperties.queryStringObject.id.trim().length === 21
        ? requestProperties.queryStringObject.id : false;

    if (id) {
        // token validation
        const token = typeof (requestProperties.headerObject.token) === "string"
        && requestProperties.headerObject.token.trim().length === 21
            ? requestProperties.headerObject.token : false;

        if (token) {
            data.read('checks', id, (err, checkData) => {
                if (!err && checkData) {
                    const checkObject = parseJson(checkData);
                    const phoneNumber = checkObject.userPhone;

                    //verify token
                    tokenHandler._token.verify(token, phoneNumber, (isTokenVerified) => {
                        //deleting the token and remove from user checks
                        if (isTokenVerified) {
                            data.read("users", phoneNumber, (err, userData) => {
                                const userObject = parseJson(userData);
                                if (!err) {
                                    const removeIndex = userObject.checks.indexOf(id);
                                    if (removeIndex > -1) {
                                        userObject.checks.splice(removeIndex, 1);
                                        data.delete(`checks`, id, (err) => {
                                            if (!err) {
                                                data.update('users', phoneNumber, userObject, (err) => {
                                                    if (!err) {
                                                        callback(200, {
                                                            message: "Successfully deleted check data, and updated user database",
                                                        })
                                                    } else {
                                                        callback(500, {
                                                            error: "There was a problem in the server side",
                                                        })
                                                    }
                                                })
                                            } else {
                                                callback(500, {
                                                    error: "There was a problem in the server side",
                                                })
                                            }
                                        })
                                    } else {
                                        callback(404, {
                                            message: "User doesn't have the check value"
                                        })
                                    }
                                } else {
                                    callback(500, {
                                        error: "Internal Server Error",
                                    })
                                }
                            })
                        } else {
                            callback(403, {
                                error: "Authentication Error",
                            });
                        }
                    });
                } else {
                    callback(403, {
                        error: "Authentication Error, check id dos not exist!",
                    })
                }
            });
        } else {
            callback(403, {
                    error: "Authentication Error",
                }
            )
        }
    } else {
        callback(400, {
            error: "Check not Found!",
        });
    }
};


module.exports = handler;
