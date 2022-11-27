require('dotenv').config()

const Webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')
const HtmlInterpolatePlugin = require('interpolate-html-plugin')
const path = require('path')

const definitions = Object.entries(process.env)
    .filter(([ key ]) => {
        return key.indexOf('REACT_APP_') === 0
    })
    .reduce((definitions, [ key, value ]) => {
        definitions[key] = JSON.stringify(value)
        return definitions
    }, {})
;

module.exports = (env) => {

    const config = {}
    const gitlabUrl = process.env.REACT_APP_GITLAB_URL
    const applicationId = process.env.REACT_APP_GITLAB_APPLICATION_CLIENT_ID
    const appName = process.env.REACT_APP_NAME
    const appDesc = process.env.REACT_APP_DESC

    if (env.production) {
        config.mode = 'production'
    }

    config.entry = {
        index: [
            './src/index.tsx'
        ]
    }

    config.module = {
        rules: [
            {
                test: /\.(ts|tsx|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'swc-loader',
                    options: {
                        env: {
                            targets: 'last 2 versions'
                        },
                        jsc: {
                            parser: {
                                syntax: "typescript",
                                tsx: true,
                                decorators: false,
                                dynamicImport: true
                            }
                        },
                        minify: true
                    }
                },
            },
            {
                test: /\.css$/,
                use: [
                    { loader:'style-loader' },
                    { loader:'css-loader' },
                ],
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: { minimize: true }
                    }
                ]
            },
            {
                test: /\.(ico)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: '',
                        },
                    }
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'img',
                        },
                    },
                ]
            }
        ]
    }

    config.resolve = {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
        alias: {
            'src': path.resolve(__dirname, 'src')
        }
    }

    config.plugins = []

    // config.plugins.push(new CopyPlugin({
    //     patterns: [
    //         'public/favicon.ico',
    //         'public/favicon-180.png',
    //         'public/favicon-192.png',
    //         'public/favicon-512.png',
    //         'public/manifest.json',
    //         'public/robots.txt',
    //     ]
    // }))

    config.plugins.push(new HtmlPlugin({
        template: 'public/index.html',
        hash: false,
        inject: true,
        filename: 'index.html',
        chunks: ['index'],
    }))

    config.plugins.push(new HtmlInterpolatePlugin( {
        PUBLIC_URL: '',
    }))

    config.plugins.push(new Webpack.DefinePlugin({
        'process.env': {
            ...definitions,
            REACT_APP_GITLAB_URL: JSON.stringify(gitlabUrl),
            REACT_APP_GITLAB_APPLICATION_CLIENT_ID: JSON.stringify(applicationId),
            REACT_APP_NAME: JSON.stringify(appName),
            REACT_APP_DESC: JSON.stringify(appDesc),
            //solution: JSON.stringify(solution)
        }
    }))

    config.output = {
        clean: true,
        //path: path.join(__dirname, 'dist/'+solution),
        path: path.join(__dirname, 'dist'),
        pathinfo: false,
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[name].js',
        assetModuleFilename: 'media/[name].[hash][ext]',
    }

    if (env.production) {
        config.output.filename = '[name].[contenthash].js'
        config.output.chunkFilename = '[name].[contenthash].js'
    }

    if (!env.production) {
        config.devServer = {
            port: 3000,
            static: ["./build"],
            open: true,
            hot: true ,
            liveReload: true,
            historyApiFallback: true,
            // proxy: {
            //     '/api' : {
            //         target: proxyTargetUrl,
            //         secure: false,
            //         changeOrigin: true,
            //     }
            // },
        }
    }

    if (!env.production) {
        config.devtool = 'source-map'
    }

    return config
}
