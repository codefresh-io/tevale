// A parser that accepts a set of named objects (with properties) and an expression, validates
// syntax and evaluates the expression.

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const jsep = require('jsep');

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

// Private methods/data

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

// Exported objects/methods

// Verify an expression, making sure it is valid. It will return an empty array if fine, otherwise
// an array of one or more strings found when verifying the expression
function validateSingleExpression(expression, variables) {

    try {
        jsep(expression, variables);
    } catch (err) {
        return [err.message];
    }

    return [];
}

// Evaluate a single expression, seeing whether its value is truthy or not. If it does not pass
// validation, it will be falsey.
function evaluateSingleExpression(expression, variables) {
    if (validateSingleExpression(expression, variables) !== []) {
        return false;
    }

    // do stuff..

    return true;
}

module.exports = {
    evaluateSingleExpression,
    validateSingleExpression,
};
