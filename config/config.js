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
        'font-family':
            'Chinese Quote, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, PingFang SC,Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif',
        'text-color': '#595959',
        'body-background': '#fafafa !important',
    },
    antd: {},
    dva: {
        hmr: true,
    },
    dynamicImport: {
        loading: '@/components/Loading',
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
            target: 'https://g.yanmao.cc/',
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
