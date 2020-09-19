import defaultSettings from './defaultSettings';
import routes from './router.config';
const { primaryColor } = defaultSettings;
// ref: https://umijs.org/config/
export default {
    ssr: {
        devServerRender: false,
    },
    theme: {
        'primary-color': primaryColor,
    },
    antd: {},
    dva: {
        hmr: true,
    },
    dynamicImport: {
        //loading: '@/components/Loading',
    },
    nodeModulesTransform: {
        type: 'none',
    },
    targets: {
        ie: 11,
    },
    title: false,
    locale: {
        default: 'zh-CN',
        baseNavigator: true,
    },
    routes,
    ignoreMomentLocale: true,
    lessLoader: {
        javascriptEnabled: true,
    },
    proxy: {
        '/api/(latex|puml|graphviz|flowchart|mermaid)': {
            target: 'https://g.itellyou.com/',
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
