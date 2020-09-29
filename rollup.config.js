import typescript from 'rollup-plugin-typescript2'
import cleanup from 'rollup-plugin-cleanup'
import del from 'rollup-plugin-delete'
import { terser } from 'rollup-plugin-terser'

export default {
  input: './lib/index.ts',

  output: [
    {
      file: './dist/index.js',
      format: 'umd',
      name: 'VueJsonp'
    },
    {
      file: './dist/index.esm.js',
      format: 'es'
    }
  ],

  plugins: [
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          target: 'ES5'
        },
        include: [
          'lib/**/*'
        ]
      }
    }),

    del({
      targets: 'dist/*'
    }),

    terser(),
    cleanup()
  ]
}
