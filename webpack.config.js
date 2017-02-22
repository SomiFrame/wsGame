var path = require('path');
var webpack = require('webpack');


// Phaser webpack config
var phaserModule = path.join(__dirname, '/node_modules/phaser/');
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js');
var pixi = path.join(phaserModule, 'build/custom/pixi.js');
var p2 = path.join(phaserModule, 'build/custom/p2.js');

var pathconfig = {
    public: path.join(__dirname, 'public'),
    publicJs: path.join(__dirname, 'public', 'javascripts'),
    publicImg: path.join(__dirname, 'public', 'images'),
    publicStyle: path.join(__dirname, 'public', 'stylesheets'),
    viewPath: path.join(__dirname, 'views'),
    assetsPath: path.join(__dirname, 'resources'),
    sourceSass: path.join(__dirname, 'resources', 'sass'),
    sourceES5path: path.join(__dirname, 'resources', 'js', 'es5'),
    sourceES6path: path.join(__dirname, 'resources', 'js', 'es6')
};
module.exports = {
    entry: {
        // "/javascripts/b-index": pathconfig.sourceES5path + '/index.js',
        "/javascripts/b-flappybird": pathconfig.sourceES6path + '/flappybird.js'
    },
    output: {
        path: pathconfig.public,
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            { test: /pixi.js/, loader: "script-loader" },
            { test: /phaser.js/, loader: "script-loader" },
            { test: /p2.js/, loader: "script-loader" },
            {
                test: /\.scss$/,
                loader: "style-loader!css-loader!sass-loader"
            },
            {
                test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.(jpe?g|png|gif|mp3)$/i,
                loaders: [
                    'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
                    'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false'
                ]
            }

        ]
    },
    resolve: {
        alias: {
            'phaser': phaser,
            'pixi.js': pixi,
            'p2': p2,
        }
    },
    watch: true
};
console.log(__dirname);