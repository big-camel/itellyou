import React from 'react'
import { Menu } from 'antd'
import { Link } from 'umi'

const { Item } = Menu

function Sider({ dataSource , defaultKey }){

    return (
        <Menu defaultSelectedKeys={[defaultKey]}>
            {
                dataSource.map((item,index) => {
                    return <Item key={item.key || index}><Link to={item.to}>{item.title}</Link></Item>
                })
            }
        </Menu>
    )
}
export default Sider