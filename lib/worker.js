/*
 * Title: workers Library
 * Description: worker Related files
 * Author: Md. Tanvir Arif Siddiqui
 * Date: 7/1/2025
 * Time: 3:42 PM
 */

// dependencies
const data = require('./data');
const {parseJson} = require('../helpers/utilities');
const url = require('url');
const http = require('http');
const https = require('https');
const {sendTwilioSms} = require('../helpers/notifications')

// worker object module Scaffolding

const worker = {};

// lookup all the checks
worker.gatherAllChecks = () => {
    //get all the checks
    data.list("checks", (err1, checks) => {
        if (!err1 && checks && checks.length > 0) {
            checks.forEach(check => {
                //read the data
                data.read('checks', check, (err2, fullCheckData) => {
                    if (!err2 && fullCheckData) {
                        const fullCheckDataObject = parseJson(fullCheckData);
                        // pass the data to the check validator
                        worker.validateCheckData(fullCheckDataObject);

                    } else {
                        console.log("Error: reading one of hte checks data");
                    }
                });
            })
        } else {
            console.log("Error: could not find any checks to process!")
        }
    })
};

// validate individual check data
worker.validateCheckData = (fullCheckDataObject) => {
    const originalCheckData = fullCheckDataObject;
    if (originalCheckData && originalCheckData.id) {
        originalCheckData.state = typeof (originalCheckData.state) === 'string' && ['up', 'down'].indexOf(originalCheckData.state) > -1
            ? originalCheckData.state : 'down';

        originalCheckData.lastChecked = typeof (originalCheckData.lastChecked) === 'number' && originalCheckData.lastChecked > 0
            ? originalCheckData.lastChecked : false;

        //pass to the next process
        worker.performCheck(originalCheckData);


    } else {
        console.log("Error: check was invalid or not properly formatted");
    }
}

//perform check
worker.performCheck = (originalCheckData) => {
    //prepare the initial check outcome
    let checkOutcome = {
        'error': false,
        'responseCode': false,
    };

    //mark the outcome has not be sent yet
    let outComeSent = false;

    // parse the full hostname & full url from original data
    const parsedUrl = url.parse(`${originalCheckData.protocol}://${originalCheckData.url}`, true);
    const hostname = parsedUrl.hostname;
    const {path} = parsedUrl.path;

    //construct the request
    const requestDetails = {
        'protocol': `${originalCheckData.protocol}:`,
        'hostname': hostname,
        'method': originalCheckData.method.toUpperCase(),
        'path': path,
        // timeout: originalCheckData.timeout * 1000,
        'timeout': originalCheckData.timeoutSeconds * 1000,
    };

    const protocolToUse = originalCheckData.protocol === 'http' ? http : https;

    let req = protocolToUse.request(requestDetails, (response) => {
        //grab the status of the response
        //update the check outcome and pass to the next process
        checkOutcome.responseCode = response.statusCode;
        if (!outComeSent) {
            worker.processCheckOutcome(originalCheckData, checkOutcome);
            outComeSent = true;
        }

    });

    req.on('error', (e) => {
        checkOutcome = {
            'error': true,
            'value': e,
        };
        if (!outComeSent) {
            worker.processCheckOutcome(originalCheckData, checkOutcome);
            outComeSent = true;
        }
    });

    req.on('timeout', () => {
        checkOutcome = {
            'error': true,
            'value': 'timeout',
        };
        if (!outComeSent) {
            worker.processCheckOutcome(originalCheckData, checkOutcome);
            outComeSent = true;
        }
    });

    //req send
    req.end();

}

//save check outcome to database and send to next process
worker.processCheckOutcome = (originalCheckData, checkOutcome) => {
    //  check if checkoutcome up or down

    let state = !checkOutcome.error && checkOutcome.responseCode && originalCheckData.successCode.indexOf(checkOutcome.responseCode) > -1 ? 'up' : 'down';

    //decide whether we should alert the user or not
    const alertWanted = originalCheckData.lastChecked && originalCheckData.state !== state;

    //update the check data
    let newCheckData = originalCheckData;

    newCheckData.state = state;
    newCheckData.lastChecked = Date.now();

    //update the check to disk
    data.update('checks', newCheckData.id, newCheckData, (err) => {
        if (!err) {
            if (alertWanted) {
                //send the check data to next progress
                // worker.alertUserToStatusChange(newCheckData);
                let msg = `Alert: your check for ${newCheckData.method.toLocaleString()} ${newCheckData.protocol}://${newCheckData.url} is currently ${newCheckData.state}`;
                console.log(msg);
            } else {
                console.log('Alert is not needed as there is no state change!')
            }
        } else {
            console.log("Error trying to save check data of one of the checks!");
        }
    });

}

//send notification sms to user if state changes
worker.alertUserToStatusChange = (newCheckData) => {
    let msg = `Alert: your check for ${newCheckData.method.toLocaleString()} ${newCheckData.protocol}://${newCheckData.url} is currently ${newCheckData.state}`;

    sendTwilioSms(newCheckData.userPhone, msg, (err) => {
        if (!err) {
            console.log(`User was alerted to a status chang via SMS: ${msg}`);
        } else {
            console.log("There was a problem sending one sms to one of the user!");
        }
    });
}

// timer to execute the worker process once per minute
worker.loop = () => {

    setInterval(() => {
        worker.gatherAllChecks();
    }, 1000 * 60); // for 8 seconds interval
};

worker.init = () => {
    //execute all the checks
    worker.gatherAllChecks();

    //call the loop so that checks continue
    worker.loop();
};

module.exports = worker;
