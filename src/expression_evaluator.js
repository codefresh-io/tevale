// A parser that accepts a set of named objects (with properties) and an expression, validates
// syntax and evaluates the expression.

'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const jsep = require('jsep');
const _ = require('lodash');
// import parse from 'jsep';

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

// Private methods/data

// This is the full set of types that any JSEP node can be.
// Store them here to save space when minified
const COMPOUND        = 'Compound';
const IDENTIFIER      = 'Identifier';
const MEMBER_EXP      = 'MemberExpression';
const LITERAL         = 'Literal';
const THIS_EXP        = 'ThisExpression';
const CALL_EXP        = 'CallExpression';
const UNARY_EXP       = 'UnaryExpression';
const BINARY_EXP      = 'BinaryExpression';
const LOGICAL_EXP     = 'LogicalExpression';
const CONDITIONAL_EXP = 'ConditionalExpression';
const ARRAY_EXP       = 'ArrayExpression';

const BINARY_OPERATOR_ALLOWED_TYPES = {
    '==': ['number', 'string', 'boolean'],
    '!=': ['number', 'string', 'boolean'],
    '<': ['number', 'string'],
    '>': ['number', 'string'],
    '<=': ['number', 'string'],
    '>=': ['number', 'string'],
    '+': ['number'],
    '-': ['number'],
    '*': ['number'],
    '/': ['number'],
    '%': ['number'],
    '||': ['boolean'],
    '&&': ['boolean'],
};

const UNARY_OPERATOR_ALLOWED_TYPES = {
    '+': ['number'],
    '-': ['number'],
    '!': ['number', 'boolean'],

};

function _verifyExpressionsType(operatorType, expressions) {

    let allowedTypes;
    if (expressions.length === 1) {
        allowedTypes = UNARY_OPERATOR_ALLOWED_TYPES[operatorType];
    } else if (expressions.length === 2) {
        allowedTypes = BINARY_OPERATOR_ALLOWED_TYPES[operatorType];
    } else {
        throw new Error(`_verifyExpressionsType called with invalid number ${expressions.length}of expressions.`);
    }

    for (const currentType of allowedTypes) {
        if (expressions.every(
                (expression) => { return typeof expression === currentType; } // eslint-disable-line
            )) {
            return true;
        }
    }

    throw new Error(`The operator ${operatorType} cannot be used with ${expressions}. It can only be used with the types: ${allowedTypes}`);
}

function _handleLiteralValueNode(node) {
    return node.value;
}

function _handleUnaryExpressionNode(node, variables) {
    // TODO: Verify types here
    const expression = _handleExpressionNode(node.argument, variables);

    switch (node.operator) {
        case '+':
            _verifyExpressionsType(node.operator, [expression]);
            return 1 * expression;
        case '-':
            _verifyExpressionsType(node.operator, [expression]);
            return -1 * expression;
        case '!':
            _verifyExpressionsType(node.operator, [expression]);
            return !expression;
        default:
            throw new Error(`Invalid unary operator: ${node.operator}`);
    }
}

function _handleLogicalExpressionNode(node, variables) {
    const leftExpression = _handleExpressionNode(node.left, variables);
    const rightExpression = _handleExpressionNode(node.right, variables);
    const expressions = [leftExpression, rightExpression];

    switch (node.operator) {
        case '||':
            _verifyExpressionsType(node.operator, expressions);
            return leftExpression || rightExpression;
        case '&&':
            _verifyExpressionsType(node.operator, expressions);
            return leftExpression && rightExpression;
        default:
            throw new Error(`Invalid logical operator: ${node.operator}`);
    }
}

function _handleBinaryExpressionNode(node, variables) {

    const leftExpression = _handleExpressionNode(node.left, variables);
    const rightExpression = _handleExpressionNode(node.right, variables);
    const expressions = [leftExpression, rightExpression];
    let evaluatedResult;

    switch (node.operator) {
        case '==':
            _verifyExpressionsType(node.operator, expressions);
            return leftExpression === rightExpression;
        case '!=':
            _verifyExpressionsType(node.operator, expressions);
            return leftExpression !== rightExpression;
        case '<':
            _verifyExpressionsType(node.operator, expressions);
            return leftExpression < rightExpression;
        case '>':
            _verifyExpressionsType(node.operator, expressions);
            return leftExpression > rightExpression;
        case '<=':
            _verifyExpressionsType(node.operator, expressions);
            return leftExpression <= rightExpression;
        case '>=':
            _verifyExpressionsType(node.operator, expressions);
            return leftExpression >= rightExpression;
        case '+':
            _verifyExpressionsType(node.operator, expressions);
            return leftExpression + rightExpression;
        case '-':
            _verifyExpressionsType(node.operator, expressions);
            return leftExpression - rightExpression;

        case '*':
            _verifyExpressionsType(node.operator, expressions);
            evaluatedResult = leftExpression * rightExpression;
            if (evaluatedResult === Infinity) {
                throw new Error('Numeric overflow');
            }
            return evaluatedResult;

        case '/':
            _verifyExpressionsType(node.operator, expressions);

            evaluatedResult = leftExpression / rightExpression;
            if (evaluatedResult === Infinity) {
                throw new Error('Division by 0');
            }
            return evaluatedResult;
        case '%':
            _verifyExpressionsType(node.operator, expressions);
            evaluatedResult = leftExpression % rightExpression;
            if (Number.isNaN(evaluatedResult)) {
                throw new Error('Modulo by 0');
            }
            return evaluatedResult;

        default:
            throw new Error(`Invalid binary operator: ${node.operator}`);
    }
}

