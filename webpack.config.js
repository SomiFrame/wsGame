const path = require('path');
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
        "/javascripts/b-game": pathconfig.sourceES6path + '/Game.js'
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
            {
                test: /\.scss$/,
                loader: "style-loader!css-loader!sass-loader"
            },
            {
                test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.(jpe?g|png|gif)$/i,
                loaders: [
                    'file?hash=sha512&digest=hex&name=[hash].[ext]',
                    'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
                ]
            }
        ]
    },
    watch: true
};
console.log(__dirname);