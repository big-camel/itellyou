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
        Routes: ['src/pages/Authorized'],
        routes:[
            { path:'/question/new',name:'question.page.new',component:'./Question/Edit', authority: ['admin', 'user'] },
            { path:'/question/:question_id([\\d]+)/edit',name:'question.page.edit',component:'./Question/Edit', authority: ['admin', 'user']},
        ]
    },
    //tag/edit
    {
        path:'/tag/:tag_name([\\u4e00-\\u9fa5_a-z0-9-\\.%&#@]+)/edit',
        Routes: ['src/pages/Authorized'],
        routes:[
            { path:'/tag/:tag_name([\\u4e00-\\u9fa5_a-z0-9-\\.%&#@]+)/edit',name:'tagEdit',component:'./Tag/Edit', authority: ['admin', 'user'] }
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
            { path:'/tag',name:'tagIndex',component:'./Tag/Index' },
            { path:'/tag/list',name:'tagList',component:'./Tag/List' },
            { path:'/tag/review',name:'tagReview',component:'./Tag/Review', authority: ['admin'] },
            { path:'/tag/:tagName([\\u4e00-\\u9fa5_a-z0-9-\\.%&#@]+)',name:'tagDetail',component:'./Tag/Detail' },
            {
                component: '404',
            }
        ]
    }
]