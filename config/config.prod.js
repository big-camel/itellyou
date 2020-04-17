export default {
    hash: true,
    publicPath: 'http://cdn-object.itellyou.com/web/',
    chainWebpack: config => {
        config.merge({
            optimization: {
                minimize: true,
                splitChunks: {
                    chunks: 'all',
                    minSize: 30000,
                    minChunks: 2,
                    automaticNameDelimiter: '.',
                    cacheGroups: {
                        editors_css: {
                            name: 'editor-styles',
                            minChunks: 1,
                            minSize: 0,
                            test: /[\\/]node_modules[\\/](@itellyou|@antv|codemirror|ot-json0|node-htmldiff|markdown|diff-dom).*\.(css|less)$/,
                            priority: 30,
                        },
                        editors: {
                            name: 'editors',
                            test({ resource }) {
                                return /[\\/]node_modules[\\/](@itellyou|@antv|codemirror|ot-json0|node-htmldiff|markdown|diff-dom)/.test(
                                    resource,
                                );
                            },
                            priority: 20,
                        },
                        vendors: {
                            name: 'vendors',
                            test({ resource }) {
                                return /[\\/]node_modules[\\/](antd|cropperjs|@ant-design|nprogress)/.test(
                                    resource,
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
