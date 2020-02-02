import slash from 'slash2'
import defaultSettings from './defaultSettings'
import routes from './router.config'
const { primaryColor , title } = defaultSettings

// ref: https://umijs.org/config/
export default {
    treeShaking: true,
    theme: {
        'primary-color': primaryColor
    },
    routes,
    plugins: [
        // ref: https://umijs.org/plugin/umi-plugin-react.html
        ['umi-plugin-react', {
            antd: true,
            dva: true,
            dynamicImport: { webpackChunkName: true },
            title,
            dll: true,
            locale: {
                enable: true,
                default: 'en-US',
            },
            routes: {
                exclude: [
                    /models\//,
                    /services\//,
                    /model\.(t|j)sx?$/,
                    /service\.(t|j)sx?$/,
                    /components\//,
                ],
            },
        }],
    ],
    ignoreMomentLocale: true,
    lessLoaderOptions: {
        javascriptEnabled: true
    },
    disableRedirectHoist: true,
    //disableCSSModules:true,
    cssLoaderOptions: {
        modules: true,
        getLocalIdent: (context , _ , localName) => {
            if (
                    context.resourcePath.includes('node_modules') ||
                    context.resourcePath.includes('global.less')
            ) {
                return localName
            }
            return localName
            const match = context.resourcePath.match(/src(.*)/)
            if (match && match[1]) {
                const path = match[1].replace('.less', '');
                const arr = slash(path)
                .split('/')
                .map(a => a.replace(/([A-Z])/g, '-$1'))
                .map(a => a.toLowerCase())

                return `ity${arr.join('-')}-${localName}`.replace(/--/g, '-');
            }
            return localName
        }
    },
    proxy: {
        "/api/(latex|puml|graphviz|flowchart|mermaid)": {
            target: "http://g.itellyou.com/",
            changeOrigin: true,
            pathRewrite: { "^/api" : "" }
        },
        "/api": {
            target: "http://localhost:8082",
            changeOrigin: true,
            pathRewrite: { "^/api" : "" }
        },
        //"/?(**/)!(*.*)":{
        //    target: "http://localhost:8081",
        //    changeOrigin: true
        //}
    },
    manifest: {
        basePath: '/',
    }
}
  