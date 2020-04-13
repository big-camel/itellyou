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
};
