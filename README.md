# Codefresh Expression Evaluator

> A parser that accepts a set of named objects (with properties) and an expression, verifies syntax and evaluates the expression.

Developed in [Codefresh](https://www.codefresh.io).

# UPDATE THIS

-------------------
-------------------
-------------------

### Features

.
.
.

### Supported Functions

..
..
..

### Installation
...
...
...
```bash
$ npm install cf-expression-parser --save
```

## Usage

```js
let parseBitbucketUrl = require('parse-bitbucket-url');
parseBitbucketUrl('https://bitbucket.org/jespern/django-piston');
```

### Available gulp tasks
....
....
....
* `gulp lint` - runs eslint and jscs
* `gulp test:unit` - runs mocha unit tests
* `gulp coverage` - runs unit tests and generates coverage report
* `gulp test:integration` - runs karma tests
* `gulp test` - runs unit and integration tests and generates code coverage report
* `gulp browserify` - builds the script for browser
* `gulp compile` - runs uglify and generates minified script
* `gulp build` - runs browserify and compile
* `gulp watch` - runs watchify and watches for changes and builds script in background
* `gulp` - default task, runs lint, test, build and compile tasks

## Running tests

Install dev dependencies and run the test:

```sh
$ npm install -d && gulp test
```

## Author

**Alon Diamant (advance512)**

* [github/advance512](https://github.com/advance512)
* [Homepage](http://www.alondiamant.com)

## License

Copyright © 2016, [Codefresh](https://codefresh.io).
Released under the [MIT license](https://github.com/advance512/parse-bitbucket-url/blob/master/LICENSE).

***
