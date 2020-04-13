import React from 'react';
import { Popover, Avatar, Menu } from 'antd';
import { Link, useDispatch } from 'umi';
import styles from './index.less';
import { UserOutlined, SettingOutlined, LoginOutlined } from '@ant-design/icons';

export default ({ avatar, name, path }) => {
    const dispatch = useDispatch();

    const onLogout = () => {
        dispatch({
            type: 'user/logout',
        });
    };

    const menu = (
        <div className={styles['user-menu']}>
            <div className={styles['info']}>
                <span className={styles['name']}>{name}</span>
            </div>
            <Menu>
                <Menu.Divider />
                <Menu.Item key="userCenter">
                    <Link to={`/${path}`}>
                        <UserOutlined />
                        个人主页
                    </Link>
                </Menu.Item>
                <Menu.Item key="userSetting">
                    <Link to="/settings/profile">
                        <SettingOutlined />
                        账户设置
                    </Link>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="logout" onClick={onLogout}>
                    <LoginOutlined />
                    退出
                </Menu.Item>
            </Menu>
        </div>
    );
    return (
        <Popover
            overlayClassName={styles['popover-menu']}
            content={menu}
            arrowPointAtCenter
            placement="bottomRight"
        >
            <Link to="/dashboard">
                <Avatar src={avatar} size={24} />
            </Link>
        </Popover>
    );
};
