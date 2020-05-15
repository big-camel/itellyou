export default [
    // user passport
    {
        path: '/:path(login|register|login/oauth)',
        component: '../layouts/PassportLayout',
        routes: [
            {
                path: '/login',
                name: 'login.page',
                component: './user/login',
                metas: {
                    keywords: '登陆,itellyou登陆',
                    description: 'ITELLYOU 用户登陆',
                },
            },
            {
                path: '/login/oauth',
                name: 'login.page.oauth',
                component: './user/login/Oauth',
            },
            {
                path: '/register',
                name: 'register.page',
                component: './user/register',
                metas: {
                    keywords: '注册,注册',
                    description: 'ITELLYOU 用户注册',
                },
            },
        ],
    },
    //question
    {
        path: '/question/(new|[\\d]+/edit)',
        component: '../layouts/BlankLayout',
        access: 'isLogin',
        wrappers: ['@/wrappers/auth'],
        routes: [
            {
                path: '/question/new',
                name: 'question.page.new',
                component: './question/edit',
            },
            {
                path: '/question/:id([\\d]+)/edit',
                name: 'question.page.edit',
                component: './question/edit',
            },
        ],
    },
    //tag/edit
    {
        path: '/tag/:id(\\d+)/edit',
        component: '../layouts/BlankLayout',
        access: 'isLogin',
        wrappers: ['@/wrappers/auth'],
        routes: [
            {
                path: '/tag/:id(\\d+)/edit',
                name: 'tag.page.edit',
                component: './tag/edit',
            },
        ],
    },
    // article
    {
        path: '/article/(new|[\\d]+/edit)',
        component: '../layouts/BlankLayout',
        wrappers: ['@/wrappers/auth'],
        access: 'isLogin',
        routes: [
            {
                path: '/article/new',
                name: 'article.page.new',
                component: './article/edit',
            },
            {
                path: '/article/:id(\\d+)/edit',
                name: 'article.page.edit',
                component: './article/edit',
            },
        ],
    },
    // preview
    {
        path: '/preview',
        component: '../layouts/BlankLayout',
        routes: [
            {
                path: '/preview',
                name: 'preview.page',
                component: './preview',
            },
        ],
    },
    //app
    {
        path: '/',
        component: '../layouts/BasicLayout',
        wrappers: ['@/wrappers/auth'],
        routes: [
            { path: '/', name: 'home.page.index', component: './home' },
            // Question
            { path: '/question', name: 'question.page.index', component: './question' },
            {
                path: '/question/:type(hot|reward|star)',
                name: 'question.page.index',
                component: './question',
            },
            {
                path: '/question/:id(\\d+)',
                name: 'question.page.detail',
                component: './question/detail',
            },
            {
                path: '/question/:id(\\d+)/answer/:answer_id(\\d+)',
                name: 'question.page.detail',
                component: './question/detail',
            },
            // Tag
            { path: '/tag', name: 'tag.page.index', component: './tag' },
            { path: '/tag/list', name: 'tag.page.list', component: './tag/list' },
            {
                path: '/tag/review',
                name: 'tagReview',
                component: './tag/Review',
                access: 'isAdmin',
            },
            { path: '/tag/:id(\\d+)', name: 'tag.page.detail', component: './tag/detail' },
            {
                path: '/tag/:id(\\d+)/:path([a-z]{1,50})',
                name: 'tag.page.detail',
                component: './tag/detail',
            },
            // Article
            { path: '/article', name: 'article.page.index', component: './article' },
            {
                path: '/article/:type(hot|reward|star)',
                name: 'article.page.index',
                component: './article',
            },
            {
                path: '/article/:id(\\d+)',
                name: 'article.page.detail',
                component: './article/detail',
            },
            // Search
            { path: '/search', name: 'search.page.index', component: './search' },
            // Column
            { path: '/column', name: 'column.page.index', component: './column' },
            {
                path: '/column/apply',
                name: 'column.page.apply',
                component: './column/apply',
                access: 'isLogin',
            },
            // User
            {
                path: '/dashboard',
                access: 'isLogin',
                routes: [
                    {
                        path: '/dashboard',
                        name: 'user.dashboard.recent',
                        component: './user/dashboard/recent',
                    },
                    {
                        path: '/dashboard/article',
                        name: 'user.dashboard.article',
                        component: './user/dashboard/article',
                    },
                    {
                        path: '/dashboard/question',
                        name: 'user.dashboard.question',
                        component: './user/dashboard/question',
                    },
                    {
                        path: '/dashboard/answer',
                        name: 'user.dashboard.answer',
                        component: './user/dashboard/answer',
                    },
                    {
                        path: '/dashboard/column',
                        name: 'user.dashboard.column',
                        component: './user/dashboard/column',
                    },
                    {
                        path: '/dashboard/follows',
                        name: 'user.dashboard.follows',
                        component: './user/dashboard/follows',
                    },
                    {
                        path: '/dashboard/wallet',
                        name: 'user.dashboard.wallet',
                        component: './user/dashboard/wallet',
                    },
                    {
                        path: '/dashboard/collections',
                        name: 'user.dashboard.collections',
                        component: './user/dashboard/collections',
                    },
                    {
                        path: '/dashboard/history',
                        name: 'user.dashboard.history',
                        component: './user/dashboard/history',
                    },
                ],
            },
            {
                path: '/settings',
                access: 'isLogin',
                routes: [
                    {
                        path: '/settings/profile',
                        name: 'user.settings.profile',
                        component: './user/settings/profile',
                    },
                    {
                        path: '/settings/account',
                        name: 'user.settings.account',
                        component: './user/settings/account',
                    },
                    {
                        path: '/settings/notifications',
                        name: 'user.settings.notifications',
                        component: './user/settings/notifications',
                    },
                ],
            },
            {
                path: '/notifications:path(/[a-zA-Z0-9_]+)?',
                name: 'user.notifications',
                component: './user/notifications',
                access: 'isLogin',
            },
            {
                path: '/403',
                name: '403.page',
                component: './403',
            },
            {
                path: '/500',
                name: '500.page',
                component: './500',
            },
            // Path
            {
                path: '/:path([a-zA-Z0-9_.]{3,30}|[a-zA-Z0-9_.]{3,30}/.*)',
                name: 'sys.path',
                component: './path',
            },
            {
                component: '404',
            },
        ],
    },
];
