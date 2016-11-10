const fs = require('fs')
const path = require('path')

const browserify = require('browserify')
const gulp = require('gulp')
const rename = require('gulp-rename')
const umd = require('gulp-umd')
const util = require('gulp-util')

const ROOTPATH = path.resolve(__dirname)
const ENTRY = `${ROOTPATH}/src/index.js`

gulp.task('default', ['js:build'])

gulp.task('js:build', () => {
  new browserify({ entries: [ENTRY] })
    .transform('babelify', { presets: ["es2015", "stage-2"] })
    .plugin('minifyify', {
      map: false,
      uglify: {
        compress: {
          drop_console: true,
          dead_code: true,
          conditionals: true,
          unused: true,
          if_return: true,
          global_defs: {
            DEBUG: false
          }
        },
        mangle: true
      }
    })
    .on('log', util.log)
    .on('error', function (error) {
      console.error(error.toString())
      this.emit('end')
    })
    .bundle(function () {}) // Empty function for using minifyify.
    .pipe(fs.createWriteStream(`${ROOTPATH}/dist/vue-jsonp.min.js`))
})

gulp.task('js:umd', (file) => {
  gulp.src(ENTRY)
    .pipe(umd({
      exports: function (file) { return 'vueJsonp' }
    }))
    .pipe(rename('vue-jsonp.umd.js'))
    .pipe(gulp.dest(`${ROOTPATH}/dist`))
})