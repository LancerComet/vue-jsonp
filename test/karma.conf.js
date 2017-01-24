const path = require('path')
const aliasify = require("aliasify")
const projectRoot = path.resolve(__dirname, '../')

module.exports = function (config) {
  config.set({
    browsers: ['Chrome'],

    browserNoActivityTimeout: 0,

    frameworks: ['browserify', 'mocha', 'sinon-chai'],

    reporters: ['spec'],

    files: ['./index.js'],

    preprocessors: {
      ['./index.js']: ['browserify']
    },

    babelPreprocessor: {
      options: {
        presets: ['es2015'],
        sourceMap: 'inline'
      },

      sourceFileName: function (file) {
        return file.originalPath
      }
    },

    browserify: {
      debug: true,
      extensions: ['.js'],
      configure: function (bundle) {
        bundle.on('prebundle', function () {
          bundle
            .transform('babelify', { presets: ['es2015', 'stage-2'] })
            .transform(aliasify, { aliases: { 'src': projectRoot + '/src' } })
        })
      }
    }

  })
}
