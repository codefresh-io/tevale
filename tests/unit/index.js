"use strict";

// TODO: Use setup.js...
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

const expression_evaluator = require("../../src/expression_evaluator");

// import { evaluateSingleExpression, validateSingleExpression } from "../../src/expression_evaluator";
// const expression_evaluator = {
//     evaluateSingleExpression,
//     validateSingleExpression
// };


const exampleVariables = {
    'somePositiveNumericValue': 123,
    'someZeroValue': 0,
    'someNegativeNumericValue': -50,
    'stringValue': 'hello',
    'emptyStringValue': '',
    'longStringValue': 'mA26EKMPupgvp6XYlGAVJZKv6yvaD3aobXMyExvyMBa2Hi9LlJXTUaBveMR9ErHtSfXNHHW5xAKbz2DVfBOqQ8CaSMNMQRBrJRpEpsO7FygKZmKpKHvvtPviOTfyUE0HGhnSPYHb9Hbz1CMxab4T0iQxPLCwrg57Qi0sTW1sJhVSygD9ivCfhJwJmD9PNb8bV0rJJ9aWp84LeaC7PDkj5hAozkrrJVA5hozLSXGZb0A4JLKiPOe9ITvxcIqvPNaMPA2SF4AQasE01TeGyuHQICuAMTGFFAP9y0HJBm7N0XmU',
    'trueBooleanValue': true,
    'falseBooleanValue': false,
    'nullBooleanValue': null,
    'simpleObjectValue': {
        'someNumericValue': 123,
        'someStringValue': 'hello there',
        'someNullValue': null,
        'someBooleanValue': false,
    },
    'complexObjectValue': {
        'internalObjectValue': {
            'someNumericValue': 123,
            'someStringValue': 'hello there',
            'someNullValue': null,
            'someBooleanValue': false,
        },
    },
    'superComplexObjectValue': {
        'internalObjectValue': {
            'moreInternalObjectValue': {
                'someNumericValue': 123,
                'someStringValue': 'hello there',
                'someNullValue': null,
                'someBooleanValue': false,
            },
        },
    },
    'typicalObjectValue': {
        'branch_name': 'master',
        'working_dir': '/tmp/whatever',
        'success': true,
    },
    'emptyObjectValue': {},
};

