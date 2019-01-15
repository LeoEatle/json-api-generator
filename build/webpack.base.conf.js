const path = require('path')
const config = require('../config/project')
const isProduction = process.env.NODE_ENV === 'production'

const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const srcPath = path.resolve(path.dirname(__dirname), 'src')

const webpackConfig = {
    entry: {
        app: '../src/client/main.tsx'
    },
    output: {
        path: path.resolve(path.dirname(__dirname), 'dist/client'), // string
        filename: '[name].js', // string
        chunkFilename: 'js/[name].chunk.js' // string
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
                            name: `img/[path][name]${isProduction ? '-[hash:6]' : ''}.[ext]`
                        }
                    }
                ]
            },
            {
                test: /\.jsx?$/,
                include: [
                    srcPath,
                    path.resolve('./config/speed.config.js')
                ],
                use: [
                    {
                        loader: 'thread-loader',
                        options: {
                            workers: 3
                        }
                    },
                    {
                        loader: 'babel-loader',
                        options: {
                            // cacheDirectory: './.cache/'
                        }
                    }
                ]
            },
            {
                test: /\.tsx?$/,
                include: [srcPath],
                use: [
                    {
                        loader: 'thread-loader',
                        options: {
                            // there should be 1 cpu for the fork-ts-checker-webpack-plugin
                            // workers: require('os').cpus().length - 1,
                            workers: 3 // fastest build time for devServer: 3 threads; for production: 7 threads (os cpus minus 1)
                        }
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            // disable type checker - we will use it in fork plugin
                            transpileOnly: true,
                            happyPackMode: true
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader'
                    }
                ]
            }
            // use all of these nested rules (combine with conditions to be useful)
        ]
    },
    resolve: {
        // options for resolving module requests
        modules: ['node_modules', path.resolve(__dirname, 'src')],

        extensions: ['.js', '.json', '.jsx', '.ts', '.tsx', '.css', '.less', '.png', '.jpeg', '.svg'],
        // extensions that are used

        alias: {
            // a list of module name aliases
            client: path.join(srcPath, '/client'),
            server: path.join(srcPath, '/server'),
            common: path.join(srcPath, '/common/'),
            img: path.join(srcPath, '/img/')
        }
    },

    performance: {
        hints: false // enum
    },

    devtool: false, // enum

    context: path.dirname(__dirname), // string (absolute path!)
    // the home directory for webpack

    target: 'web', // enum

    stats: {
        errors: true,
        errorDetails: true
    },
    // lets you precisely control what bundle information gets displayed

    plugins: [
    ],
    parallelism: 2, // number
    // limit the number of parallel processed modules
    profile: true, // boolean
    // capture timing information
    bail: false, //boolean
    // fail out on the first error instead of tolerating it.
    // cache: false // boolean
    cache: true
    // disable/enable caching
}


module.exports = webpackConfig
