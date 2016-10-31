# Expression Evaluator

> A parser that accepts a set of named objects (with properties) and an expression, verifies syntax and evaluates the expression.

Developed in [Codefresh](https://www.codefresh.io).

### Features

* Validation and evaluation of expressions
* Supports variables in expressions, including object variables (nesting)
* Supports popular functions and operators for number and string manipulation
* Supports string searching and regexp matching functions

### Installation

```bash
$ npm install cf-expression-evaluator --save
```

## Usage

```js
const expressionEvaluator = require('expression_evaluator');
const variables = {
    "author": {
        "name": "Alon Diamant",
        "homepage": "http://www.alondiamant.com",
        "github": {
            "repositories": 12,
            "url": "http://www.github.com/advance512"
        },
    },
    "company": {
        "name": "Codefresh",
        "homepage": "http://www.codefresh.io",
        "phoneNumber": "+972-99-999-9999"
    }
}

console.log(
    expressionEvaluator.evaluateSingleExpression(
        'match(author.name, "alon", true) && ' +
        'author.github.repositories > 10 && ' +
        'Number(substring(company.phoneNumber, 1, 4)) / 2 == 486',
        variables
    )
);
```

## Function Reference

...
...
TODO
...
...


## Examples

Using the variables:

```
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

    'author': {
        'name': 'Alon Diamant',
        'homepage': 'http://www.alondiamant.com',
        'github': {
            'repositories': 12,
            'url': 'http://www.github.com/advance512',
        },
    },
    'company': {
        'name': 'Codefresh',
        'homepage': 'http://www.codefresh.io',
        'phoneNumber': '+972-99-999-9999',
    },
};
```

The result for the following expressions is:


| Expression        | Result or Error Message           |
| ------------- |:-------------:|
|''|false|
|'null'|false|
|'false'|false|
|'1234'|true|
|'-1234'|true|
|'0000000'|false|
|'""'|false|
|'"asdasd"'|true|
|''asdasd''|true|
|'`asdasd`'|Unexpected "`" at character 0|
|'somePositiveNumericValue'|true|
|'someZeroValue'|false|
|'someNegativeNumericValue'|true|
|'stringValue'|true|
|'emptyStringValue'|false|
|'longStringValue'|true|
|'trueBooleanValue'|true|
|'falseBooleanValue'|false|
|'!falseBooleanValue'|true|
|'nullBooleanValue'|false|
|'invalidIdentifer'|Invalid identifier: 'invalidIdentifer'|
|'somePositiveNumericValue > someZeroValue'|true|
|'somePositiveNumericValue < someZeroValue'|false|
|'somePositiveNumericValue >= someZeroValue'|true|
|'somePositiveNumericValue <= someZeroValue'|false|
|'somePositiveNumericValue >= somePositiveNumericValue'|true|
|'somePositiveNumericValue <= somePositiveNumericValue'|true|
|'longStringValue > emptyStringValue'|true|
|'longStringValue < emptyStringValue'|false|
|'longStringValue == longStringValue'|true|
|'longStringValue === longStringValue'|Invalid binary operator: ===|
|'longStringValue > stringValue'|true|
|'longStringValue < stringValue'|false|
|'simpleObjectValue.someNumericValue == 123'|true|
|'simpleObjectValue.someNumericValue'|true|
|'simpleObjectValue.someNullValue'|false|
|'simpleObjectValue.someBooleanValue'|false|
|'simpleObjectValue.someBooleanValue == false'|true|
|'complexObjectValue.internalObjectValue.someNumericValue == 123'|true|
|'complexObjectValue.internalObjectValue.someNumericValue'|true|
|'complexObjectValue.internalObjectValue.someNullValue'|false|
|'complexObjectValue.internalObjectValue.someBooleanValue'|false|
|'complexObjectValue.internalObjectValue.someBooleanValue == false'|true|
|'superComplexObjectValue.internalObjectValue.moreInternalObjectValue.someNumericValue == 123'|true|
|'superComplexObjectValue.internalObjectValue.moreInternalObjectValue.someNumericValue'|true|
|'superComplexObjectValue.internalObjectValue.moreInternalObjectValue.someNullValue'|false|
|'superComplexObjectValue.internalObjectValue.moreInternalObjectValue.someBooleanValue'|false|
|'superComplexObjectValue.internalObjectValue.moreInternalObjectValue.someBooleanValue == false'|true|
|'typicalObjectValue.branch_name == "master"'|true|
|'typicalObjectValue.working_dir == "/var/tmp"'|false|
|'!!typicalObjectValue.success'|true|
|'typicalObjectValue.success == true'|true|
|'typicalObjectValue.nonExistant'|Undefined identifier member: 'nonExistant'|
|'typicalObjectValue'|Cannot evaluate object variable directly|
|'emptyObjectValue.someBooleanValue == false'|Undefined identifier member: 'someBooleanValue'|
|'emptyObjectValue.someBooleanValue'|Undefined identifier member: 'someBooleanValue'|
|'emptyObjectValue'|Cannot evaluate object variable directly|
|'superComplexObjectValue.'|Unexpected  at character 24|
|'superComplexObjectValue..'|Unexpected . at character 24|
|'superComplexObjectValue.internalObjectValue'|Cannot evaluate object variable directly|
|'superComplexObjectValue.internalObjectValue.'|Unexpected  at character 44|
|'superComplexObjectValue.internalObjectValue.moreInternalObjectValue'|Cannot evaluate object variable directly|
|'superComplexObjectValue.internalObjectValue.moreInternalObjectValue.'|Unexpected  at character 68|
|'superComplexObjectValue.internalObjectValue.moreInternalObjectValue.nonExistant'|Undefined identifier member: 'nonExistant'|
|'superComplexObjectValue.internal Object Value.moreInternalObjectValue.someNumericValue'|Cannot handle compound expressions.|
|'superComplexObjectValue.internalObject.Value.moreInternalObjectValue.someNumericValue'|Undefined identifier member: 'internalObject'|
|'somePositiveNumericValue > null'|The operator > cannot be used with number,null. It can only be used with the types: number,string|
|'somePositiveNumericValue < stringValue'|The operator < cannot be used with number,string. It can only be used with the types: number,string|
|'somePositiveNumericValue > true'|The operator > cannot be used with number,boolean. It can only be used with the types: number,string|
|'somePositiveNumericValue > simpleObjectValue'|The operator > cannot be used with number,object. It can only be used with the types: number,string|
|'complexObjectValue > simpleObjectValue'|The operator > cannot be used with object,object. It can only be used with the types: number,string|
|'false > null'|The operator > cannot be used with boolean,null. It can only be used with the types: number,string|
|'false > true'|The operator > cannot be used with boolean,boolean. It can only be used with the types: number,string|
|'someStringValue > null'|Invalid identifier: 'someStringValue'|
|'internalObjectValue.someNumericValue > null'|Invalid identifier: 'internalObjectValue'|
|'typicalObjectValue.working_dir > 82'|The operator > cannot be used with string,number. It can only be used with the types: number,string|
|'typicalObjectValue.working_dir > complexObjectValue.internalObjectValue.someNumericValue'|The operator > cannot be used with string,number. It can only be used with the types: number,string|
|'(somePositiveNumericValue > someZeroValue)'|true|
|'(somePositiveNumericValue >= someZeroValue) && true'|true|
|'(longStringValue > emptyStringValue) && (longStringValue >= emptyStringValue)'|true|
|'((longStringValue > emptyStringValue) && (longStringValue >= emptyStringValue))'|true|
|'(longStringValue > emptyStringValue && (longStringValue >= emptyStringValue))'|true|
|'60 > 35 && (50 > 22 && ((90 > 33) && ((26 > 10) && 15 > 30)) &#124;&#124; (80 > 32))'|true|
|'60 > 35 && (50 > 22 && ((90 > 33) && ((26 > 10) && 15 > 30)) &#124;&#124; (80 < 32))'|false|
|'60 > 35 && (50 > 22 && ((90 > 33) && ((26 > 10) && 15 > 30)) &#124;&#124; (somePositiveNumericValue > 32))'|true|
|'60 > 35 && (50 > 22 && ((90 > 33) && ((26 > 10) && 15 > 30)) &#124;&#124; (somePositiveNumericValue < 32))'|false|
|'somePositiveNumericValue / someZeroValue'|Division of 123 by 0|
|'somePositiveNumericValue % someZeroValue'|Modulo of 123 by 0|
|'somePositiveNumericValue / somePositiveNumericValue'|true|
|'9007199254740991 * 9007199254740991'|true|
|'1.231 * 5.2342'|true|
|'+true'|The operator + cannot be used with boolean. It can only be used with the types: number|
|'+234'|true|
|'~234'|Invalid unary operator: ~|
|'555+true'|The operator + cannot be used with number,boolean. It can only be used with the types: number,string|
|'23423-223'|true|
|'123-123'|false|
|'!true'|false|
|'!!true'|true|
|'!!!!!!!!!!true'|true|
|'!33'|false|
|'!!33'|true|
|'!0'|true|
|'!!0'|false|
|'55 % 10 == 5'|true|
|'1.79E+308 * 1.79E+308'|Numeric overflow|
|'15 &#124; 33'|Invalid binary operator: &#124;|
|'5555 @ 33333'|Unexpected "@" at character 5|
|'5555 $ 33333'|Cannot handle compound expressions.|
|'5555 \ 33333'|Unexpected "\" at character 5|
|'5555 : 33333'|Unexpected ":" at character 5|
|'5555 :::: 33333'|Unexpected ":" at character 5|
|'stringValue / 5'|The operator / cannot be used with string,number. It can only be used with the types: number|
|'stringValue / stringValue'|The operator / cannot be used with string,string. It can only be used with the types: number|
|'stringValue + 5'|The operator + cannot be used with string,number. It can only be used with the types: number,string|
|'stringValue + 5'|The operator + cannot be used with string,number. It can only be used with the types: number,string|
|'this'|keyword 'this' not supported.|
|'5 > 2 ? 4 : 1'|Trinary operator (?:) currently not supported.|
|'[1, 2, 3]'|Array literals ([1, 2, 3]) currently not supported.|
|'upper(stringValue)'|true|
|'substring(stringValue, 2, 4)'|true|
|'substring(stringValue, 20, 40)'|false|
|'upper()'|Expected 1 arguments for function 'upper'.|
|'lower(123)'|Invalid argument #0 of type number for function 'lower': expected string|
|'lower("asd", 3, 5)'|Expected 1 arguments for function 'lower'.|
|'trim(null)'|Invalid argument #0 of type null for function 'trim': expected string|
|'Number(false)'|Invalid argument #0 of type boolean for function 'Number': expected number,string|
|'hello(false)'|Unknown function: 'hello'|
|'123(false)'|Cannot handle compound expressions.|
|'String("123")'|true|
|'String(123)'|true|
|'String("0")'|true|
|'String(0)'|true|
|'Number("123")'|true|
|'Number(123)'|true|
|'Number("0")'|false|
|'Number(0)'|false|
|'Number("hello there")'|Error converting value 'hello there' to number|
|'Boolean("123")'|true|
|'Boolean(123)'|true|
|'Boolean("0")'|true|
|'Boolean(0)'|false|
|'Boolean("hello there")'|true|
|'Boolean("")'|false|
|'Boolean(Number(String(0)))'|false|
|'Boolean(Number(String(1)))'|true|
|'round("asd")'|Invalid argument #0 of type string for function 'round': expected number|
|'round("13")'|Invalid argument #0 of type string for function 'round': expected number|
|'round(13)'|true|
|'round(13) == round(13.1222)'|true|
|'round(13) != round(13.9922)'|true|
|'round(13) == floor(13.9922)'|true|
|'floor(13E8)'|true|
|'floor(1359 / 342)'|true|
|'upper("alon") == "ALON"'|true|
|'upper("asd") != "ALON"'|true|
|'upper("asd") != 333'|The operator != cannot be used with string,number. It can only be used with the types: number,string,boolean|
|'lower("DIAMANT") == "diamant"'|true|
|'lower("asd") != "ALON"'|true|
|'lower("ASD") == "asd"'|true|
|'trim("   ASD   ") == "ASD"'|true|
|'trim(lower("   ASD   ")) == "asd"'|true|
|'lower(trim("   ASD   ")) == "asd"'|true|
|'trimLeft("   ASD   ") == "ASD   "'|true|
|'trimRight("   ASD   ") == "   ASD"'|true|
|'replace("test me and you", "me", "her") == "test her and you"'|true|
|'replace("test ME and you", "me", "her") == "test ME and you"'|true|
|'replace("test ME and you", 123, "her") == "test ME and you"'|Invalid argument #1 of type number for function 'replace': expected string|
|'replace("test ME and you", 123) == "test ME and you"'|Expected 3 arguments for function 'replace'.|
|'replace("test ME and you", 123, 234, "her") == "test ME and you"'|Expected 3 arguments for function 'replace'.|
|'substring("test ME and you", 0, 4) == "test"'|true|
|'substring("test ME and you", 4, 8) == " ME "'|true|
|'substring("test ME and you", 4, null) == " ME and you"'|Invalid argument #2 of type null for function 'substring': expected number|
|'substring("test ME and you", 4, -1) == " ME and you"'|true|
|'length("hello") == 5'|true|
|'length(12345) == 5'|Invalid argument #0 of type number for function 'length': expected string|
|'includes("team", "i")'|false|
|'includes("team", "ea")'|true|
|'includes("team", 456)'|Invalid argument #1 of type number for function 'includes': expected string|
|'indexOf("team", "i") == -1'|true|
|'indexOf("team", "ea") == 1'|true|
|'indexOf("team", 456)'|Invalid argument #1 of type number for function 'indexOf': expected string|
|'indexOf(234234, "234")'|Invalid argument #0 of type number for function 'indexOf': expected string|
|'indexOf(String(999234234.23423), "234")'|true|
|'match("hello there you", "..ll.", false)'|true|
|'match("hello there you", "..LL.", false)'|false|
|'match("hello there you", "hell$", true)'|false|
|'match("hello there you", "^hell", true)'|true|
|'match("hello there you", "bye", false)'|false|
|'match("hello there you", 123, false)'|Invalid argument #1 of type number for function 'match': expected string|
|'match(457457, 123, false)'|Invalid argument #0 of type number for function 'match': expected string|
|'match("hello there you", "^hell", null)'|Invalid argument #2 of type null for function 'match': expected boolean|
|'match(123, false)'|Expected 3 arguments for function 'match'.|
|'match()'|Expected 3 arguments for function 'match'.|
|'match(   lower(String(round(99.234234)) + " is the number to call") + " in case of emergencies",    "100",    true) == (   99 * 2000 > 99 * 999 &&    trueBooleanValue &&    somePositiveNumericValue < someNegativeNumericValue) '|true|
|'match(author.name, "alon", true) && author.github.repositories > 10 && Number(substring(company.phoneNumber, 1, 4)) / 2 == 486'|true|


### Available gulp tasks

* `gulp lint` - runs eslint
* `gulp test:unit` - runs mocha unit tests
* `gulp coverage` - runs unit tests and generates coverage report
* `gulp test:integration` - runs karma tests
* `gulp test` - runs unit and integration tests and generates code coverage report
* `gulp` - default task, runs lint and test

## Running tests

Install dev dependencies and run the test:

```sh
$ npm install -d && gulp
```

## Author

**Alon Diamant (advance512)**

* [github/advance512](https://github.com/advance512)
* [Homepage](http://www.alondiamant.com)

## License

Copyright © 2016, [Codefresh](https://codefresh.io).
Released under the [MIT license](https://github.com/codefresh-io/cf-expression-evaluator/blob/master/LICENSE).

***
