
// A local utility to manage validation errors.
function ValidationErrors() {
    this.errors = [];
}
ValidationErrors.prototype.isEmpty = function () {
    return !this.errors.length;
};
ValidationErrors.prototype.hasError = function () {
    return this.errors.length;
};
ValidationErrors.prototype.format = function () {
    if (!this.errors.length) {
        return null;
    }
    var ret = {globals: [], fields: {}};
    this.errors.forEach(function (err) {
        if (err.globals) {
            ret.globals.push(err.globals);
        } else {
            ret.fields[err.field] = ret.fields[err.field] || [];
            ret.fields[err.field].push(err.message);
        }
    });

    return ret;
};
ValidationErrors.prototype.addGlobalError = function (message) {
    this.errors.push({globals: message});
    return this;
};
ValidationErrors.prototype.addFieldError = function (field, message) {
    this.errors.push({field: field, message: message});
    return this;
};

module.exports = {
    ValidationErrors: ValidationErrors
};
