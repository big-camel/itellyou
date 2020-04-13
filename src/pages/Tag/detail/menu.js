import Intro from './components/Intro';
import Question from './components/Question';
import Article from './components/Article';
import Column from './components/Column';

export default [
    {
        key: 'intro',
        title: '简介',
        component: Intro,
    },
    {
        key: 'question',
        title: '问题',
        component: Question,
    },
    {
        key: 'article',
        title: '文章',
        component: Article,
    },
    {
        key: 'column',
        title: '专栏',
        component: Column,
    },
];
