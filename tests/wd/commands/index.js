var _ = require('lodash');

module.exports = _.extend({},
        require('screenstory/extensions/chai'),
        require('tests/wd/commands/register'),
        require('tests/wd/commands/server')
    );
