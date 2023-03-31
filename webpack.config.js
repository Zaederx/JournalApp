/**
 * Configuration file for webpack
 * Allows the files under entry to be
 * bundled with all their supporting js
 * Prevents missing dependcies.
 */

const path = require('path')
const outputPath = path.resolve(__dirname, 'js', 'view', 'bundle')
const nodeExternals = require('webpack-node-externals')
module.exports = {
    mode: 'production', //outputs minified js
    // mode: 'development', //outputs non-minified js - doesn't work with electron
    entry : {
        'create-entry': './ts/view/create-entry.ts',
        'edit-entry': './ts/view/edit-entry.ts',
        'edit-tags': './ts/view/edit-tags.ts',
        'view-entry': './ts/view/view-entry.ts',
        register: './ts/view/register.ts',
        settings: './ts/view/settings.ts',
        export: './ts/view/export.ts',
        login: './ts/view/login.ts',
        nav: './ts/view/nav.ts'
    },
    output: {
        filename: '[name].bundle.js',
        path: outputPath,
        libraryTarget: 'commonjs2'//see [link](https://github.com/webpack/webpack/issues/1114#issuecomment-462240689) for the difference
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
