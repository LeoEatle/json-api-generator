'use strict';
const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const baseWebpackConfig = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack4-plugin');
const portfinder = require('portfinder');
const HtmlWebpackPosPlugin = require('html-webpack-pos-plugin');
const config = require('./config');
const utils = require('./utils');

for (var key in baseWebpackConfig.entry) {
    baseWebpackConfig.entry[key].unshift('react-hot-loader/patch');
}

const devWebpackConfig = merge(baseWebpackConfig, {
    mode: 'development',
    output: {
        publicPath: config.publicPath
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                ]
            }
        ]
    },
    devtool: 'source-map',
    // these devServer options should be customized in /config/index.js
    devServer: {
        clientLogLevel: 'error',
        inline: true,
        hot: true,
        compress: true,
        host: 'localhost',
        port: config.webpack.port,
        quiet: true // necessary for FriendlyErrorsPlugin
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: 'development'
            },
        }),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/client/main.html')
        })
        // new HtmlWebpackPosPlugin()
    ],
});

// multiple html pages
// devWebpackConfig.plugins = devWebpackConfig.plugins.concat(
//     // config.webpack.htmls.map((page) => {
//     //     const { head, body, chunks = [] } = page;
//     //     return new HtmlWebpackPlugin({
//     //         filename: page.key + '.html',
//     //         template: page.path,
//     //         inject: true,
//     //         chunks: [`js/${page.key}`].concat(chunks),
//     //         head,
//     //         body,
//     //         chunkSortMode: 'dependency',
//     //     });
//     // }),
//     new HtmlWebpackPlugin({
//         template: path.resolve(__dirname, 'src/client/main.html')
//     }),
//     new HtmlWebpackPosPlugin()
// );

module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || '8001';
    portfinder.getPort((err, port) => {
        if (err) {
            reject(err);
        } else {
            // publish the new Port, necessary for e2e tests
            process.env.PORT = port;
            // add port to devServer config
            devWebpackConfig.devServer.port = port;

            // Add FriendlyErrorsPlugin
            devWebpackConfig.plugins.push(
                new FriendlyErrorsPlugin({
                    compilationSuccessInfo: {
                        messages: [
                            `Your application is running here: http://${
                                devWebpackConfig.devServer.host
                            }:${port}`,
                        ],
                    },
                    // onErrors: config.dev.notifyOnErrors ? utils.createNotifierCallback() : undefined
                })
            );

            resolve(devWebpackConfig);
        }
    });
});
