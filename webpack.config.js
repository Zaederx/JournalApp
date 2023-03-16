const path = require('path')
const outputPath = path.resolve(__dirname, 'js', 'view')
const nodeExternals = require('webpack-node-externals')
module.exports = {
    mode: 'production',
    entry : {
        'create-entry': './ts/view/create-entry.ts',
        'edit-entry': './ts/view/edit-entry.ts',
        'edit-tags': './ts/view/edit-tags.ts',
        'view-entry': './ts/view/view-entry.ts',
        settings: './ts/view/settings.ts',
        export: './ts/view/export.ts',
        nav: './ts/view/nav.ts'
    }
    ,
    output: {
        filename: '[name].bundle.js',
        path: outputPath,
        libraryTarget: 'commonjs-module'
    },
    module: {
        rules: [
            {
              use: 'ts-loader',
              exclude: /node_modules/,
            },
          ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    node: {
        global: false,
    __filename: false,
    __dirname: false
    },
    externalsPresets: { node: true },// in order to ignore node built-in modules
    externals: [nodeExternals()]//to ignore all modules in node_modules folder
}
