import React from 'react';
import { Link } from 'umi';
import { Card, Menu } from 'antd';
import './index.less';

export default ({ dataSource, defaultKey, children }) => {
    const menu = dataSource.find(item => item.key === defaultKey);
    return (
        <div className="card-menu-wrapper">
            <Card
                title={
                    <Menu mode="horizontal" defaultSelectedKeys={[defaultKey]}>
                        {dataSource.map(({ key, title, to }) => (
                            <Menu.Item key={key}>
                                <Link to={to}>{title}</Link>
                            </Menu.Item>
                        ))}
                    </Menu>
                }
            >
                {menu.component || children}
            </Card>
        </div>
    );
};
