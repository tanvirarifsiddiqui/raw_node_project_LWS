/*
 * Title: Not Found Handler
 * Description: 404 Not Found Handler
 * Author: Md. Tanvir Arif Siddiqui
 * Date: 7/16/2025
 * Time: 3:17 PM
 */

const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
    console.log(requestProperties);
    callback(404, {
        message: "your requested url is not found!",
    })
}

module.exports = handler;
