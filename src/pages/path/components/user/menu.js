import Activity from './components/Activity'
import Answer from './components/Answer'
import Question from './components/Question'
import Article from './components/Article'
import Column from './components/Column'
import Follows from './components/Follows'
import Follower from './components/Follower'

export default [
    {
        key:"activity",
        title:"动态",
        component:Activity
    },
    {
        key:"answer",
        title:"回答",
        component:Answer
    },
    {
        key:"question",
        title:"问题",
        component:Question
    },
    {
        key:"article",
        title:"文章",
        component:Article
    },
    {
        key:"column",
        title:"专栏",
        component:Column
    },
    {
        key:"follows",
        title:"关注了",
        component:Follows
    },
    {
        key:"follower",
        title:"关注者",
        component:Follower
    }
]