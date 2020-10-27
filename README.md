### ITELLYOU 前端
UmiJs[ITELLYOU 官网](https://www.itellyou.com)
### ITELLYOU 前端 SSR
NodeJs [itellyou-ssr](https://github.com/itellyou-com/itellyou-ssr)
### ITELLYOU 后台管理
UmiJs [itellyou-admin](https://github.com/itellyou-com/itellyou-admin)
### ITELLYOU API
SpringBoot2 [itellyou-api](https://github.com/itellyou-com/itellyou-api)
### ITELLYOU 协同编辑服务端
NodeJs [itellyou-editor-server](https://github.com/itellyou-com/itellyou-editor-server)

### 基本功能
[] 草稿编辑文章、问题（可协同）、回答、标签（可协同）
[] 文章、回答可打赏，可发布悬赏问答，可发布付费文章
[] 文章、问题、回答、用户、标签可收藏、关注
[] 内容可评论、点赞、反对、举报
[] 每日回答、文章阅读，评论，收藏等数据统计
[] 每月用户收到的打赏、回答悬赏、平台收益分成等收益统计
[] 用户拥有个人主页、单独一级路径、专栏拥有一级路径
[] 绑定支付宝、Github第三方账号
[] 用户专栏
[] 可订阅消息通知
[] 用户每项操作可定制等级、积分增减。现金可充值、可提现
[] 全站基于Lucene搜索
[] ...

### 本地启动

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

在 clone itellyou 项目到本地后，进入 itellyou 项目目录，使用 npm / yarn（推荐） 命令

```
yarn

yarn start
```
### 注意
需要配合itellyou-api使用，不然无法访问到api导致500错误

需要从itellyou-ssr启动访问，不然进入不了用户中心
