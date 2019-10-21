import defaultSettings from './defaultSettings'
import routes from './router.config'
const { primaryColor , title } = defaultSettings

// ref: https://umijs.org/config/
export default {
    treeShaking: true,
    theme: {
        'primary-color': primaryColor,
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
    proxy: {
        "/api/(latex|puml|graphviz|flowchart|mermaid)": {
            target: "http://g.itellyou.com/",
            changeOrigin: true,
            pathRewrite: { "^/api" : "" }
        },
        "/api": {
            target: "http://api.itellyou.com/",
            changeOrigin: true,
            pathRewrite: { "^/api" : "" }
        }
    },
    manifest: {
        basePath: '/',
    }
  }
  