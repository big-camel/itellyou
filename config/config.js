import defaultSettings from './defaultSettings';
import routes from './router.config';
const { primaryColor, title } = defaultSettings;

// ref: https://umijs.org/config/
export default {
    theme: {
        'primary-color': primaryColor,
    },
    routes,
    antd: {},
    dva: {
        hmr: true,
    },
    dynamicImport: {},
    targets: {
        ie: 11,
    },
    title,
    locale: {
        default: 'zh-CN',
        baseNavigator: true,
    },
    ignoreMomentLocale: true,
    lessLoader: {
        javascriptEnabled: true,
    },
    proxy: {
        '/api/(latex|puml|graphviz|flowchart|mermaid)': {
            target: 'http://g.itellyou.com/',
            changeOrigin: true,
            pathRewrite: { '^/api': '' },
        },
        '/api': {
            target: 'http://localhost:8082',
            changeOrigin: true,
            pathRewrite: { '^/api': '' },
        },
        //"/?(**/)!(*.*)":{
        //    target: "http://localhost:8081",
        //    changeOrigin: true
        //}
    },
    manifest: {
        basePath: '/',
    },
    //devtool:"eval",
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
