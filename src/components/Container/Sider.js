import React from 'react';
import { Menu } from 'antd';
import { Link } from 'umi';
import './index.less';

const { Item, Divider } = Menu;

function Sider({ dataSource, defaultKey }) {
    return (
        <Menu defaultSelectedKeys={[defaultKey]} className="layout-sider">
            {dataSource.map((item, index) => {
                if (item.key === 'divider') return <Divider key={index} />;
                return (
                    <Item key={item.key || index}>
                        <Link to={item.to}>{item.title}</Link>
                    </Item>
                );
            })}
        </Menu>
    );
}
export default Sider;
