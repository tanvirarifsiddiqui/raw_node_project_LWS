//Module Scaffolding

const environments = {};


environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: "tanvir123", // for password encryption
    maxChecks: 5,
    twilio: {
        fromPhone: 'dummy from phone number',
        accountSid: "dummy account sid",
        authToken: "dummy auth token",
    }
}

environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: "tanvir123",
    maxChecks: 5,
    twilio: {
        fromPhone: 'dummy from phone number',
        accountSid: "dummy account sid",
        authToken: "dummy auth token",
    }
}

//determine which environment was passed
const currentEnvironment = typeof (process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging';

//export corresponding environment object
const environmentToExport = typeof (environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging;

module.exports = environmentToExport;
