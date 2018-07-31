const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const config = {
    mode: 'development',
    entry:'./src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    devServer:{
        contentBase: './dist',
        historyApiFallback: {
            rewrites: [
                {from: /./,to:'index.html'}
            ]
        },
        hot: true,
        inline: true
    },
    module:{
        rules: [
           {test: /\.css$/,use: 'css-loader'},
           
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({template: './src/index.html'})
    ]
};
module.exports = config;