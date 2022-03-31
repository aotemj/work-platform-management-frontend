const path = require('path');
// const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const LessPluginLists = require('less-plugin-lists');
const LessPluginFunctions = require('less-plugin-functions');
const StatsPlugin = require('stats-webpack-plugin');
// const svgToMiniDataURI = require('mini-svg-data-uri');
// const CopyPlugin = require('copy-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
// const EslintWebpackPlugin=require('eslint-webpack-plugin');
const hasha = require('hasha');
const namespacePefixer = require('postcss-selector-namespace');

const smp = new SpeedMeasurePlugin();

const distOutputPath = 'dist/assets/static';
const proxyConfig = require('./config/proxyConfig.js');
const {DEV_PORT} = require('./config/conf.default');


// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// output配置
const outputConfig = isProd =>
    (isProd
        ? {
            filename: 'js/[name].[chunkhash].min.js',
            chunkFilename: 'js/[name].[chunkhash].bundle.min.js',
            path: path.resolve(__dirname, distOutputPath),
            publicPath: '/assets/noah/',
            library: 'noah',
            libraryTarget: 'window',
        }
        : {
            filename: 'main.js',
            path: path.resolve(__dirname, distOutputPath),
            publicPath: '/',
        });

const getLocalIdent = ({resourcePath}, localIdentName, localName) => {
    if (/\.global\.(css|less)$/.test(resourcePath) || /node_modules/.test(resourcePath)) {
    // 不做cssModule 处理的
        return localName;
    }
    return `${localName}__${hasha(resourcePath + localName, {algorithm: 'md5'}).slice(0, 8)}`;
};

