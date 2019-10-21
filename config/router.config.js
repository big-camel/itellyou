export default [
     // user passport
    {
        path: '/user/:path(login|register)',
        component: '../layouts/PassportLayout',
        routes: [
            { path: '/user/login', name: 'login', component: './User/Login' },
            { path: '/user/register', name: 'register', component: './User/Register' },
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
        path:'/question/:path(new|[\\d]+/edit)',
        Routes: ['src/pages/Authorized'],
        routes:[
            { path:'/question/new',name:'questionNew',component:'./Question/Edit', authority: ['admin', 'user'] },
            { path:'/question/:question_id([\\d]+)/edit',name:'questionEdit',component:'./Question/Edit', authority: ['admin', 'user']},
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
            { path:'/write',name:'write',component:'./Blogs/Write', authority: ['admin', 'user'] },
            // Question
            { path:'/question',name:'questionIndex',component:'./Question/Index' },
            { path:'/question/:id([\\d]+)',name:'questionDetail',component:'./Question/Detail' },
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