const expressionsAndExpectedResults = {
    'empty': {
        expression: '',
        variableObjects: {},
        expectedValidity: true,
        expectedResult: false,
    },
    'null': {
        expression: 'null',
        variableObjects: {},
        expectedValidity: true,
        expectedResult: false,
    },
    'false': {
        expression: 'false',
        variableObjects: {},
        expectedValidity: true,
        expectedResult: false,
    },
    'positive number': {
        expression: '1234',
        variableObjects: {},
        expectedValidity: true,
        expectedResult: true,
    },
    'negative number': {
        expression: '-1234',
        variableObjects: {},
        expectedValidity: true,
        expectedResult: true,
    },
    'zero number': {
        expression: '0000000',
        variableObjects: {},
        expectedValidity: true,
        expectedResult: false,
    },
    'empty string': {
        expression: '""',
        variableObjects: {},
        expectedValidity: true,
        expectedResult: false,
    },
    'string1': {
        expression: '"asdasd"',
        variableObjects: {},
        expectedValidity: true,
        expectedResult: true,
    },
    'string2': {
        expression: '\'asdasd\'',
        variableObjects: {},
        expectedValidity: true,
        expectedResult: true,
    },
    'string3': {
        expression: '`asdasd`',
        variableObjects: {},
        expectedValidity: false,
        expectedResult: false,
    },

    // ------------------
    'numeric variable value': {
        expression: 'somePositiveNumericValue',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },
    'zero variable value': {
        expression: 'someZeroValue',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: false,
    },
    'negative variable value': {
        expression: 'someNegativeNumericValue',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },
    // ------------------
    'string variable value': {
        expression: 'stringValue',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },
    'empty string variable value': {
        expression: 'emptyStringValue',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: false,
    },
    'long string variable value': {
        expression: 'longStringValue',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },
    // ------------------
    'true boolean value': {
        expression: 'trueBooleanValue',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },
    'false boolean value': {
        expression: 'falseBooleanValue',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: false,
    },
    'not false boolean value': {
        expression: '!falseBooleanValue',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },
    'null boolean value': {
        expression: 'nullBooleanValue',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: false,
    },

    // ------------------

    'numeric comparison 1': {
        expression: 'somePositiveNumericValue > someZeroValue',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    'numeric comparison 2': {
        expression: 'somePositiveNumericValue < someZeroValue',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: false,
    },

    'numeric comparison 3': {
        expression: 'somePositiveNumericValue >= someZeroValue',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    'numeric comparison 4': {
        expression: 'somePositiveNumericValue <= someZeroValue',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: false,
    },

    'numeric comparison 5': {
        expression: 'somePositiveNumericValue >= somePositiveNumericValue',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    'numeric comparison 6': {
        expression: 'somePositiveNumericValue <= somePositiveNumericValue',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },


    // ------------------

    'string comparison 1': {
        expression: 'longStringValue > emptyStringValue',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    'string comparison 2': {
        expression: 'longStringValue < emptyStringValue',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: false,
    },

    'string comparison 3': {
        expression: 'longStringValue == longStringValue',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    'string comparison 4': {
        expression: 'longStringValue === longStringValue',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },

    'string comparison 5': {
        expression: 'longStringValue > stringValue',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    'string comparison 6': {
        expression: 'longStringValue < stringValue',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: false,
    },

    // ------------------

    'simple object value 1': {
        expression: 'simpleObjectValue.someNumericValue == 123',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    'simple object value 2': {
        expression: 'simpleObjectValue.someNumericValue',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    'simple object value 3': {
        expression: 'simpleObjectValue.someNullValue',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: false,
    },

    'simple object value 4': {
        expression: 'simpleObjectValue.someBooleanValue',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: false,
    },

    'simple object value 5': {
        expression: 'simpleObjectValue.someBooleanValue == false',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    'complex object value 1': {
        expression: 'complexObjectValue.internalObjectValue.someNumericValue == 123',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    'complex object value 2': {
        expression: 'complexObjectValue.internalObjectValue.someNumericValue',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    'complex object value 3': {
        expression: 'complexObjectValue.internalObjectValue.someNullValue',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: false,
    },

    'complex object value 4': {
        expression: 'complexObjectValue.internalObjectValue.someBooleanValue',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: false,
    },

    'complex object value 5': {
        expression: 'complexObjectValue.internalObjectValue.someBooleanValue == false',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    'super complex object value 1': {
        expression: 'superComplexObjectValue.internalObjectValue.moreInternalObjectValue.someNumericValue == 123',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    'super complex object value 2': {
        expression: 'superComplexObjectValue.internalObjectValue.moreInternalObjectValue.someNumericValue',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    'super complex object value 3': {
        expression: 'superComplexObjectValue.internalObjectValue.moreInternalObjectValue.someNullValue',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: false,
    },

    'super complex object value 4': {
        expression: 'superComplexObjectValue.internalObjectValue.moreInternalObjectValue.someBooleanValue',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: false,
    },

    'super complex object value 5': {
        expression: 'superComplexObjectValue.internalObjectValue.moreInternalObjectValue.someBooleanValue == false',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    'typical object value 1': {
        expression: 'typicalObjectValue.branch_name == "master"',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    'typical object value 2': {
        expression: 'typicalObjectValue.working_dir == "/var/tmp"',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: false,
    },

    'typical object value 3': {
        expression: '!!typicalObjectValue.success',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    'typical object value 4': {
        expression: 'typicalObjectValue.success == true',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    'typical object value 5': {
        expression: 'typicalObjectValue',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },

    'empty object value 1': {
        expression: 'emptyObjectValue.someBooleanValue == false',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },

    'empty object value 2': {
        expression: 'emptyObjectValue.someBooleanValue',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },

    'empty object value 3': {
        expression: 'emptyObjectValue',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },

    'bad object syntax 1': {
        expression: 'superComplexObjectValue.',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },

    'bad object syntax 2': {
        expression: 'superComplexObjectValue..',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },

    'bad object syntax 3': {
        expression: 'superComplexObjectValue.internalObjectValue',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },

    'bad object syntax 4': {
        expression: 'superComplexObjectValue.internalObjectValue.',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },

    'bad object syntax 5': {
        expression: 'superComplexObjectValue.internalObjectValue.moreInternalObjectValue',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },

    'bad object syntax 6': {
        expression: 'superComplexObjectValue.internalObjectValue.moreInternalObjectValue.',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },

    'bad object syntax 7': {
        expression: 'superComplexObjectValue.internalObjectValue.moreInternalObjectValue.nonExistant',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },

    'bad object syntax 8': {
        expression: 'superComplexObjectValue.internal Object Value.moreInternalObjectValue.someNumericValue',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },

    'bad object syntax 9': {
        expression: 'superComplexObjectValue.internalObject.Value.moreInternalObjectValue.someNumericValue',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },

    // ------------------

    'weird comparison 1': {
        expression: 'somePositiveNumericValue > null',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },
    'weird comparison 2': {
        expression: 'somePositiveNumericValue < stringValue',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },
    'weird comparison 3': {
        expression: 'somePositiveNumericValue > true',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },
    'weird comparison 4': {
        expression: 'somePositiveNumericValue > simpleObjectValue',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },
    'weird comparison 5': {
        expression: 'complexObjectValue > simpleObjectValue',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },
    'weird comparison 6': {
        expression: 'false > null',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },
    'weird comparison 7': {
        expression: 'false > true',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },
    'weird comparison 8': {
        expression: 'someString > null',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },
    'weird comparison 9': {
        expression: 'internalObjectValue.someNumericValue > null',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },
    'weird comparison 10': {
        expression: 'typicalObjectValue.branch_dir > 82',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },
    'weird comparison 11': {
        expression: 'typicalObjectValue.branch_dir > complexObjectValue.internalObjectValue.someNumericValue',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },

    // ------------------


    'parentheses 1': {
        expression: '(somePositiveNumericValue > someZeroValue)',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    'parentheses 2': {
        expression: '(somePositiveNumericValue >= someZeroValue) && true',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    'parentheses 3': {
        expression: '(longStringValue > emptyStringValue) && (longStringValue >= emptyStringValue)',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    'parentheses 4': {
        expression: '((longStringValue > emptyStringValue) && (longStringValue >= emptyStringValue))',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    'parentheses 5': {
        expression: '(longStringValue > emptyStringValue && (longStringValue >= emptyStringValue))',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    'parentheses 6': {
        expression: '60 > 35 && (50 > 22 && ((90 > 33) && ((26 > 10) && 15 > 30)) || (80 > 32))',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    'parentheses 7': {
        expression: '60 > 35 && (50 > 22 && ((90 > 33) && ((26 > 10) && 15 > 30)) || (80 < 32))',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: false,
    },

    'parentheses 8': {
        expression: '60 > 35 && (50 > 22 && ((90 > 33) && ((26 > 10) && 15 > 30)) || (somePositiveNumericValue > 32))',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    'parentheses 9': {
        expression: '60 > 35 && (50 > 22 && ((90 > 33) && ((26 > 10) && 15 > 30)) || (somePositiveNumericValue < 32))',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: false,
    },

    // ------------------

    'division by 0': {
        expression: 'somePositiveNumericValue / someZeroValue',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },

    'modulo by 0': {
        expression: 'somePositiveNumericValue % someZeroValue',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },

    'division': {
        expression: 'somePositiveNumericValue / somePositiveNumericValue',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    'really big number': {
        expression: '9007199254740991 * 9007199254740991',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    'fractions': {
        expression: '1.231 * 5.2342',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    '+true': {
        expression: '+true',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },

    'number+true': {
        expression: '555+true',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },

    '!true': {
        expression: '!true',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: false,
    },

    '!!true': {
        expression: '!!true',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    '!!!!!!!!!!true': {
        expression: '!!!!!!!!!!true',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    '!33': {
        expression: '!33',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: false,
    },

    '!!33': {
        expression: '!!33',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    '!0': {
        expression: '!0',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    '!!0': {
        expression: '!!0',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: false,
    },

    'numeric overflow': {
        expression: '1.79E+308 * 1.79E+308',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },

    'string division 1': {
        expression: 'stringValue / 5',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },

    'string division 2': {
        expression: 'stringValue / stringValue',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },

    'string adding 1': {
        expression: 'stringValue + 5',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },

    'string adding 2': {
        expression: 'stringValue + 5',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },

    // ------------------

    'function 1': {
        expression: 'stringValue.toUpperCase()',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    'function 2': {
        expression: 'stringValue.substr(2, 4)',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    'function 3': {
        expression: 'stringValue.substr(20, 40)',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },
};

describe(
    'Verify expressions: ', () => {

        // TODO: Ugh, why can't I just do expressionsAndExpectedResults.keys()???
        for (const testCaseName of Object.keys(expressionsAndExpectedResults)) {

            const testCase = expressionsAndExpectedResults[testCaseName];

            it(
                `case '${testCaseName}'`, () => {

                    const expectedValidity = testCase.expectedValidity;
                    const expectedResult   = testCase.expectedResult;

                    const actualValidity =
                              expression_evaluator.validateSingleExpression(
                                  testCase.expression,
                                  testCase.variableObjects
                              ).length === 0;
                    const actualResult   =
                              expression_evaluator.evaluateSingleExpression(
                                  testCase.expression,
                                  testCase.variableObjects
                              );

                    expect(actualValidity).to.equal(expectedValidity);
                    expect(actualResult).to.equal(expectedResult);
                }
            );

        }
    }
);
