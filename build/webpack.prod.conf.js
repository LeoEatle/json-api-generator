'use strict';
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');

const HtmlWebpackPlugin = require('html-webpack-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const HtmlWebpackPosPlugin = require('html-webpack-pos-plugin');
// const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const config = require('./config');

const webpackConfig = merge(baseWebpackConfig, {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                          // you can specify a publicPath here
                          // by default it use publicPath in webpackOptions.output
                        //   publicPath: config.publicPath
                        }
                    },
                    'css-loader',
                    'postcss-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                          // you can specify a publicPath here
                          // by default it use publicPath in webpackOptions.output
                        //   publicPath: config.publicPath
                        }
                    },
                    'css-loader',
                    'postcss-loader'
                ]
            }
        ]
    },
    devtool: 'source-map',
    output: {
        filename: '[name]-[chunkhash:6].js', // string
        chunkFilename: 'js/[name]-[chunkhash:6].bundle.js',
        publicPath: config.publicPath, // string
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        raven: 'Raven',
        jquery: 'jQuery',
    },
    performance: {
        hints: 'warning', // enum
        maxAssetSize: 200000, // int (in bytes),
        maxEntrypointSize: 400000, // int (in bytes)
        assetFilter: function(assetFilename) {
            // Function predicate that provides asset filenames
            return (
                assetFilename.endsWith('.css') || assetFilename.endsWith('.js')
            );
        },
    },
    // webpack 4 config begin
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: 'js/commons',
                    chunks: 'initial',
                    minChunks: 14,
                },
            },
        },
    },
    // webpack 4 config end
    plugins: [
        // new HardSourceWebpackPlugin({
        //     options: {
        //         cacheDirectory: 'node_modules/.cache/hard-source/[confighash]'
        //     }
        // }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: 'production'
            }
        }),
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    warnings: false,
                },
            },
            sourceMap: true,
            parallel: true,
        }),
        new OptimizeCSSPlugin({
            cssProcessorOptions: { safe: true }
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        // keep module.id stable when vendor modules does not change
        new webpack.HashedModuleIdsPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/client/main.html'),
            minify: {
                removeAttributeQuotes: true,
                collapseWhitespace: true,
                minifyCSS: true,
                removeComments: true,
            }
        })
    ],
});


if (config.analyzeMode) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
        .BundleAnalyzerPlugin;
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
