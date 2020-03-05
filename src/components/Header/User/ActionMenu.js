import React from 'react'
import { Menu , Icon , Popover } from 'antd'
import { Link } from 'umi'

export default () => {

    const menu = (
        <Menu>
            <Menu.Item key="question"><Link to="/question/new"><Icon type="question" />提问</Link></Menu.Item>
            <Menu.Item key="article"><Link to="/article/new"><Icon type="setting" />写文章</Link></Menu.Item>
        </Menu>
    )

    return (
        <Popover 
        content={menu}
        >
            <Icon type="plus" />
        </Popover>
    )
}