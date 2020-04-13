import React, { useState, useEffect } from 'react';
import { Link } from 'umi';
import styles from './index.less';
import { Menu } from 'antd';

const menus = [
    {
        key: 'home',
        title: '首页',
        href: '',
    },
    {
        key: 'question',
        title: '问答',
    },
    {
        key: 'article',
        title: '文章',
    },
    {
        key: 'column',
        title: '专栏',
    },
    {
        key: 'tag',
        title: '标签',
    },
    {
        key: 'msdn',
        title: 'MSDN',
        href: 'https://msdn.itellyou.cn',
        target: '_blank',
    },
];

export default ({ location: { pathname } }) => {
    const [defaultKey, setDefaultKey] = useState('');
    useEffect(() => {
        let path = pathname.split('/');
        if (path.length === 2 && path[1] === '') path = ['home'];

        for (let p of path) {
            const menu = menus.find(m => m.key === p);
            if (menu) {
                setDefaultKey(menu.key);
                break;
            }
        }
    }, [pathname]);

    return (
        <Menu className={styles['nav']} mode="horizontal" selectedKeys={[defaultKey]}>
            {menus.map(({ key, href, title, ...props }) => {
                const link = href === undefined ? key : href;
                const renderLink = () => {
                    if (link.indexOf('http') === 0)
                        return (
                            <a {...props} href={link}>
                                {title}
                            </a>
                        );
                    return (
                        <Link {...props} to={`/${link}`}>
                            {title}
                        </Link>
                    );
                };
                return (
                    <Menu.Item key={key} className={styles['item']}>
                        {renderLink()}
                    </Menu.Item>
                );
            })}
        </Menu>
    );
};
