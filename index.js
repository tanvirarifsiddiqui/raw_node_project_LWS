/*
 * Title: Index File
 * Description: Main Index File
 * Author: Md. Tanvir Arif Siddiqui
 * Date: 7/1/2025
 * Time: 3:42 PM
 */

// dependencies
const http = require('http');
const {handleRequestResponse} = require('./helpers/handleRequestResponse');
const environment = require('./helpers/environment');
const data = require('./lib/data');


// app object module Scaffolding

const app = {};

//testing file system
// data.create("test", "newFile", {"country": "Bangladesh", "language": "Bengali"}, (err) => {
//     if (err) {
//         console.log(`Error is : ${err}`);
//     }
// });

// data.read("test", "newFile", (err, data) => {
//     if (!err) {
//         console.log(data);
//     } else console.log(err);
// })

// data.update("test", "newFile", {"country": "America", "language": "English"}, (err) => {
//     console.log(`Error is : ${err}`);
// });

data.delete("test", "newFile", (err) => {
    console.log(err);
})


app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`The Environment Variable is ${process.env.NODE_ENV}`);
        console.log(`Server listening on port ${environment.port}`);
    });
};

app.handleReqRes = handleRequestResponse;

app.createServer();
