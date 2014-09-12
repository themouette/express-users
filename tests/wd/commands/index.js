var _ = require('lodash');

module.exports = _.extend({},
        require('screenstory/extensions/chai'),
        require('./utilities'),
        require('./actions'),
        require('./server')
    );
