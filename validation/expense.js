const Validator = require('validator');
const _ = require('lodash');

module.exports = function validateExpenseInput(data) {
    let errors = {};

    data.category = !_.isEmpty(data.category) ? data.category : '';
    data.counterpart = !_.isEmpty(data.counterpart) ? data.counterpart : '';
    data.amount = !_.isEmpty(data.amount) ? data.amount : '';

    if (!Validator.isLength(data.category, { min: 2, max: 30 })) {
        errors.category = 'Category must be between 2 and 30 characters';
    }

    if (Validator.isEmpty(data.category)) {
        errors.category = 'Category field is required';
    }

    if (Validator.isEmpty(data.counterpart)) {
        errors.counterpart = 'Email field is required';
    }

    if (Validator.isEmpty(data.amount)) {
        errors.amount = 'Amount field is required';
    }

    if (!Validator.isDecimal(data.amount)) {
        errors.amount = 'Amount field must be decimal';
    }

    if (data.amount <= 0) {
        errors.amount = 'Amount must be greater than 0';
    }


    return {
        errors,
        isValid: _.isEmpty(errors)
    };
};