/*
 * Title: User Handler
 * Description: Handler to handle user related routes
 * Author: Md. Tanvir Arif Siddiqui
 * Date: 7/14/2025
 * Time: 5:46 PM
 */

//dependencies
const data = require("../../lib/data");
const {hashString} = require("../../helpers/utilities");
const {parseJson} = require("../../helpers/utilities");

//Module Scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
    //perform required operation

    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._user[requestProperties.method](requestProperties, callback);
    } else
        callback(405);
}

handler._user = {} //private module scaffolding


handler._user.get = (requestProperties, callback) => {

    //phone number validation
    const phoneNumber = typeof (requestProperties.queryStringObject.phone) === "string"
    && requestProperties.queryStringObject.phone.trim().length === 11
        ? requestProperties.queryStringObject.phone
        : false;

    if (phoneNumber) {
        data.read('users', phoneNumber, (err, userInfo) => {
            if (!err && userInfo) {
                const parsedUserObject = {...parseJson(userInfo)};
                delete parsedUserObject.password;
                console.log(parsedUserObject);
                callback(200, parsedUserObject);
            } else {
                callback(404, {
                    error: "Requested user not found!",
                });
            }
        });
    } else {
        callback(404, {
            error: "Requested user not found!",
        });
    }
};


handler._user.post = (requestProperties, callback) => {
    //first name validation
    const firstName = typeof (requestProperties.body.firstName) === "string"
    && requestProperties.body.firstName.trim().length > 0
        ? requestProperties.body.firstName
        : null;

    //LastName  validation
    const lastName = typeof (requestProperties.body.lastName) === "string"
    && requestProperties.body.lastName.trim().length > 0
        ? requestProperties.body.lastName
        : null;

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


    //TOS check validation
    const tosAgreement = typeof (requestProperties.body.tosAgreement) === "boolean"
        ? requestProperties.body.tosAgreement
        : false;

    // console.log(firstName + " " + lastName + " " + phoneNumber + " " + password + " " + tosAgreement);

    if (firstName && lastName && phoneNumber && password && tosAgreement) {
        data.read("users", phoneNumber, (err, fileContent) => {
            if (err) {
                const userObject = {
                    firstName,
                    lastName,
                    phoneNumber,
                    password: hashString(password), //password Encryption
                    tosAgreement
                };

                // Now Storing Data into file
                data.create("users", phoneNumber, userObject, (err) => {
                    if (!err) {
                        callback(200, {
                            message: "user created successfully"
                        });
                    } else {
                        callback(500, {
                            error: "couldn't create user!",
                        })
                    }
                });


            } else callback(500, {
                message: "there is a problem server side"
            })
        });
    } else {
        callback(400, {
            error: "you have a problem in your request"
        });
    }

};


handler._user.put = (requestProperties, callback) => {
    //first name validation
    const firstName = typeof (requestProperties.body.firstName) === "string"
    && requestProperties.body.firstName.trim().length > 0
        ? requestProperties.body.firstName
        : null;

    //LastName  validation
    const lastName = typeof (requestProperties.body.lastName) === "string"
    && requestProperties.body.lastName.trim().length > 0
        ? requestProperties.body.lastName
        : null;

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

    if (phoneNumber) {

        if (firstName || lastName || password) {
            data.read("users", phoneNumber, (err, fileContent) => {
                const userData = {...parseJson(fileContent)};
                if (!err && fileContent) {
                    if (firstName) {
                        userData.firstName = firstName;
                    }
                    if (lastName) {
                        userData.lastName = lastName;
                    }
                    if (password) {
                        userData.password = hashString(password);
                    }

                    // Now Storing Data into file
                    data.update("users", phoneNumber, userData, (err) => {
                        if (!err) {
                            callback(200, {
                                message: "user updated successfully"
                            });
                        } else {
                            callback(500, {
                                error: "couldn't update user!",
                            })
                        }
                    });


                } else callback(500, {
                    message: "there is a problem server side"
                })
            });
        } else {
            callback(400, {
                error: "you have a problem in your request"
            });
        }

    } else {

        callback(400, {
            error: "invalid phone number"
        })
    }


};

handler._user.delete = (requestProperties, callback) => {
    //phone number validation
    const phoneNumber = typeof (requestProperties.queryStringObject.phone) === "string"
    && requestProperties.queryStringObject.phone.trim().length === 11
        ? requestProperties.queryStringObject.phone
        : false;

    if (phoneNumber) {
        data.delete("users", phoneNumber, (err) => {
            if (!err) {
                callback(200, {
                    message: "user deleted successfully"
                })
            }
        })
    } else {
        callback(400, {
            error: "invalid phone number"
        })
    }
};


module.exports = handler;
