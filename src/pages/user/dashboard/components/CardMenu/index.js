import React from 'react';
import classnames from 'classnames';
import { Link } from 'umi';
import { Card, Menu } from 'antd';
import './index.less';

export default ({ dataSource = [], defaultKey, itemClick, extra, contentFull, children }) => {
    const menu = dataSource.find((item) => item.key === defaultKey) || {};
    const componet = menu.component || children;
    return (
        <div
            className={classnames(
                'card-menu-wrapper',
                { 'card-full-wrapper': contentFull },
                { 'card-no-header': dataSource.length === 0 },
            )}
        >
            <Card
                extra={extra}
                title={
                    dataSource.length > 0 && (
                        <Menu mode="horizontal" defaultSelectedKeys={[defaultKey]}>
                            {dataSource.map(({ key, title, to }) => (
                                <Menu.Item key={key}>
                                    {to && <Link to={to}>{title}</Link>}
                                    {!to && (
                                        <a
                                            onClick={() =>
                                                itemClick ? itemClick(key) : (function () {})()
                                            }
                                        >
                                            {title}
                                        </a>
                                    )}
                                </Menu.Item>
                            ))}
                        </Menu>
                    )
                }
            >
                {componet}
            </Card>
        </div>
    );
};
