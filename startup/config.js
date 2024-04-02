const config = require('config');

module.exports = function () {
    if (!config.get('jwtPrivateKey')) {
        console.error('Please add jwtPrivateKey into your env variable')
        process.exit(1);
    }
}