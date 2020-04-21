export default {
    hash: true,
    chunks: ['common', 'umi'],
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
                        editor: {
                            name: 'editor',
                            test({ resource }) {
                                return /[\\/]node_modules[\\/](@itellyou|@antv|codemirror|ot-json0|node-htmldiff|markdown|diff-dom)/.test(
                                    resource,
                                );
                            },
                            priority: 20,
                        },
                        common: {
                            name: 'common',
                            test({ resource }) {
                                return /[\\/]node_modules[\\/](antd|cropperjs|@ant-design|nprogress|react-helemt)/.test(
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
