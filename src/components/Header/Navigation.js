import React, { useState, useEffect } from 'react';
import { Link } from 'umi';
import { Menu, Popover } from 'antd';
import styles from './index.less';

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
    // {
    //     key: 'knowledge',
    //     title: '知识',
    // },
    {
        key: 'column',
        title: '专栏',
    },
    {
        key: 'tag',
        title: '标签',
    },
    {
        key: 'download',
        title: '下载',
    },
    // {
    //     key: 'find',
    //     title: '发现',
    //     child: [
    //         {
    //             key: 'column',
    //             title: '专栏',
    //         },
    //         {
    //             key: 'tag',
    //             title: '标签',
    //         },
    //         {
    //             key: 'yun',
    //             title: '云服务',
    //         },
    //     ],
    // },
];

export default ({ location: { pathname }, isMobile, onChange }) => {
    const [defaultKey, setDefaultKey] = useState('');

    useEffect(() => {
        let path = pathname.split('/');
        if (path.length === 2 && path[1] === '') path = ['home'];

        for (let p of path) {
            const menu = menus.find((m) => m.key === p);
            if (menu) {
                setDefaultKey(menu.key);
                break;
            }
        }
    }, [pathname]);

    const renderLink = ({ key, href, title, ...props }) => {
        const link = href === undefined ? key : href;
        if (link.indexOf('http') === 0)
            return (
                <a {...props} href={link}>
                    {title}
                </a>
            );
        return (
            <Link {...props} to={`/${link}`} onClick={onChange}>
                {title}
            </Link>
        );
    };

    const renderPopoverMenu = ({ title, child }) => {
        const popoveMenu = (
            <Menu>
                {child.map((item) => (
                    <Menu.Item key={item.key}>{renderLink(item)}</Menu.Item>
                ))}
            </Menu>
        );
        return (
            <a>
                <Popover
                    overlayClassName={'popover-menu'}
                    content={popoveMenu}
                    arrowPointAtCenter
                    placement="bottomRight"
                >
                    <span className={styles['popover-trigger']}>{title}</span>
                </Popover>
            </a>
        );
    };
    return (
        <Menu
            className={isMobile ? styles['m-nav'] : styles['nav']}
            mode={isMobile ? 'vertical' : 'horizontal'}
            selectedKeys={[defaultKey]}
        >
            {menus.map((item) => {
                if (isMobile && item.child) {
                    return item.child.map((child) => (
                        <Menu.Item key={child.key} className={styles['item']}>
                            {renderLink(child)}
                        </Menu.Item>
                    ));
                }
                return (
                    <Menu.Item key={item.key} className={styles['item']}>
                        {item.child ? renderPopoverMenu(item) : renderLink(item)}
                    </Menu.Item>
                );
            })}
        </Menu>
    );
};
