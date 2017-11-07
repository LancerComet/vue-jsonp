// Polyfill fn.bind() for PhantomJS
/* eslint-disable no-extend-native */
Function.prototype.bind = require('function-bind')

// require all test files (files that ends with .spec.js)
require('./specs/format-params.spec.js')
require('./specs/vue-jsonp.spec.js')
