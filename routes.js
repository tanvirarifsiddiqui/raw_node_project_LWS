const {sampleHandler} = require('./handlers/route_handlers/sampleHandlers');
const {userHandler} = require('./handlers/route_handlers/userHandler');

const routes = {
    'sample': sampleHandler,
    'user': userHandler,
}


module.exports = routes;
