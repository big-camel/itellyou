export default [
     // user passport
    {
        path: '/user/:path(login|register)',
        component: '../layouts/PassportLayout',
        routes: [
            { path: '/user/login', name: 'login.page', component: './User/Login' },
            { path: '/user/register', name: 'register.page', component: './User/Register' },
            {
                component: '404',
            }
        ],
    },
    //user
    {
        path:'/user',
        component:'../layouts/UserLayout',
        Routes: ['src/pages/Authorized'],
        routes:[
            { path:'/user',name:'userCenter',component:'./User/Index', authority: ['admin', 'user'] },
            { path:'/user/draft',name:'userDraft',component:'./User/Draft', authority: ['admin', 'user'] }
        ]
    },
    //question
    {
        path:'/question/(new|[\\d]+/edit)',
        component:'../layouts/BlankLayout',
        Routes: ['src/pages/Authorized'],
        routes:[
            { path:'/question/new',name:'question.page.new',component:'./Question/Edit', authority: ['admin', 'user'] },
            { path:'/question/:id([\\d]+)/edit',name:'question.page.edit',component:'./Question/Edit', authority: ['admin', 'user']},
        ]
    },
    //tag/edit
    {
        path:'/tag/:id(\\d+)/edit',
        component:'../layouts/BlankLayout',
        Routes: ['src/pages/Authorized'],
        routes:[
            { path:'/tag/:id(\\d+)/edit',name:'tag.page.edit',component:'./Tag/Edit', authority: ['admin', 'user'] }
        ]
    },
    // article
    {
        path:'/article/(new|[\\d]+/edit)',
        component:'../layouts/BlankLayout',
        Routes: ['src/pages/Authorized'],
        routes:[
            { path:'/article/new',name:'article.page.new',component:'./Article/Edit', authority: ['admin', 'user'] },
            { path:'/article/:id(\\d+)/edit',name:'article.page.edit',component:'./Article/Edit', authority: ['admin', 'user'] }
        ]
    },
    //app
    {
        path:'/',
        component:'../layouts/BasicLayout',
        Routes: ['src/pages/Authorized'],
        routes:[
            { path: '/', name: 'home', component: './Home/Index' },
            // Question
            { path:'/question',name:'question.page.index',component:'./Question/Index' },
            { path:'/question/:type(hot|reward|star)',name:'question.page.index',component:'./Question/Index' },
            { path:'/question/:id(\\d+)',name:'question.page.detail',component:'./Question/Detail' },
            { path:'/question/:id(\\d+)/answer/:answerId(\\d+)',name:'question.page.detail',component:'./Question/Detail' },
            // Tag
            { path:'/tag',name:'tag.page.index',component:'./Tag/Index' },
            { path:'/tag/list',name:'tag.page.list',component:'./Tag/List' },
            { path:'/tag/review',name:'tagReview',component:'./Tag/Review', authority: ['admin'] },
            { path:'/tag/:id(\\d+)',name:'tag.page.detail',component:'./Tag/Detail' },
            // Article
            { path:'/article',name:'article.page.index',component:'./Article' },
            { path:'/article/:type(hot|reward|star)',name:'article.page.index',component:'./Article' },
            { path:'/article/:id(\\d+)',name:'article.page.detail',component:'./Article/Detail' },
            // Search
            { path:'/search',name:'search.page.index',component:'./Search' },
            // Column
            { path:'/column',name:'column.page.index',component:'./Column' },
            { path:'/column/apply',name:'column.page.apply',component:'./Column/Apply' },
            { path:'/column/:id(\\d+)',name:'column.page.detail',component:'./Column/Detail' },
            {
                component: '404',
            }
        ]
    }
]