//Module Scaffolding

const environments = {};

environments.staging = {
    port: 3000,
    envName: 'staging'
}

environments.production = {
    port: 5000,
    envName: 'production'
}

//determine which environment was passed
const currentEnvironment = typeof (process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging';

//export corresponding environment object
const environmentToExport = typeof (environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging;
module.exports = environmentToExport;

// /*
//  * Title: Environments
//  * Description: Handle All Environment related things
//  * Author: Md. Tanvir Arif Siddiqui
//  * Date: 7/1/2025
//  * Time: 1:02 PM
//  */
//
// // dependencies
//
// // module scaffolding
// const environment = {};
//
// environment.staging = {
//     port: 3000,
//     envName: 'staging',
// };
//
// environment.production = {
//     port: 5000,
//     envName: 'production',
// };
//
// // determine which environment was passed
// const currentEnvironment =
//     typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';
//
// // export corresponding object
// const environmentToExport =
//     typeof environment[currentEnvironment] === 'object'
//         ? environment[currentEnvironment]
//         : environment.staging;
//
// module.exports = environmentToExport;
