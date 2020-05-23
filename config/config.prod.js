export default {
    hash: true,
    chunks: ['common', 'umi'],
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
                        commons_css: {
                            name: 'common',
                            minChunks: 1,
                            minSize: 0,
                            test: /[\\/]node_modules[\\/](antd|cropperjs|@ant-design|nprogress|react-infinite-scroller|react-container-query|react-load-script|reconnecting-websocket|use-media-antd-query|qrcode.react).*\.(css|less)$/,
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
                        common: {
                            name: 'common',
                            minChunks: 1,
                            test({ resource }) {
                                return (
                                    /[\\/]node_modules[\\/](antd|cropperjs|@ant-design|nprogress|react-infinite-scroller|react-container-query|react-load-script|reconnecting-websocket|use-media-antd-query|qrcode.react)/.test(
                                        resource,
                                    ) ||
                                    /src[\\/]components/.test(resource) ||
                                    /src[\\/]utils/.test(resource)
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
