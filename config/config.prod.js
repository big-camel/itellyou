export default {
    chunks: ['editors', 'vendors', 'umi'],
    chainWebpack: function(config, { webpack }) {
        config.merge({
            optimization: {
                minimize: true,
                splitChunks: {
                    chunks: 'all',
                    minSize: 30000,
                    minChunks: 2,
                    automaticNameDelimiter: '.',
                    cacheGroups: {
                        editor: {
                            name: 'editors',
                            test({ resource }) {
                                return /[\\/]node_modules[\\/](@itellyou|@antv|codemirror|ot-json0|node-htmldiff|markdown-it|diff-dom)/.test(
                                    resource,
                                );
                            },
                            priority: 20,
                        },
                        vendor: {
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