module.exports = (cliEnv = {}, argv) => {
    const mode = argv.mode;

    if (!['production', 'development'].includes(mode)) {
        throw new Error('The mode is required for NODE_ENV, BABEL_ENV but was not specified.');
    }

    const isProd = mode === 'production';
    const isDev = mode === 'development';

    const classNamesConfig = {
        loader: '@ecomfe/class-names-loader',
        options: {
            classNamesModule: require.resolve('classnames'),
        },
    };
    // 生产环境使用 MiniCssExtractPlugin
    const extractOrStyleLoaderConfig = isProd ? MiniCssExtractPlugin.loader : 'style-loader';

    // 根据 patterns 使用 style-resources-loader
    const makeStyleResourcesLoader = patterns => ({
        loader: 'style-resources-loader',
        options: {
            patterns,
            injector: 'append',
        },
    });

    const lessLoaderConfig = {
        loader: 'less-loader',
        options: {
            lessOptions: {
                javascriptEnabled: true,
                modifyVars: {
                    'ant-prefix': 'ant',
                },
                plugins: [new LessPluginLists(), new LessPluginFunctions({alwaysOverride: true})],
            },
        },
    };

    const cssLoaderConfig = {
        loader: 'css-loader',
        options: {
            modules: {getLocalIdent},
            importLoaders: 1,
        },
    };

    const postcssLoaderConfig = {
        loader: 'postcss-loader',
        options: {
            postcssOptions: {
                plugins: [
                    namespacePefixer({
                        namespace: '.osc-noah',
                    }),
                ],
            },
        },
    };
    const webpackConfig = {
        entry: './src/App.js',
        mode: isProd ? 'production' : 'development',
        output: outputConfig(isProd),
        optimization: isProd ? {
            minimize: isProd,
            usedExports: true,
            concatenateModules: true,
            splitChunks: {
                chunks: 'all',
                name: false,
            },
        } : undefined,
        devtool: (() => {
            if (isProd) {
                return 'source-map';
            }
            if (isDev) {
                return 'inline-cheap-module-source-map';
            }
            return false;
        })(),
        resolve: {
            extensions: ['.jsx', '.js', '.css'],
        },
        stats: {
            'assets': false,
            'builtAt': false,
            'modules': false,
            'entrypoints': false,
            'warnings': false,
        },
        devServer: {
            hot: true,
            port: DEV_PORT,
            static: {
                directory: path.resolve(__dirname, '../dist'),
            },
            client: {
                progress: true,
                overlay: {
                    errors: true,
                    warnings: false,
                },
            },
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': '*',
            },
            historyApiFallback: {
                disableDotRule: true,
                index: '/',
            },
            proxy: isProd ? undefined : proxyConfig,
        },
        plugins: [
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: path.resolve(__dirname, 'public/index.html'),
                inject: true,
            }),
            isProd
            && new MiniCssExtractPlugin({
                filename: 'style/[name].[contenthash].css',
                chunkFilename: 'style/[name].[contenthash].chunk.css',
                // experimentalUseImportModule: true,
            }),
            new StatsPlugin('stats-manifest.json', {
                chunkModules: false,
                entrypoints: true,
                source: false,
                chunks: false,
                modules: false,
                assets: false,
                children: false,
                outputPath: false,
                warnings: false,
                chunkGroups: false,
                exclude: [/node_modules/],
            }),
        ].filter(Boolean),
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env', '@babel/preset-react'],
                                // eslint-disable-next-line max-len
                                plugins: ['react-require', ['import', {libraryName: 'antd', libraryDirectory: 'es', style: true}]],
                            },
                        },
                        // 'eslint-loader',
                    ],
                },
                {
                    test: /\.css/,
                    include: [
                        path.resolve(__dirname, 'node_modules/antd/'),
                        path.resolve(__dirname, 'node_modules/@osui'),
                        path.resolve(__dirname, 'node_modules/github-markdown-css'),
                        path.resolve(__dirname, 'node_modules/codemirror'),
                        path.resolve(__dirname, 'node_modules/react-base-table'),
                    ],
                    use: [
                        extractOrStyleLoaderConfig,
                        {loader: 'css-loader', options: {importLoaders: 1}},
                        postcssLoaderConfig,
                    ],
                },
                {
                    test: /\.less$/,
                    // eslint-disable-next-line max-len
                    include: [path.resolve(__dirname, 'node_modules/antd/'), path.resolve(__dirname, 'node_modules/@osui')],
                    use: [
                        extractOrStyleLoaderConfig,
                        {loader: 'css-loader', options: {importLoaders: 3}},
                        postcssLoaderConfig,
                        lessLoaderConfig,
                        makeStyleResourcesLoader([
                            path.resolve(__dirname, 'node_modules/@osui/theme/dist/antd-vars-patch.less'),
                            path.resolve(__dirname, 'node_modules/@osui/theme/dist/less-functions-overrides.less'),
                        ]),
                    ],
                },
                {
                    test: /\.less$/,
                    include: [path.resolve(__dirname, 'src')],
                    use: [
                        classNamesConfig,
                        extractOrStyleLoaderConfig,
                        cssLoaderConfig,
                        'postcss-loader',
                        lessLoaderConfig,
                        makeStyleResourcesLoader([
                            path.resolve(__dirname, 'node_modules/@osui/theme/dist/antd-vars-patch.less'),
                            path.resolve(__dirname, 'node_modules/@osui/theme/dist/less-functions-overrides.less'),
                            path.resolve(__dirname, './src/index.global.less'),
                        ]),
                    ],
                },
                // 静态资源
                {
                    test: /\.(png|jpg|gif)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'resource/[hash][ext][query]',
                    },
                },
                {
                    test: /\.svg$/,
                    include: [
                        path.resolve(__dirname, 'node_modules/antd/'),
                        path.resolve(__dirname, 'node_modules/@osui'),
                    ],
                    use: ['file-loader'],
                },

                {
                    test: /\.svg$/,
                    include: [/icons/, /src/],
                    use: [
                        {
                            loader: 'svg-mixed-loader',
                            options: {
                                url: {
                                    name: 'resource/[name].[hash].[ext]',
                                    limit: 0,
                                },
                                react: {
                                    displayName: true,
                                },
                            },
                        },
                    ],
                },
            ],
        },
    };
    return isProd ? webpackConfig : smp.wrap(webpackConfig);
};
