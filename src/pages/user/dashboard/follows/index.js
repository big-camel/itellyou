import React from 'react'
import classNames from 'classnames'
import Layout from '../components/Layout'
import { Menu } from 'antd'
import User from './User'
import { Link } from 'umi'
import Follower from './Follower'
import Column from './Column'
import Question from './Question'
import Tag from './Tag'

const menus = [
    {
        key:"user",
        title:"关注的人"
    },
    {
        key:"follower",
        title:"关注我的人"
    },
    {
        key:"column",
        title:"关注的专栏"
    },
    {
        key:"question",
        title:"关注的提问"
    },
    {
        key:"tag",
        title:"关注的标签"
    }
]
export default ({ location : { query } }) => {
    const type = query.type || "user"

    const render = () => {
        switch(type){
            case "user": return <User />
            case "follower": return <Follower />
            case "column": return <Column />
            case "question": return <Question />
            case "tag": return <Tag />
        }
    }

    return (
        <Layout defaultKey="star">
            <Menu>
                {
                    menus.map(({ key , title }) => <Menu.Item 
                    key={key} 
                    className={classNames({"active" : key === type})}>
                        <Link to={`follows?type=${key}`}>{ title }</Link>
                    </Menu.Item>)
                }
            </Menu>
            {
                render()
            }
        </Layout>
        
    )
}