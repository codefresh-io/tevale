import { evaluateSingleExpression, validateSingleExpression } from "../../src/expression_parser";

const exampleVariables = {
    'somePositiveNumericVariable': 123,
    'someZeroVariable': 0,
    'someNegativeNumericVariable': -50,
    'stringVariable': 'hello',
    'emptyStringVariable': '',
    'longStringValue': 'MA26EKMPupgvp6XYlGAVJZKv6yvaD3aobXMyExvyMBa2Hi9LlJXTUaBveMR9ErHtSfXNHHW5xAKbz2DVfBOqQ8CaSMNMQRBrJRpEpsO7FygKZmKpKHvvtPviOTfyUE0HGhnSPYHb9Hbz1CMxab4T0iQxPLCwrg57Qi0sTW1sJhVSygD9ivCfhJwJmD9PNb8bV0rJJ9aWp84LeaC7PDkj5hAozkrrJVA5hozLSXGZb0A4JLKiPOe9ITvxcIqvPNaMPA2SF4AQasE01TeGyuHQICuAMTGFFAP9y0HJBm7N0XmU',
    'trueBooleanValue': true,
    'falseBooleanValue': false,
    'nullBooleanValue': null,
    'simpleObjectValue': {
        'someNumericValue': 123,
        'someStringValue': 'hello there',
        'someNullValue': 'hi there',
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
        expectedValidity: true,
        expectedResult: true,
    },

    // ------------------
    'numeric variable value': {
        expression: 'somePositiveNumericVariable',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },
    'zero variable value': {
        expression: 'someZeroVariable',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: false,
    },
    'negative variable value': {
        expression: 'someNegativeNumericVariable',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },
    // ------------------
    'string variable value': {
        expression: 'stringVariable',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },
    'empty string variable value': {
        expression: 'emptyStringVariable',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: false,
    },
    'long string variable value': {
        expression: 'longStringVariable',
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
        expression: 'somePositiveNumericVariable > someZeroVariable',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: false,
    },

    'numeric comparison 2': {
        expression: 'somePositiveNumericVariable > someZeroVariable',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: false,
    },

    // ------------------

    'string comparison 1': {
        expression: 'longStringVariable > emptyStringVariable',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    'string comparison 2': {
        expression: 'longStringVariable < emptyStringVariable',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: false,
    },

    'string comparison 3': {
        expression: 'longStringVariable == longStringVariable',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    'string comparison 4': {
        expression: 'longStringVariable === longStringVariable',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },

    'string comparison 5': {
        expression: 'longStringVariable > stringVariable',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    'string comparison 6': {
        expression: 'longStringVariable < stringVariable',
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
        expression: 'typicalObjectValue.branch_name == "develop"',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    'typical object value 2': {
        expression: 'typicalObjectValue.working_dir == "/var/tmp"',
        variableObjects: exampleVariables,
        expectedValidity: true,
        expectedResult: true,
    },

    'typical object value 3': {
        expression: 'typicalObjectValue.success',
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
        expression: 'somePositiveNumericVariable > null',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },
    'weird comparison 2': {
        expression: 'somePositiveNumericVariable < stringVariable',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },
    'weird comparison 3': {
        expression: 'somePositiveNumericVariable > true',
        variableObjects: exampleVariables,
        expectedValidity: false,
        expectedResult: false,
    },
    'weird comparison 4': {
        expression: 'somePositiveNumericVariable > simpleObjectValue',
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

};

describe(
    'Verify expressions: ', () => {

        for (const testCaseName of expressionsAndExpectedResults.keys()) {

            it(
                `expression:  '${testCase.expression}'`, () => {
                    const testCase = expressionsAndExpectedResults.testCase;

                    try {
                        const expectedValidity = testCase.expectedValidity;
                        const expectedResult   = testCase.expectedResult;

                        const actualValidity =
                                  validateSingleExpression(
                                      testCase.expression,
                                      testCase.expression
                                  ) === [];
                        const actualResult   =
                                  evaluateSingleExpression(testCase.expression,
                                      testCase.expression);

                        expect(actualValidity).to.equal(expectedValidity);
                        expect(actualResult).to.equal(expectedResult);

                    } catch (err) {
                        console.log(`Error in case ${testCaseName}\n${err.stack}`);
                    }
                }
            );

        }
    }
);