function _handleIdentifierNode(node, variables) {
    const evaluatedResult = _.get(variables, node.name, undefined);

    if (evaluatedResult === undefined) {
        throw new Error(`Invalid identifier: '${node.name}'`);
    } else {
        return evaluatedResult;
    }
}

function _handleMemberNode(node, variables) {
    const containingVariable = _handleExpressionNode(node.object, variables);

    if (node.property.type !== IDENTIFIER) {
        throw new Error(`Invalid identifier member: '${node.property.name}'`);
    }

    const keyValue = node.property.name;

    const evaluatedResult = _.get(containingVariable, keyValue, undefined);

    if (evaluatedResult === undefined) {
        throw new Error(`Undefined identifier member: '${node.property.name}'`);
    } else {
        return evaluatedResult;
    }
}

function _handleCompoundNode(node, variables) {
    if (node.body.length === 0) {
        // Empty expression
        return false;
    } else {
        throw new Error(`Cannot handle compound expressions.'`);
    }
}

function _handleFunctionCallExpressionNode(node, variables) {

}

function _handleExpressionNode(node, variables) {

    let evaluatedValue = false;

    switch (node.type) {
        case COMPOUND:
            // console.log('COMPOUND detected.');
            evaluatedValue = _handleCompoundNode(node, variables);
            break;

        case IDENTIFIER:
            // console.log('IDENTIFIER detected.');
            evaluatedValue = _handleIdentifierNode(node, variables);
            break;

        case MEMBER_EXP:
            // console.log('MEMBER_EXP detected.');
            evaluatedValue = _handleMemberNode(node, variables);
            break;

        case LITERAL:
            // console.log('LITERAL detected.');
            evaluatedValue = _handleLiteralValueNode(node);
            break;

        case THIS_EXP:
            console.log('THIS_EXP detected.');
            break;

        case CALL_EXP:
            console.log('CALL_EXP detected.');
            evaluatedValue = _handleFunctionCallExpressionNode(node, variables);
            break;

        case UNARY_EXP:
            // console.log('UNARY_EXP detected.');
            evaluatedValue = _handleUnaryExpressionNode(node, variables);
            break;

        case BINARY_EXP:
            // console.log('BINARY_EXP detected.');
            evaluatedValue = _handleBinaryExpressionNode(node, variables);
            break;

        case LOGICAL_EXP:
            // console.log('LOGICAL_EXP detected.');
            evaluatedValue = _handleLogicalExpressionNode(node, variables);
            break;

        case CONDITIONAL_EXP:
            console.log('CONDITIONAL_EXP detected.');
            break;

        case ARRAY_EXP:
            console.log('ARRAY_EXP detected.');
            break;

        default:
            console.log('default detected.');
            evaluatedValue = false;
            break;
    }

    return evaluatedValue;
}

function _evaluateExpressionNode(node, variables) {

    const evaluatedResult = _handleExpressionNode(node, variables);

    if (evaluatedResult === null) {
        return false;
    }

    if (typeof evaluatedResult === 'object') {
        throw new Error(`Cannot evaluate object variable directly`);
    }

    return !!evaluatedResult;
}

function _validateAndEvaluateExpression(expression, variables) {
    const trimmedExpression = (String(expression)).trim();

    try {
        let parsedExpression = null;
        parsedExpression     = jsep(trimmedExpression);

        // Evaluate the expression. Any errors will cause an exception and get to the catch
        const evaluatedResult = _evaluateExpressionNode(parsedExpression, variables);

        return { evaluatedResult, errorMessage: null };
    } catch (err) {
        console.log(err.stack);
        return { evaluatedResult: null, errorMessage: err.message };
    }
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

// Exported objects/methods

// Verify an expression, making sure it is valid. It will return an empty array if fine, otherwise
// an array of one or more strings found when verifying the expression.
function validateSingleExpression(expression, variables) {

    const validateAndEvaluateResult = _validateAndEvaluateExpression(expression, variables);

    if (validateAndEvaluateResult.errorMessage === null) {
        return [];
    } else {
        return [validateAndEvaluateResult.errorMessage];
    }
}

// Evaluate a single expression, seeing whether its value is truthy or not. If it does not pass
// validation, it will be falsey.
function evaluateSingleExpression(expression, variables) {

    const validateAndEvaluateResult = _validateAndEvaluateExpression(expression, variables);

    if (validateAndEvaluateResult.errorMessage === null) {
        return validateAndEvaluateResult.evaluatedResult;
    } else {
        console.log(`Invalid expression '${expression}' due to:\n    ${
            validateAndEvaluateResult.errorMessage}`);
        return false;
    }
}

module.exports = {
    evaluateSingleExpression,
    validateSingleExpression,
};

// export {
//     evaluateSingleExpression,
//     validateSingleExpression
// };
