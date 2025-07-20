const {sampleHandler} = require('./handlers/route_handlers/sampleHandlers');
const {userHandler} = require('./handlers/route_handlers/userHandler');
const {tokenHandler} = require('./handlers/route_handlers/token_handler');
const {checkHandler} = require('./handlers/route_handlers/check_handler');

const routes = {
    'sample': sampleHandler,
    'user': userHandler,
    'token': tokenHandler,
    'check': checkHandler
}


module.exports = routes;
