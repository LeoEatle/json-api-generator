'use strict';
const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const baseWebpackConfig = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack4-plugin');
const portfinder = require('portfinder');
const config = require('./config');

const devWebpackConfig = merge(baseWebpackConfig, {
    mode: 'development',
    output: {
        publicPath: config.publicPath,
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: [require('autoprefixer')],
                        },
                    },
                    'less-loader',
                ],
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: [require('autoprefixer')],
                        },
                    },
                ],
            },
        ],
    },
    devtool: 'source-map',
    // these devServer options should be customized in /config/index.js
    devServer: {
        clientLogLevel: 'error',
        inline: true,
        hot: true,
        // compress: true,
        host: 'localhost',
        port: config.port || 8001,
        quiet: true, // necessary for FriendlyErrorsPlugin
    },
    plugins: [
        // new webpack.DefinePlugin({
        //     'process.env': {
        //         NODE_ENV: 'development'
        //     },
        // }),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/client/main.html'),
        }),
    ],
});

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
