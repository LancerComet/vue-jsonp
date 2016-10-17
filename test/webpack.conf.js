module.exports = {
    entry: {
        app: './test.js'
    },

    output: {
        path: './',
        filename: 'test.build.js'
    },

    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel', exclude: /node_modules/ }
        ]
    },

    watch: true
}