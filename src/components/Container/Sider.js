import React from 'react';
import { Menu } from 'antd';
import { Link } from 'umi';
import './index.less';

const { Item, Divider } = Menu;

function Sider({ dataSource, defaultKey, activeKey, onSelect }) {
    return (
        <Menu
            defaultSelectedKeys={[defaultKey]}
            selectedKeys={[activeKey]}
            className="layout-sider"
            onSelect={onSelect}
        >
            {dataSource.map((item, index) => {
                if (item.key === 'divider') return <Divider key={index} />;
                return (
                    <Item key={item.key || index}>
                        {item.to ? <Link to={item.to}>{item.title}</Link> : <a>{item.title}</a>}
                    </Item>
                );
            })}
        </Menu>
    );
}
export default Sider;
