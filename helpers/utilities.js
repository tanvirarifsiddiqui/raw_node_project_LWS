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

module.exports = utilities;
