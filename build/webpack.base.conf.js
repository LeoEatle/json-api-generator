const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const srcPath = path.resolve(path.dirname(__dirname), 'src');
const webpackConfig = {
    entry: path.resolve(srcPath, './client/main.tsx'),
    output: {
        path: path.resolve(path.dirname(__dirname), 'dist/client'), // string
        filename: '[name].js', // string
        chunkFilename: 'js/[name].chunk.js', // string
    },

    module: {
        // configuration regarding modules
        rules: [
            // rules for modules (configure loaders, parser options, etc.)
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    {
                        loader: 'url-loader',
                        query: {
                            limit: 1024,
                            name: `img/[path][name].[ext]`,
                        },
                    },
                ],
            },
            {
                test: /\.(j|t)sx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                },
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                    },
                ],
            }
        ],
    },
    resolve: {
        // options for resolving module requests
        modules: ['node_modules', path.resolve(srcPath)],

        extensions: [
            '.js',
            '.json',
            '.jsx',
            '.ts',
            '.tsx',
            '.css',
            '.less',
            '.png',
            '.jpeg',
            '.svg',
        ],
        // extensions that are used

        alias: {
            // a list of module name aliases
            client: path.join(srcPath, '/client'),
            server: path.join(srcPath, '/server'),
            common: path.join(srcPath, '/common/'),
            img: path.join(srcPath, '/img/'),
        },
    },

    performance: {
        hints: false, // enum
    },

    devtool: false, // enum

    context: path.dirname(__dirname), // string (absolute path!)
    // the home directory for webpack

    target: 'web', // enum

    stats: {
        errors: true,
        errorDetails: true,
    },
    // lets you precisely control what bundle information gets displayed

    plugins: [
        new ForkTsCheckerWebpackPlugin()
    ],
    parallelism: 4, // number
    // limit the number of parallel processed modules
    profile: true, // boolean
    // capture timing information
    bail: false, //boolean
    // fail out on the first error instead of tolerating it.
    cache: true,
    // disable/enable caching
};

module.exports = webpackConfig;
