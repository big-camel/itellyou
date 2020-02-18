import React from 'react'
import classNames from 'classnames'
import Layout from '../components/Layout'
import { Menu } from 'antd'
import { Link } from 'umi'
import Finance from './Finance'
import Record from './Record'

const menus = [
    {
        key:"finance",
        title:"资产"
    },
    /*{
        key:"record",
        title:"记录"
    }*/
]
export default ({ location : { query } }) => {
    const type = query.type || "finance"

    const render = () => {
        switch(type){
            case "finance": return <Finance />
            case "record": return <Record />
        }
    }

    return (
        <Layout defaultKey="finance">
            <Menu>
                {
                    menus.map(({ key , title }) => <Menu.Item 
                    key={key} 
                    className={classNames({"active" : key === type})}>
                        <Link to={`finance?type=${key}`}>{ title }</Link>
                    </Menu.Item>)
                }
            </Menu>
            {
                render()
            }
        </Layout>
        
    )
}