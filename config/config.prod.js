export default {
    hash: true,
    chunks: ['codemirror', 'editor', 'common', 'umi'],
    chainWebpack: config => {
        config.merge({
            optimization: {
                minimize: true,
                splitChunks: {
                    chunks: 'all',
                    minChunks: 2,
                    automaticNameDelimiter: '.',
                    cacheGroups: {
                        codemirror_css: {
                            name: 'codemirror',
                            minChunks: 1,
                            minSize: 0,
                            test: /[\\/]node_modules[\\/]codemirror.*\.(css|less)$/,
                            priority: 30,
                        },
                        editor_css: {
                            name: 'editor',
                            minChunks: 1,
                            minSize: 0,
                            test: /[\\/]node_modules[\\/](@itellyou|@antv|codemirror|ot-json0|node-htmldiff|markdown|diff-dom).*\.(css|less)$/,
                            priority: 30,
                        },
                        commons_css: {
                            name: 'common',
                            minChunks: 1,
                            minSize: 0,
                            test: /[\\/]node_modules[\\/](antd|cropperjs|@ant-design|nprogress).*\.(css|less)$/,
                            priority: 25,
                        },
                        codemirror: {
                            name: 'codemirror',
                            minChunks: 1,
                            test({ resource }) {
                                return /[\\/]node_modules[\\/]codemirror/.test(resource);
                            },
                            priority: 22,
                        },
                        editor: {
                            name: 'editor',
                            minChunks: 1,
                            test({ resource, name }) {
                                if (name === 'itellyou-editor') {
                                    console.log(resource);
                                }
                                return (
                                    /[\\/]node_modules[\\/](@itellyou|@antv|ot-json0|node-htmldiff|markdown|diff-dom)/.test(
                                        resource,
                                    ) ||
                                    name === '@itellyou/itellyou-editor' ||
                                    name === 'itellyou-editor'
                                );
                            },
                            priority: 20,
                        },
                        common: {
                            name: 'common',
                            minChunks: 1,
                            test({ resource, name }) {
                                if (name === 'antd-utils') {
                                    console.log(resource);
                                }
                                return (
                                    /[\\/]node_modules[\\/](antd|cropperjs|@ant-design|nprogress|react-infinite-scroller|react-container-query|react-load-script|reconnecting-websocket|use-media-antd-query|qrcode.react)/.test(
                                        resource,
                                    ) ||
                                    /src[\\/]components/.test(resource) ||
                                    /src[\\/]utils/.test(resource) ||
                                    name === 'antd'
                                );
                            },
                            priority: 10,
                        },
                    },
                },
            },
        });
    },
};
