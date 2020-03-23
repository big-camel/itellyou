export default [
     // user passport
    {
        path: '/:path(login|register)',
        component: '../layouts/PassportLayout',
        routes: [
            { path: '/login', name: 'login.page', component: './user/login' },
            { path: '/register', name: 'register.page', component: './user/register' }
        ],
    },
    //question
    {
        path:'/question/(new|[\\d]+/edit)',
        component:'../layouts/BlankLayout',
        Routes: ['src/pages/Authorized'],
        routes:[
            { path:'/question/new',name:'question.page.new',component:'./question/edit', authority: ['admin', 'user'] },
            { path:'/question/:id([\\d]+)/edit',name:'question.page.edit',component:'./question/edit', authority: ['admin', 'user']},
        ]
    },
    //tag/edit
    {
        path:'/tag/:id(\\d+)/edit',
        component:'../layouts/BlankLayout',
        Routes: ['src/pages/Authorized'],
        routes:[
            { path:'/tag/:id(\\d+)/edit',name:'tag.page.edit',component:'./tag/edit', authority: ['admin', 'user'] }
        ]
    },
    // article
    {
        path:'/article/(new|[\\d]+/edit)',
        component:'../layouts/BlankLayout',
        Routes: ['src/pages/Authorized'],
        routes:[
            { path:'/article/new',name:'article.page.new',component:'./article/edit', authority: ['admin', 'user'] },
            { path:'/article/:id(\\d+)/edit',name:'article.page.edit',component:'./article/edit', authority: ['admin', 'user'] }
        ]
    },
    //app
    {
        path:'/',
        component:'../layouts/BasicLayout',
        Routes: ['src/pages/Authorized'],
        routes:[
            { path: '/', name: 'home.page.index', component: './home' },
            // Question
            { path:'/question',name:'question.page.index',component:'./question' },
            { path:'/question/:type(hot|reward|star)',name:'question.page.index',component:'./question' },
            { path:'/question/:id(\\d+)',name:'question.page.detail',component:'./question/detail' },
            { path:'/question/:id(\\d+)/answer/:answerId(\\d+)',name:'question.page.detail',component:'./question/detail' },
            // Tag
            { path:'/tag',name:'tag.page.index',component:'./tag' },
            { path:'/tag/list',name:'tag.page.list',component:'./tag/List' },
            { path:'/tag/review',name:'tagReview',component:'./tag/Review', authority: ['admin'] },
            { path:'/tag/:id(\\d+)',name:'tag.page.detail',component:'./tag/detail' },
            // Article
            { path:'/article',name:'article.page.index',component:'./article' },
            { path:'/article/:type(hot|reward|star)',name:'article.page.index',component:'./article' },
            { path:'/article/:id(\\d+)',name:'article.page.detail',component:'./article/detail' },
            // Search
            { path:'/search',name:'search.page.index',component:'./search' },
            // Column
            { path:'/column',name:'column.page.index',component:'./column' },
            { path:'/column/apply',name:'column.page.apply',component:'./column/apply' },
            // User
            { path:'/dashboard',name:'user.dashboard.recent',component:'./user/dashboard/recent', authority: ['admin', 'user'] },
            { path:'/dashboard/article',name:'user.dashboard.article',component:'./user/dashboard/article', authority: ['admin', 'user'] },
            { path:'/dashboard/question',name:'user.dashboard.question',component:'./user/dashboard/question', authority: ['admin', 'user'] },
            { path:'/dashboard/answer',name:'user.dashboard.answer',component:'./user/dashboard/answer', authority: ['admin', 'user'] },
            { path:'/dashboard/follows',name:'user.dashboard.follows',component:'./user/dashboard/follows', authority: ['admin', 'user'] },
            { path:'/dashboard/finance',name:'user.dashboard.finance',component:'./user/dashboard/finance', authority: ['admin', 'user'] },
            { path:'/dashboard/collections',name:'user.dashboard.collections',component:'./user/dashboard/collections', authority: ['admin', 'user'] },
            { path:'/dashboard/history',name:'user.dashboard.history',component:'./user/dashboard/history', authority: ['admin', 'user'] },
            { path:'/settings/profile',name:'user.settings.profile',component:'./user/settings/profile', authority: ['admin', 'user'] },
            { path:'/settings/account',name:'user.settings.account',component:'./user/settings/account', authority: ['admin', 'user'] },
            { path:'/settings/notifications',name:'user.settings.notifications',component:'./user/settings/notifications', authority: ['admin', 'user'] },
            { path:'/notifications',name:'user.notifications',component:'./user/notifications', authority: ['admin', 'user'] },
            // Path
            { path:'/:path([a-zA-Z0-9_.]{4,50}|[a-zA-Z0-9_.]{4,50}/.*)',name:'sys.path',component:'./path'},
            {
                component: '404',
            }
        ]
    }
]