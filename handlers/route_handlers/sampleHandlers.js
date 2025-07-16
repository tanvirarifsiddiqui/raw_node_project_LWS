/*
 * Title: Sample Handler
 * Description: Sample Handler
 * Author: Md. Tanvir Arif Siddiqui
 * Date: 7/14/2025
 * Time: 5:46 PM
 */


//Module Scaffolding
const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
    console.log(requestProperties);
    callback(200, {
        message: "This is a sample url",
    })
}

module.exports = handler;
