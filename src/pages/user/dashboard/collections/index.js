import React from 'react'
import classNames from 'classnames'
import Layout from '../components/Layout'
import { Menu } from 'antd'
import { Link } from 'umi'
import Article from './Article'
import Answer from './Answer'

const menus = [
    {
        key:"article",
        title:"收藏的文章"
    },
    {
        key:"answer",
        title:"收藏的回答"
    }
]
export default ({ location : { query } }) => {
    const type = query.type || "article"

    const render = () => {
        switch(type){
            case "article": return <Article />
            case "answer": return <Answer />
        }
    }

    return (
        <Layout defaultKey="star">
            <Menu>
                {
                    menus.map(({ key , title }) => <Menu.Item 
                    key={key} 
                    className={classNames({"active" : key === type})}>
                        <Link to={`collections?type=${key}`}>{ title }</Link>
                    </Menu.Item>)
                }
            </Menu>
            {
                render()
            }
        </Layout>
        
    )
}