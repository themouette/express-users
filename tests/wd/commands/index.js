var _ = require('lodash');

module.exports = _.extend({},
        require('screenstory/extensions/chai'),
        require('./register'),
        require('./server')
    );
