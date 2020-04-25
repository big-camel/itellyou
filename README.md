### ITELLYOU 前端
使用 umijs react 框架开发

### 本地启动
@itellyou/itellyou-editor 编辑器模块为私有包，除非本地使用 itellyou-editor itellyou-engine itellyou-ajax itellyou-request 编译好本地包，否则需要 npm 账号权限

在 config/config.js 中配置后端 api，http://g.itellyou.com/ 是编辑器中 文本绘图 功能的后端支持，项目在 drawing.itellyou.com

```
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
        }
    },
```

在 clone itellyou 项目到本地后，进入 itellyou 项目目录，使用 npm / 或 yarn（推荐） 命令

```
yarn

yarn start
```
