'use strict';
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
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
                        },
                    },
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
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it use publicPath in webpackOptions.output
                            //   publicPath: config.publicPath
                        },
                    },
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
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    {
                        loader: 'url-loader',
                        query: {
                            limit: 1024,
                            name: `img/[name]-[hash:6].[ext]`,
                        },
                    },
                ],
            },
        ],
    },
    output: {
        filename: '[name]-[chunkhash:6].js', // string
        chunkFilename: 'js/[name]-[chunkhash:6].bundle.js',
        publicPath: config.publicPath, // string
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
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
        // new webpack.DefinePlugin({
        //     'process.env': {
        //         NODE_ENV: 'production'
        //     }
        // }),
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
            cssProcessorOptions: { safe: true },
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        // keep module.id stable when vendor modules does not change
        new webpack.HashedModuleIdsPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/client/main.html'),
            minify: {
                removeAttributeQuotes: true,
                collapseWhitespace: true,
                minifyCSS: true,
                removeComments: true,
            },
        }),
        new CleanWebpackPlugin(['dist'], {
            root: path.resolve(__dirname, '../'),
            verbose: true,
            dry: false,
        }),
    ],
});

if (config.analyzeMode) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
        .BundleAnalyzerPlugin;
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
