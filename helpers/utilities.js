const crypto = require('crypto');
const environment = require('./environment');

const utilities = {};


//converting json string to object with validation
utilities.parseJson = (stringJson) => {
    let output;

    try {
        output = JSON.parse(stringJson);
    } catch (error) {
        output = {};
    }
    return output;
};

//Hash String
utilities.hashString = (str => {
    if (typeof str === 'string' && str.length > 0) {
        return crypto
            .createHmac('sha256', environment.secretKey)
            .update(str)
            .digest('hex');
    } else {
        return false;
    }
});

utilities.createRandomString = (strLength => {

    let length = strLength;
    length = typeof (strLength) === 'number' && strLength > 0 ? strLength : false;
    let output = '';
    if (length) {
        let possibleCharacters = 'abcdefghijklmnopqrstuvwxyz1234567890';
        for (let i = 0; i <= length; i++) {
            output += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
        }
        console.log(output)
    }
    return output;
});

module.exports = utilities;
