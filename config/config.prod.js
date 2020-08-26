export default {
    hash: true,
    chunks: ['styles', 'codemirror', 'umi', 'common'],
    chainWebpack: (config) => {
        config.merge({
            optimization: {
                minimize: true,
                splitChunks: {
                    chunks: 'all',
                    minChunks: 2,
                    automaticNameDelimiter: '.',
                    cacheGroups: {
                        styles: {
                            name: 'styles',
                            chunks: 'all',
                            test: /\.(less|css)$/,
                            minChunks: 1,
                            minSize: 0,
                            priority: 120,
                            reuseExistingChunk: true,
                            enforce: true,
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
                                    ) || /[\\/]src[\\/](layouts|components|utils)/.test(resource)
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
