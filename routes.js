const {sampleHandler} = require('./handlers/route_handlers/sampleHandlers');
const {userHandler} = require('./handlers/route_handlers/userHandler');
const {tokenHandler} = require('./handlers/route_handlers/token_handler');

const routes = {
    'sample': sampleHandler,
    'user': userHandler,
    'token': tokenHandler,
}


module.exports = routes;
