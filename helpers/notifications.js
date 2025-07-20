/*
 * Title: Notifications Library
 * Description: Important functions to notify users
 * Author: Md. Tanvir Arif Siddiqui
 * Date: 7/20/2025 9:29 AM
 *
 */

//dependencies
const https = require("https");
const querystring = require("querystring"); // necessary for Stringify an object
const {twilio} = require("./environment");

//module scaffolding

const notifications = {}


notifications.sendTwilioSms = (phone, msg, callback) => {
    //input validation
    const userPhone = typeof (phone) === "string" && phone.trim().length === 11 ? phone.trim() : false;

    const userMsg = typeof (msg) === "string" && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;

    if (userPhone && userMsg) {
        // configure the request payload
        const payload = {
            Form: twilio.fromPhone,
            To: `+880${userPhone}`,
            Body: userMsg
        }
        //stringify the payload
        const stringifyPayload = querystring.stringify(payload);

        //configure the request details according to the https
        const requestDetails = {
            hostname: 'api.twilio.com',
            method: 'POST',
            path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
            auth: `${twilio.accountSid}:${twilio.authToken}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }

        //instantiate the request object
        const req = https.request(requestDetails, (res) => {
            const status = res.statusCode;

            //callback successfully if the request went through
            if (res.statusCode === 200 || res.statusCode === 201) {
                callback(false);
            } else {
                callback(`Status code returned was: ${status}`);
            }
        });

        req.on('error', (err) => {
            callback(err);
        })

        req.write(stringifyPayload);
        req.end();

    } else {
        callback("Given parameter were missing or invalid!");
    }
};

module.exports = notifications;
