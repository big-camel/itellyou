### ITELLYOU 前端
UmiJs[ITELLYOU 官网](https://www.aomao.com)
### ITELLYOU 前端 SSR
NodeJs [itellyou-ssr](https://github.com/itellyou-com/itellyou-ssr)
### ITELLYOU 后台管理
UmiJs [itellyou-admin](https://github.com/itellyou-com/itellyou-admin)
### ITELLYOU API
SpringBoot2 [itellyou-api](https://github.com/itellyou-com/itellyou-api)
### ITELLYOU 协同编辑服务端
NodeJs [itellyou-editor-server](https://github.com/itellyou-com/itellyou-editor-server)

### 基本功能
#### 标签模块
多人实时协同编辑标签，在无编辑操作或手动保存时生成一个快照作为历史版本。历史版本可随时查看和恢复
每个正常用户都可以编辑、创建标签
标签可以关联到专栏、文章、问题
加入全站检索

#### 文章模块
多人实时协同编辑文章，在无编辑操作或手动保存时生成一个快照作为历史版本。历史版本可随时查看和恢复
可设置或自动生成文章摘要和封面
可设置免费阅读百分比，其余部分使用积分或者现金付费阅读。或者仅关注后阅读。
可关联标签和专栏
加入全站检索

#### 专栏模块
用于归纳用户拥有一系列相同特性的文章
可独立设置域名路径，拥有专属链接。
具有简介、Logo彰显主题
可关注、每次专栏有新的文章发布时会收到通知
加入全站检索

#### 问答模块
问题和回答在编辑时同样需要生成快照作为历史版本。历史版本可随时查看和恢复
回答可设置免费阅读百分比，其余部分使用积分或者现金付费阅读。或者仅关注后阅读。
回答可以添加打赏
可关注问题，问题有回答时会收到通知
发布问题时可以设置悬赏积分或者现金。在采纳回答时分配给回答者
关联标签、加入全站检索

#### 数据分析
对用户所有的回答和文章的点赞、收藏、评论、阅读数做统计。可以按天查看所有或者单个回答和文章的趋势统计图

#### 用户模块
可绑定手机、邮箱、第三方账户（支付宝、Github）
设置独立路径链接
对所有关注、赞赏、评论、回答、收到打赏等操作的消息设置不接收或接收
拥有个人主页、可关注其它人。在个人主页展示最近的活跃动态
拥有积分和等级制度。可设置不同等级的每个操作可以获得不同的收益或积分
可以收藏回答或者文章。记录最近浏览的所有文章和回答
用户关键信息的变动需要手机、邮箱的验证码
用户信息加入全站检索

#### 用户钱包和收益
使用第三方支付进行充值和提现
记录余额、积分的每次变动
用户每天的收益（打赏、问题被采纳的悬赏、平台分成）以趋势统计图提供查询
平台的分成可以按照文章、回答的阅读量、收藏、点赞等数据计算比例。

#### 全站检索
全站基于Lucene检索
所有的文章、回答、标签、专栏、用户创建后自动加入索引队列
每个标签作为分词词组

### Todo
+ 文章、回答中，可以潜入多个付费模块，可出售课程，文章，漫画，创意作品，软件，电子书，音乐，游戏，咨询等服务轻松获得收入
+ 小程序、App

### 本地启动

在 config/config.js 中配置后端 api，http://g.aomao.com/ 是编辑器中 文本绘图 功能的后端支持，项目在 drawing.itellyou.com

```
proxy: {
    '/api/(latex|puml|graphviz|flowchart|mermaid)': {
        target: 'http://g.aomao.com/',
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
